-- Ebrostay upgrade: guest bookings ("Mis reservas")
-- Links booked periods to a registered user so they can see their own
-- bookings on the website. Safe to run more than once.

alter table public.availability_blocks
  add column if not exists user_id uuid references public.profiles (id) on delete set null;

-- Admins can look up users by email to assign bookings
drop policy if exists "Admins read profiles" on public.profiles;
create policy "Admins read profiles"
  on public.profiles for select
  using (public.is_admin());

-- Self-service account deletion: removes only the calling user.
create or replace function public.delete_my_account()
returns void
language sql
security definer set search_path = public
as $$
  delete from auth.users where id = auth.uid();
$$;

revoke execute on function public.delete_my_account() from public;
revoke execute on function public.delete_my_account() from anon;
grant execute on function public.delete_my_account() to authenticated;
