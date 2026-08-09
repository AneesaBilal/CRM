-- NexaCRM schema
-- Run this in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.nexacrm_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'Sales Representative',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nexacrm_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  website text,
  phone text,
  city text,
  country text,
  size text,
  revenue numeric default 0,
  status text not null default 'Active',
  description text,
  owner_id uuid references public.nexacrm_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nexacrm_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  email text,
  phone text,
  company_id uuid references public.nexacrm_companies(id) on delete set null,
  owner_id uuid references public.nexacrm_profiles(id) on delete set null,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nexacrm_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  email text,
  phone text,
  company text,
  source text,
  status text not null default 'New',
  score text,
  value numeric default 0,
  notes text,
  owner_id uuid references public.nexacrm_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nexacrm_deals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_id uuid references public.nexacrm_companies(id) on delete set null,
  contact_id uuid references public.nexacrm_contacts(id) on delete set null,
  amount numeric not null default 0,
  stage text not null default 'Lead',
  probability integer not null default 20,
  close_date date,
  status text not null default 'Open',
  owner_id uuid references public.nexacrm_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nexacrm_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  priority text not null default 'Medium',
  status text not null default 'To Do',
  due_date date,
  related_type text,
  related_id uuid,
  owner_id uuid references public.nexacrm_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nexacrm_activities (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'Note',
  subject text not null,
  description text,
  contact_id uuid references public.nexacrm_contacts(id) on delete set null,
  deal_id uuid references public.nexacrm_deals(id) on delete set null,
  owner_id uuid references public.nexacrm_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexacrm_companies_created_at_idx on public.nexacrm_companies(created_at desc);
create index if not exists nexacrm_contacts_created_at_idx on public.nexacrm_contacts(created_at desc);
create index if not exists nexacrm_leads_created_at_idx on public.nexacrm_leads(created_at desc);
create index if not exists nexacrm_deals_created_at_idx on public.nexacrm_deals(created_at desc);
create index if not exists nexacrm_tasks_created_at_idx on public.nexacrm_tasks(created_at desc);
create index if not exists nexacrm_activities_created_at_idx on public.nexacrm_activities(created_at desc);

drop trigger if exists nexacrm_profiles_updated_at on public.nexacrm_profiles;
create trigger nexacrm_profiles_updated_at
before update on public.nexacrm_profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists nexacrm_companies_updated_at on public.nexacrm_companies;
create trigger nexacrm_companies_updated_at
before update on public.nexacrm_companies
for each row execute procedure public.set_updated_at();

drop trigger if exists nexacrm_contacts_updated_at on public.nexacrm_contacts;
create trigger nexacrm_contacts_updated_at
before update on public.nexacrm_contacts
for each row execute procedure public.set_updated_at();

drop trigger if exists nexacrm_leads_updated_at on public.nexacrm_leads;
create trigger nexacrm_leads_updated_at
before update on public.nexacrm_leads
for each row execute procedure public.set_updated_at();

drop trigger if exists nexacrm_deals_updated_at on public.nexacrm_deals;
create trigger nexacrm_deals_updated_at
before update on public.nexacrm_deals
for each row execute procedure public.set_updated_at();

drop trigger if exists nexacrm_tasks_updated_at on public.nexacrm_tasks;
create trigger nexacrm_tasks_updated_at
before update on public.nexacrm_tasks
for each row execute procedure public.set_updated_at();

drop trigger if exists nexacrm_activities_updated_at on public.nexacrm_activities;
create trigger nexacrm_activities_updated_at
before update on public.nexacrm_activities
for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.nexacrm_profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
