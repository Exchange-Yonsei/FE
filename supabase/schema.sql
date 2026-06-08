create extension if not exists pgcrypto;

create table if not exists public.meetups (
  id uuid primary key default gen_random_uuid(),
  host_user_id uuid references auth.users(id) not null,
  title text not null,
  description text not null,
  category text not null check (category in ('Food', 'Cafe', 'Drinks', 'Study', 'Trip', 'Culture', 'Sports', 'Other')),
  location text not null,
  starts_at timestamptz not null,
  max_participants integer not null check (max_participants > 1),
  estimated_cost_min integer check (estimated_cost_min is null or estimated_cost_min >= 0),
  estimated_cost_max integer check (estimated_cost_max is null or estimated_cost_max >= 0),
  language text not null,
  host_name text not null,
  whatsapp_link text not null,
  additional_notes text,
  status text not null default 'OPEN' check (status in ('OPEN', 'CLOSED')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint estimated_cost_order check (
    estimated_cost_min is null
    or estimated_cost_max is null
    or estimated_cost_max >= estimated_cost_min
  )
);

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  meetup_id uuid references public.meetups(id) on delete cascade not null,
  name text not null,
  nationality text,
  short_message text,
  contact_info text,
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_meetups_updated_at on public.meetups;
create trigger set_meetups_updated_at
before update on public.meetups
for each row execute function public.set_updated_at();

drop trigger if exists set_participants_updated_at on public.participants;
create trigger set_participants_updated_at
before update on public.participants
for each row execute function public.set_updated_at();

create index if not exists meetups_host_user_id_idx on public.meetups(host_user_id);
create index if not exists meetups_starts_at_idx on public.meetups(starts_at);
create index if not exists participants_meetup_id_idx on public.participants(meetup_id);
create index if not exists participants_status_idx on public.participants(status);
