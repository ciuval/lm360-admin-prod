alter table public.messages enable row level security;

create or replace function public.is_mutual_100(a uuid, b uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.match_scores
    where ((user_a=a and user_b=b) or (user_a=b and user_b=a))
      and score = 100
  );
$$;

drop policy if exists read_mutual on public.messages;
drop policy if exists insert_mutual on public.messages;
drop policy if exists update_mutual on public.messages;

create policy read_mutual on public.messages
for select using (
  auth.uid() in (sender_id, recipient_id)
  and public.is_mutual_100(sender_id, recipient_id)
);

create policy insert_mutual on public.messages
for insert with check (
  auth.uid() = sender_id
  and public.is_mutual_100(sender_id, recipient_id)
);

create policy update_mutual on public.messages
for update using (
  auth.uid() in (sender_id, recipient_id)
  and public.is_mutual_100(sender_id, recipient_id)
) with check (
  auth.uid() in (sender_id, recipient_id)
  and public.is_mutual_100(sender_id, recipient_id)
);
