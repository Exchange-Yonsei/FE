alter table public.meetups enable row level security;
alter table public.participants enable row level security;

drop policy if exists "Anyone can read meetups" on public.meetups;
create policy "Anyone can read meetups"
on public.meetups
for select
using (true);

drop policy if exists "Authenticated hosts can create meetups" on public.meetups;
create policy "Authenticated hosts can create meetups"
on public.meetups
for insert
to authenticated
with check (auth.uid() = host_user_id);

drop policy if exists "Hosts can update own meetups" on public.meetups;
create policy "Hosts can update own meetups"
on public.meetups
for update
to authenticated
using (auth.uid() = host_user_id)
with check (auth.uid() = host_user_id);

drop policy if exists "Hosts can delete own meetups" on public.meetups;
create policy "Hosts can delete own meetups"
on public.meetups
for delete
to authenticated
using (auth.uid() = host_user_id);

drop policy if exists "Anyone can create participant requests" on public.participants;
create policy "Anyone can create participant requests"
on public.participants
for insert
to anon, authenticated
with check (
  status = 'PENDING'
  and exists (
    select 1
    from public.meetups
    where meetups.id = participants.meetup_id
      and meetups.status = 'OPEN'
      and (
        select count(*)
        from public.participants approved
        where approved.meetup_id = meetups.id
          and approved.status = 'APPROVED'
      ) < meetups.max_participants
  )
);

drop policy if exists "Anyone can read approved participant names" on public.participants;
create policy "Anyone can read approved participant names"
on public.participants
for select
to anon, authenticated
using (status = 'APPROVED');

drop policy if exists "Hosts can read requests for own meetups" on public.participants;
create policy "Hosts can read requests for own meetups"
on public.participants
for select
to authenticated
using (
  exists (
    select 1
    from public.meetups
    where meetups.id = participants.meetup_id
      and meetups.host_user_id = auth.uid()
  )
);

drop policy if exists "Hosts can update requests for own meetups" on public.participants;
create policy "Hosts can update requests for own meetups"
on public.participants
for update
to authenticated
using (
  exists (
    select 1
    from public.meetups
    where meetups.id = participants.meetup_id
      and meetups.host_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.meetups
    where meetups.id = participants.meetup_id
      and meetups.host_user_id = auth.uid()
  )
);

-- MVP participant self-view:
-- Participants do not have accounts, so their request UUID acts as a private claim link.
-- To avoid broad public SELECT on participants, expose only this SECURITY DEFINER RPC.
-- Anyone with the UUID can view that single request, so treat the request URL as private.
create or replace function public.get_participant_request(request_id uuid)
returns table (
  id uuid,
  meetup_id uuid,
  name text,
  nationality text,
  short_message text,
  contact_info text,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  meetup jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    p.id,
    p.meetup_id,
    p.name,
    p.nationality,
    p.short_message,
    p.contact_info,
    p.status,
    p.created_at,
    p.updated_at,
    case
      when p.status = 'APPROVED' then to_jsonb(m)
      else jsonb_build_object(
        'id', m.id,
        'title', m.title,
        'status', m.status,
        'starts_at', m.starts_at,
        'location', m.location,
        'host_name', m.host_name
      )
    end as meetup
  from public.participants p
  join public.meetups m on m.id = p.meetup_id
  where p.id = request_id
  limit 1;
$$;

grant execute on function public.get_participant_request(uuid) to anon, authenticated;
