create extension if not exists pgcrypto;

create table if not exists public.donors (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_legal_name text not null,
  stripe_customer_id text,
  auth_user_id uuid unique references auth.users(id) on delete set null,
  last_magic_link_sent_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references public.donors(id) on delete cascade,
  stripe_payment_intent_id text not null unique,
  investor_reference text,
  amount integer not null,
  payment_status text not null check (payment_status in ('processing', 'succeeded', 'payment_failed')),
  approval_status text not null default 'inconversation' check (approval_status in ('inconversation', 'approved', 'nothanks')),
  paperwork_status text not null default 'not_sent' check (paperwork_status in ('not_sent', 'sent', 'completed')),
  pending_email_sent_at timestamptz,
  failed_email_sent_at timestamptz,
  received_email_sent_at timestamptz,
  approved_email_sent_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists donors_set_updated_at on public.donors;
create trigger donors_set_updated_at
before update on public.donors
for each row execute procedure public.set_updated_at();

drop trigger if exists investments_set_updated_at on public.investments;
create trigger investments_set_updated_at
before update on public.investments
for each row execute procedure public.set_updated_at();

alter table public.donors enable row level security;
alter table public.investments enable row level security;

drop policy if exists "donors_select_own_record" on public.donors;
create policy "donors_select_own_record"
on public.donors
for select
using (auth.uid() = auth_user_id);

drop policy if exists "investments_select_own_records" on public.investments;
create policy "investments_select_own_records"
on public.investments
for select
using (
  exists (
    select 1
    from public.donors
    where donors.id = investments.donor_id
      and donors.auth_user_id = auth.uid()
  )
);
