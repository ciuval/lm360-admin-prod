create table if not exists public.stanze_360 (
  user_id uuid primary key references auth.users(id) on delete cascade,
  qualities_offered text[] not null default '{}',
  qualities_sought text[] not null default '{}',
  imperfections text[] not null default '{}',
  imperfections_accepted text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stanza_qualities_offered_count check (cardinality(qualities_offered) = 5),
  constraint stanza_qualities_sought_count check (cardinality(qualities_sought) = 5),
  constraint stanza_imperfections_count check (cardinality(imperfections) <= 3),
  constraint stanza_imperfections_accepted_count check (cardinality(imperfections_accepted) <= 5)
);

alter table public.stanze_360 drop constraint if exists stanza_qualities_offered_values;
alter table public.stanze_360 add constraint stanza_qualities_offered_values check (
  qualities_offered <@ array['affettuoso','affidabile','altruista','calmo','coerente','coraggioso','curioso','determinato','empatico','indipendente','ironico','leale','paziente','premuroso','responsabile','rispettoso','romantico','sincero','spontaneo','socievole']::text[]
);
alter table public.stanze_360 drop constraint if exists stanza_qualities_sought_values;
alter table public.stanze_360 add constraint stanza_qualities_sought_values check (
  qualities_sought <@ array['affettuoso','affidabile','altruista','calmo','coerente','coraggioso','curioso','determinato','empatico','indipendente','ironico','leale','paziente','premuroso','responsabile','rispettoso','romantico','sincero','spontaneo','socievole']::text[]
);
alter table public.stanze_360 drop constraint if exists stanza_imperfections_values;
alter table public.stanze_360 add constraint stanza_imperfections_values check (
  imperfections <@ array['disordinato','geloso','impulsivo','permaloso','ritardatario','riservato','testardo','timido','troppo_diretto','lavoro_troppo']::text[]
);
alter table public.stanze_360 drop constraint if exists stanza_imperfections_accepted_values;
alter table public.stanze_360 add constraint stanza_imperfections_accepted_values check (
  imperfections_accepted <@ array['disordinato','geloso','impulsivo','permaloso','ritardatario','riservato','testardo','timido','troppo_diretto','lavoro_troppo']::text[]
);

alter table public.stanze_360 enable row level security;
revoke all on public.stanze_360 from anon;
grant select, insert, update, delete on public.stanze_360 to authenticated;

drop policy if exists "stanze_select_authenticated" on public.stanze_360;
drop policy if exists "stanze_select_own" on public.stanze_360;
create policy "stanze_select_own" on public.stanze_360 for select to authenticated using (auth.uid() = user_id);
drop policy if exists "stanze_insert_own" on public.stanze_360;
create policy "stanze_insert_own" on public.stanze_360 for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "stanze_update_own" on public.stanze_360;
create policy "stanze_update_own" on public.stanze_360 for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "stanze_delete_own" on public.stanze_360;
create policy "stanze_delete_own" on public.stanze_360 for delete to authenticated using (auth.uid() = user_id);

create or replace function public.get_stanza_compatibility(target_user_id uuid)
returns table (
  compatibility_score integer,
  opens boolean,
  both_ready boolean,
  shared_qualities text[]
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
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
$$;

revoke all on function public.get_stanza_compatibility(uuid) from public, anon;
grant execute on function public.get_stanza_compatibility(uuid) to authenticated;

create or replace function public.can_open_stanza(target_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  compatible boolean := false;
  reciprocal boolean := false;
  first_user uuid;
  second_user uuid;
begin
  if auth.uid() is null or target_user_id is null or target_user_id = auth.uid() then
    return false;
  end if;

  select coalesce(result.opens, false) into compatible
  from public.get_stanza_compatibility(target_user_id) result
  limit 1;

  first_user := least(auth.uid(), target_user_id);
  second_user := greatest(auth.uid(), target_user_id);
  select exists (
    select 1 from public.match_scores
    where user_a = first_user and user_b = second_user and score = 100
  ) into reciprocal;

  return compatible and reciprocal;
end;
$$;

revoke all on function public.can_open_stanza(uuid) from public, anon;
grant execute on function public.can_open_stanza(uuid) to authenticated;

create or replace function public.send_stanza_message(target_user_id uuid, message_content text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.can_open_stanza(target_user_id)
    or nullif(btrim(message_content), '') is null
    or char_length(btrim(message_content)) > 2000 then
    return false;
  end if;

  insert into public.messaggi (mittente_id, destinatario_id, contenuto, letto)
  values (auth.uid(), target_user_id, btrim(message_content), false);
  return true;
end;
$$;

revoke all on function public.send_stanza_message(uuid, text) from public, anon;
grant execute on function public.send_stanza_message(uuid, text) to authenticated;

-- Gli utenti inviano messaggi soltanto attraverso il controllo server-side qui sopra.
revoke insert on public.messaggi from authenticated;
