-- Ebrostay upgrade: property photos + full property editing
-- Run this in the Supabase SQL Editor of the EXISTING project.
-- Safe to run more than once.

-- Photos metadata table -------------------------------------------------------

create table if not exists public.property_photos (
  id uuid primary key default gen_random_uuid(),
  property_id text not null references public.properties (id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 100,
  created_at timestamptz not null default now()
);

create index if not exists property_photos_property_idx
  on public.property_photos (property_id, sort_order);

alter table public.property_photos enable row level security;

drop policy if exists "Public can read property photos" on public.property_photos;
create policy "Public can read property photos"
  on public.property_photos for select
  using (true);

drop policy if exists "Admins manage property photos" on public.property_photos;
create policy "Admins manage property photos"
  on public.property_photos for all
  using (public.is_admin())
  with check (public.is_admin());

-- Storage bucket for the image files ------------------------------------------

insert into storage.buckets (id, name, public)
values ('property-photos', 'property-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public read property photos" on storage.objects;
create policy "Public read property photos"
  on storage.objects for select
  using (bucket_id = 'property-photos');

drop policy if exists "Admins upload property photos" on storage.objects;
create policy "Admins upload property photos"
  on storage.objects for insert
  with check (bucket_id = 'property-photos' and public.is_admin());

drop policy if exists "Admins update property photos" on storage.objects;
create policy "Admins update property photos"
  on storage.objects for update
  using (bucket_id = 'property-photos' and public.is_admin());

drop policy if exists "Admins delete property photos" on storage.objects;
create policy "Admins delete property photos"
  on storage.objects for delete
  using (bucket_id = 'property-photos' and public.is_admin());
