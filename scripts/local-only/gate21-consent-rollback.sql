-- LoveMatch360 / Ponte360: SOLO PROVA SQL TEMPORANEA DEL CONSENSO.
-- NON migration. Non modifica tabelle esistenti; ogni oggetto viene ROLLBACK.
-- La prova usa claim sintetici impostati dalla sessione psql: NON e' un test Auth JWT/E2E.
-- Vietato copiare/eseguire sul cloud. SOLO Docker LM360_FASE2_LAB con wrapper.
\set ON_ERROR_STOP on
\set QUIET 1
begin;

do $guard$
begin
  if current_database() <> 'postgres'
     or to_regnamespace('lm360_gate21_consent_probe') is not null
     or to_regrole('authenticated') is null
     or to_regrole('anon') is null
     or to_regprocedure('auth.uid()') is null then
    raise exception 'GATE21_CONSENT_PREFLIGHT_FAILED';
  end if;
end
$guard$;

create schema lm360_gate21_consent_probe;
revoke all on schema lm360_gate21_consent_probe from public, anon, authenticated;
grant usage on schema lm360_gate21_consent_probe to authenticated;

create table lm360_gate21_consent_probe.sessions (
  session_id bigint primary key,
  user_a uuid not null,
  user_b uuid not null,
  mediator uuid not null,
  consent_a boolean not null default false,
  consent_b boolean not null default false,
  ended boolean not null default false,
  closed boolean not null default false,
  blocked boolean not null default false,
  constraint distinct_actors check (user_a <> user_b and user_a <> mediator and user_b <> mediator)
);
alter table lm360_gate21_consent_probe.sessions enable row level security;
revoke all on lm360_gate21_consent_probe.sessions from public, anon, authenticated;

create function lm360_gate21_consent_probe.consent(p_session_id bigint)
returns boolean
language plpgsql security definer set search_path = ''
as $fn$
declare who uuid := auth.uid();
begin
  if who is null then return false; end if;
  update lm360_gate21_consent_probe.sessions s
     set consent_a = case when s.user_a = who then true else s.consent_a end,
         consent_b = case when s.user_b = who then true else s.consent_b end
   where s.session_id = p_session_id
     and (s.user_a = who or s.user_b = who)
     and not (s.ended or s.closed or s.blocked);
  return found;
end
$fn$;

create function lm360_gate21_consent_probe.can_open(p_session_id bigint)
returns boolean
language plpgsql security definer set search_path = ''
as $fn$
declare who uuid := auth.uid();
begin
  if who is null then return false; end if;
  return exists (
    select 1 from lm360_gate21_consent_probe.sessions s
     where s.session_id = p_session_id
       and who in (s.user_a, s.user_b, s.mediator)
       and s.consent_a and s.consent_b
       and not (s.ended or s.closed or s.blocked)
  );
end
$fn$;

create function lm360_gate21_consent_probe.withdraw(p_session_id bigint)
returns boolean
language plpgsql security definer set search_path = ''
as $fn$
declare who uuid := auth.uid();
begin
  if who is null then return false; end if;
  update lm360_gate21_consent_probe.sessions s
     set ended = true
   where s.session_id = p_session_id
     and (s.user_a = who or s.user_b = who)
     and not s.ended;
  return found;
end
$fn$;

revoke all on function lm360_gate21_consent_probe.consent(bigint) from public, anon, authenticated;
revoke all on function lm360_gate21_consent_probe.can_open(bigint) from public, anon, authenticated;
revoke all on function lm360_gate21_consent_probe.withdraw(bigint) from public, anon, authenticated;
grant execute on function lm360_gate21_consent_probe.consent(bigint) to authenticated;
grant execute on function lm360_gate21_consent_probe.can_open(bigint) to authenticated;
grant execute on function lm360_gate21_consent_probe.withdraw(bigint) to authenticated;

-- UUID fittizi convenzionali: mai account creati, nessun dato reale letto.
insert into lm360_gate21_consent_probe.sessions
  (session_id, user_a, user_b, mediator, consent_a, consent_b, closed, blocked)
