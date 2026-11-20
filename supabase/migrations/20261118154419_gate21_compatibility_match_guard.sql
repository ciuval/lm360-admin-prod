CREATE OR REPLACE FUNCTION public.get_stanza_compatibility(target_user_id uuid)
 RETURNS TABLE(compatibility_score integer, opens boolean, both_ready boolean, shared_qualities text[])
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  mine public.stanze_360%rowtype;
  theirs public.stanze_360%rowtype;
  toward_mine numeric := 0;
  toward_theirs numeric := 0;
  accepts_mine numeric := 1;
  accepts_theirs numeric := 1;
  calculated integer := 0;
begin
  if auth.uid() is null or target_user_id is null or target_user_id = auth.uid() then
    return;
  end if;

  -- Gate 2.1: nessuna compatibilita senza match reciproco attivo.
  if not exists (
    select 1
    from public.match_scores ms
    where ms.user_a = least(auth.uid(), target_user_id)
      and ms.user_b = greatest(auth.uid(), target_user_id)
      and ms.score = 100
  ) then
    return;
  end if;

  if not exists (
    select 1 from public.profili
    where id = target_user_id and status_account = 'attivo'
  ) then
    return;
  end if;

  select * into mine from public.stanze_360 where user_id = auth.uid();
  select * into theirs from public.stanze_360 where user_id = target_user_id;

  if mine.user_id is null or theirs.user_id is null
    or cardinality(mine.qualities_offered) <> 5
    or cardinality(mine.qualities_sought) <> 5
    or cardinality(theirs.qualities_offered) <> 5
    or cardinality(theirs.qualities_sought) <> 5 then
    return query select null::integer, false, false, '{}'::text[];
    return;
  end if;

  select count(*)::numeric / 5 into toward_mine
  from unnest(mine.qualities_sought) quality where quality = any(theirs.qualities_offered);
  select count(*)::numeric / 5 into toward_theirs
  from unnest(theirs.qualities_sought) quality where quality = any(mine.qualities_offered);

  if cardinality(mine.imperfections) > 0 then
    select count(*)::numeric / cardinality(mine.imperfections) into accepts_mine
    from unnest(mine.imperfections) imperfection where imperfection = any(theirs.imperfections_accepted);
  end if;
  if cardinality(theirs.imperfections) > 0 then
    select count(*)::numeric / cardinality(theirs.imperfections) into accepts_theirs
    from unnest(theirs.imperfections) imperfection where imperfection = any(mine.imperfections_accepted);
  end if;

  calculated := round(toward_mine * 40 + toward_theirs * 40 + ((accepts_mine + accepts_theirs) / 2) * 20);

  return query
  select calculated,
         calculated >= 50,
         true,
         array(
           select distinct quality
           from unnest(mine.qualities_sought || theirs.qualities_sought) quality
           where (quality = any(mine.qualities_sought) and quality = any(theirs.qualities_offered))
              or (quality = any(theirs.qualities_sought) and quality = any(mine.qualities_offered))
           order by quality
         );
end;
$function$;
