CREATE OR REPLACE FUNCTION public.send_stanza_message(target_user_id uuid, message_content text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
begin
  -- Gate 2.1: blocco transazionale del match prima dell'invio.
  if auth.uid() is null or target_user_id is null or target_user_id = auth.uid() then
    return false;
  end if;

  perform 1
    from public.match_scores ms
   where ms.user_a = least(auth.uid(), target_user_id)
     and ms.user_b = greatest(auth.uid(), target_user_id)
     and ms.score = 100
   for update;

  if not found then
    return false;
  end if;

  if not public.can_open_stanza(target_user_id)
    or nullif(btrim(message_content), '') is null
    or char_length(btrim(message_content)) > 2000 then
    return false;
  end if;

  insert into public.messaggi (mittente_id, destinatario_id, testo, letto)
  values (auth.uid(), target_user_id, btrim(message_content), false);
  return true;
end;
$function$;