values
  (1, '10000000-0000-4000-8000-000000000001',
      '10000000-0000-4000-8000-000000000002',
      '10000000-0000-4000-8000-000000000003', false, false, false, false),
  (2, '10000000-0000-4000-8000-000000000001',
      '10000000-0000-4000-8000-000000000002',
      '10000000-0000-4000-8000-000000000003', true, true, true, false),
  (3, '10000000-0000-4000-8000-000000000001',
      '10000000-0000-4000-8000-000000000002',
      '10000000-0000-4000-8000-000000000003', true, true, false, true);

-- I ruoli anon/authenticated non leggono direttamente la tabella del consenso.
do $grants$
begin
  if has_table_privilege('anon', 'lm360_gate21_consent_probe.sessions', 'SELECT')
     or has_table_privilege('authenticated', 'lm360_gate21_consent_probe.sessions', 'SELECT')
     or has_table_privilege('authenticated', 'lm360_gate21_consent_probe.sessions', 'UPDATE')
     or has_function_privilege('anon', 'lm360_gate21_consent_probe.consent(bigint)', 'EXECUTE')
     or has_function_privilege('anon', 'lm360_gate21_consent_probe.can_open(bigint)', 'EXECUTE')
     or has_function_privilege('anon', 'lm360_gate21_consent_probe.withdraw(bigint)', 'EXECUTE')
  then raise exception 'GATE21_CONSENT_PRIVILEGE_FAILED'; end if;
end
$grants$;

-- Simuliamo il claim A, B, mediatore e terzo nelle rispettive sessioni SQL.
set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000003', true);
do $mediator_pre$
begin
  if lm360_gate21_consent_probe.can_open(1)
     or lm360_gate21_consent_probe.consent(1)
     or lm360_gate21_consent_probe.withdraw(1)
  then raise exception 'GATE21_MEDIATOR_PRECONSENT_FAILED'; end if;
end
$mediator_pre$;

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000004', true);
do $outsider$
begin
  if lm360_gate21_consent_probe.can_open(1)
     or lm360_gate21_consent_probe.consent(1)
     or lm360_gate21_consent_probe.withdraw(1)
  then raise exception 'GATE21_OUTSIDER_FAILED'; end if;
end
$outsider$;

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
do $a_accept$
begin
  if not lm360_gate21_consent_probe.consent(1)
     or lm360_gate21_consent_probe.can_open(1)
  then raise exception 'GATE21_ONE_CONSENT_FAILED'; end if;
end
$a_accept$;

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000002', true);
do $b_accept$
begin
  if not lm360_gate21_consent_probe.consent(1)
     or not lm360_gate21_consent_probe.can_open(1)
     or lm360_gate21_consent_probe.can_open(2)
     or lm360_gate21_consent_probe.can_open(3)
  then raise exception 'GATE21_TWO_CONSENTS_FAILED'; end if;
end
$b_accept$;

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000003', true);
do $mediator_after$
begin
  if not lm360_gate21_consent_probe.can_open(1)
     or lm360_gate21_consent_probe.can_open(2)
     or lm360_gate21_consent_probe.can_open(3)
     or lm360_gate21_consent_probe.consent(1)
  then raise exception 'GATE21_MEDIATOR_AFTER_FAILED'; end if;
end
$mediator_after$;

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
do $revoke$
begin
  if not lm360_gate21_consent_probe.withdraw(1)
     or lm360_gate21_consent_probe.can_open(1)
     or lm360_gate21_consent_probe.consent(1)
  then raise exception 'GATE21_REVOKE_FAILED'; end if;
end
$revoke$;

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000002', true);
do $b_after$
begin
  if lm360_gate21_consent_probe.can_open(1)
     or lm360_gate21_consent_probe.consent(1)
  then raise exception 'GATE21_B_AFTER_REVOKE_FAILED'; end if;
end
$b_after$;

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000003', true);
do $mediator_revoke$
begin
  if lm360_gate21_consent_probe.can_open(1) then
    raise exception 'GATE21_MEDIATOR_REVOKE_FAILED';
  end if;
end
$mediator_revoke$;
reset role;
rollback;

-- Se lo schema e' ancora visibile, non dichiarare PASS.
select case
  when to_regnamespace('lm360_gate21_consent_probe') is null
  then 'GATE21_CONSENT_SQL_SIMULATION=PASS'
  else 'GATE21_CONSENT_SQL_SIMULATION=FAIL'
end;
