-- SOLO LM360_FASE2_LAB: elimina ESCLUSIVAMENTE i nomi casuali
-- di questa esecuzione. No CASCADE, no tabelle applicative.
\set ON_ERROR_STOP on
\set QUIET 1
begin;
drop function if exists public.__FN_CONSENT__(bigint);
drop function if exists public.__FN_OPEN__(bigint);
drop function if exists public.__FN_WITHDRAW__(bigint);
drop table if exists __SCHEMA__.consents;
drop schema if exists __SCHEMA__;
notify pgrst, 'reload schema';
commit;
select case when to_regnamespace('__SCHEMA__') is null
  and to_regprocedure('public.__FN_CONSENT__(bigint)') is null
  and to_regprocedure('public.__FN_OPEN__(bigint)') is null
  and to_regprocedure('public.__FN_WITHDRAW__(bigint)') is null
then 'GATE21_JWT_FIXTURE_CLEAN=PASS'
else 'GATE21_JWT_FIXTURE_CLEAN=FAIL'
end;
