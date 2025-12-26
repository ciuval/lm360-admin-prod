create extension if not exists postgis;

alter table public.profiles add column if not exists lat double precision;
alter table public.profiles add column if not exists lon double precision;
alter table public.profiles add column if not exists geom geography(Point,4326);

update public.profiles
set geom = ST_SetSRID(ST_MakePoint(lon,lat),4326)::geography
where geom is null and lat is not null and lon is not null;

create index if not exists profiles_geom_gix on public.profiles using gist (geom);

create or replace function public.near_matches(
  me uuid,
  p_lat double precision,
  p_lon double precision,
  radius_m integer default 30000,
  limit_n integer default 50
) returns table(
  user_id uuid,
  dist_m double precision,
  score integer
) language sql stable security definer
set search_path = public, pg_temp
as $$
  with base as (
    select id as user_id,
           ST_Distance(geom, ST_SetSRID(ST_MakePoint(p_lon,p_lat),4326)::geography) as dist_m
    from public.profiles
    where status_account = 'active'
      and geom is not null
      and ST_DWithin(geom, ST_SetSRID(ST_MakePoint(p_lon,p_lat),4326)::geography, radius_m)
      and id <> me
  )
  select b.user_id, b.dist_m, coalesce(ms.score,0) as score
  from base b
  left join public.match_scores ms
    on (ms.user_a = me and ms.user_b = b.user_id)
    or (ms.user_b = me and ms.user_a = b.user_id)
  order by score desc, dist_m asc
  limit limit_n;
$$;

grant execute on function public.near_matches(uuid,double precision,double precision,integer,integer)
  to anon, authenticated;
