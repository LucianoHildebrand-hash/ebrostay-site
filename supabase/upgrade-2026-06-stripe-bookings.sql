-- Ebrostay upgrade: Stripe bookings + account deactivation
-- Safe to run more than once.

-- Paid bookings (written only by the Stripe webhook via service role).
-- Records survive account deletion: user_id detaches, snapshots remain.
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  customer_email text,
  property_id text references public.properties (id) on delete set null,
  property_name text,
  start_date date not null,
  end_date date not null,
  months integer,
  amount_eur numeric(10, 2),
  currency text not null default 'eur',
  stripe_session_id text unique,
  stripe_payment_intent text,
  invoice_url text,
  invoice_pdf text,
  receipt_url text,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

drop policy if exists "Users read own bookings" on public.bookings;
create policy "Users read own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

drop policy if exists "Admins read bookings" on public.bookings;
create policy "Admins read bookings"
  on public.bookings for select
  using (public.is_admin());

-- Deactivation instead of deletion
alter table public.profiles add column if not exists deactivated_at timestamptz;

create or replace function public.deactivate_my_account()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;
  update public.profiles set deactivated_at = now() where id = auth.uid();
  update auth.users set banned_until = now() + interval '100 years' where id = auth.uid();
end;
$$;

revoke execute on function public.deactivate_my_account() from public;
revoke execute on function public.deactivate_my_account() from anon;
grant execute on function public.deactivate_my_account() to authenticated;

-- Definitive deletion is an admin action from the admin panel
create or replace function public.admin_delete_user(target_user uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not allowed';
  end if;
  if exists (select 1 from public.profiles where id = target_user and is_admin) then
    raise exception 'cannot delete an admin account';
  end if;
  delete from auth.users where id = target_user;
end;
$$;

revoke execute on function public.admin_delete_user(uuid) from public;
revoke execute on function public.admin_delete_user(uuid) from anon;
grant execute on function public.admin_delete_user(uuid) to authenticated;

-- Self-deletion is replaced by deactivation
drop function if exists public.delete_my_account();
