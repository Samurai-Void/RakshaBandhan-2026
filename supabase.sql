-- RAKSHA BANDHAN V2 — SUPABASE SETUP
-- Run this in Supabase SQL Editor after creating your project.
-- Then create your admin user in Authentication > Users and paste that user's UUID below.

create extension if not exists pgcrypto;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  relationship text not null default 'Sister',
  intro text not null default 'A little Rakhi surprise made especially for you. ❤️',
  letter text not null default '',
  reward_title text not null default 'A Special Treat',
  reward_text text not null default 'A little reward just for you. ❤️',
  score integer not null default 100 check (score between 0 and 100),
  status text not null default 'IRREPLACEABLE',
  memories integer not null default 100 check (memories between 0 and 100),
  chaos integer not null default 100 check (chaos between 0 and 100),
  arguments integer not null default 0 check (arguments between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete cascade,
  storage_path text not null,
  caption text not null default 'A memory worth keeping. ❤️',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists memories_person_id_idx on public.memories(person_id);

alter table public.admins enable row level security;
alter table public.people enable row level security;
alter table public.memories enable row level security;

create or replace function public.is_rakhi_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "Public can read people" on public.people;
create policy "Public can read people" on public.people for select using (true);

drop policy if exists "Admins can insert people" on public.people;
create policy "Admins can insert people" on public.people for insert to authenticated with check (public.is_rakhi_admin());

drop policy if exists "Admins can update people" on public.people;
create policy "Admins can update people" on public.people for update to authenticated using (public.is_rakhi_admin()) with check (public.is_rakhi_admin());

drop policy if exists "Admins can delete people" on public.people;
create policy "Admins can delete people" on public.people for delete to authenticated using (public.is_rakhi_admin());

drop policy if exists "Public can read memories" on public.memories;
create policy "Public can read memories" on public.memories for select using (true);

drop policy if exists "Admins can insert memories" on public.memories;
create policy "Admins can insert memories" on public.memories for insert to authenticated with check (public.is_rakhi_admin());

drop policy if exists "Admins can update memories" on public.memories;
create policy "Admins can update memories" on public.memories for update to authenticated using (public.is_rakhi_admin()) with check (public.is_rakhi_admin());

drop policy if exists "Admins can delete memories" on public.memories;
create policy "Admins can delete memories" on public.memories for delete to authenticated using (public.is_rakhi_admin());

insert into storage.buckets (id, name, public)
values ('rakhi-photos', 'rakhi-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view Rakhi photos" on storage.objects;
create policy "Public can view Rakhi photos" on storage.objects for select using (bucket_id = 'rakhi-photos');

drop policy if exists "Admins can upload Rakhi photos" on storage.objects;
create policy "Admins can upload Rakhi photos" on storage.objects for insert to authenticated with check (bucket_id = 'rakhi-photos' and public.is_rakhi_admin());

drop policy if exists "Admins can update Rakhi photos" on storage.objects;
create policy "Admins can update Rakhi photos" on storage.objects for update to authenticated using (bucket_id = 'rakhi-photos' and public.is_rakhi_admin()) with check (bucket_id = 'rakhi-photos' and public.is_rakhi_admin());

drop policy if exists "Admins can delete Rakhi photos" on storage.objects;
create policy "Admins can delete Rakhi photos" on storage.objects for delete to authenticated using (bucket_id = 'rakhi-photos' and public.is_rakhi_admin());

-- AFTER creating your admin user, run:
-- insert into public.admins(user_id) values ('PASTE-ADMIN-USER-UUID-HERE') on conflict do nothing;
