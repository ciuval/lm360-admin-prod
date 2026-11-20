-- SOLO LM360_FASE2_LAB. Non e' una migration. Eseguito esclusivamente
-- dal runner con nomi casuali e 4 UUID di account sintetici locali.
-- Oggetti committati per poche richieste JWT HTTP, poi cleanup mirato.
\set ON_ERROR_STOP on
\set QUIET 1
begin;
do $guard$
begin
  if current_database() <> 'postgres'
     or to_regnamespace('__SCHEMA__') is not null
     or to_regprocedure('public.__FN_CONSENT__(bigint)') is not null
     or to_regprocedure('public.__FN_OPEN__(bigint)') is not null
     or to_regprocedure('public.__FN_WITHDRAW__(bigint)') is not null
     or to_regprocedure('auth.uid()') is null
     or to_regrole('authenticated') is null
     or to_regrole('anon') is null then
    raise exception 'GATE21_JWT_FIXTURE_NAME_COLLISION';
  end if;
end
$guard$;

create schema __SCHEMA__;
revoke all on schema __SCHEMA__ from public, anon, authenticated;
create table __SCHEMA__.consents (
  case_id bigint primary key,
  user_a uuid not null,
  user_b uuid not null,
  mediator uuid not null,
  accepted_a boolean not null default false,
  accepted_b boolean not null default false,
  ended boolean not null default false,
  closed boolean not null default false,
  blocked boolean not null default false,
  constraint actors_distinct check (user_a <> user_b and user_a <> mediator and user_b <> mediator)
);
alter table __SCHEMA__.consents enable row level security;
revoke all on __SCHEMA__.consents from public, anon, authenticated;

insert into __SCHEMA__.consents
(case_id,user_a,user_b,mediator,accepted_a,accepted_b,closed,blocked)
values
(1,'__A__','__B__','__M__',false,false,false,false),
(2,'__A__','__B__','__M__',true,true,true,false),
(3,'__A__','__B__','__M__',true,true,false,true),
(4,'__A__','__B__','__M__',false,false,false,false);

create function public.__FN_CONSENT__(p_case bigint)
returns boolean language plpgsql security definer set search_path = ''
as $func$
declare caller uuid := auth.uid();
begin
  if caller is null then return false; end if;
  update __SCHEMA__.consents s
     set accepted_a = case when s.user_a = caller then true else s.accepted_a end,
         accepted_b = case when s.user_b = caller then true else s.accepted_b end
   where s.case_id = p_case
     and (s.user_a = caller or s.user_b = caller)
     and not (s.ended or s.closed or s.blocked);
  return found;
end
$func$;

create function public.__FN_OPEN__(p_case bigint)
returns boolean language plpgsql security definer set search_path = ''
as $func$
declare caller uuid := auth.uid();
begin
  if caller is null then return false; end if;
  return exists (
    select 1 from __SCHEMA__.consents s
     where s.case_id = p_case
       and caller in (s.user_a,s.user_b,s.mediator)
       and s.accepted_a and s.accepted_b
       and not (s.ended or s.closed or s.blocked)
  );
end
$func$;

create function public.__FN_WITHDRAW__(p_case bigint)
returns boolean language plpgsql security definer set search_path = ''
as $func$
declare caller uuid := auth.uid();
begin
  if caller is null then return false; end if;
  update __SCHEMA__.consents s
     set ended = true
   where s.case_id = p_case
     and (s.user_a = caller or s.user_b = caller)
     and not s.ended;
  return found;
end
$func$;

revoke all on function public.__FN_CONSENT__(bigint) from public, anon, authenticated;
revoke all on function public.__FN_OPEN__(bigint) from public, anon, authenticated;
revoke all on function public.__FN_WITHDRAW__(bigint) from public, anon, authenticated;
grant execute on function public.__FN_CONSENT__(bigint) to authenticated;
grant execute on function public.__FN_OPEN__(bigint) to authenticated;
grant execute on function public.__FN_WITHDRAW__(bigint) to authenticated;

do $acl$
begin
  if has_table_privilege('authenticated', '__SCHEMA__.consents', 'SELECT')
     or has_table_privilege('authenticated', '__SCHEMA__.consents', 'UPDATE')
     or has_table_privilege('anon', '__SCHEMA__.consents', 'SELECT')
     or has_function_privilege('anon', 'public.__FN_CONSENT__(bigint)', 'EXECUTE')
     or has_function_privilege('anon', 'public.__FN_OPEN__(bigint)', 'EXECUTE')
     or has_function_privilege('anon', 'public.__FN_WITHDRAW__(bigint)', 'EXECUTE')
  then raise exception 'GATE21_JWT_FIXTURE_PRIVILEGE_LEAK'; end if;
end
$acl$;
notify pgrst, 'reload schema';
commit;
select 'GATE21_JWT_FIXTURE_SETUP=PASS';
