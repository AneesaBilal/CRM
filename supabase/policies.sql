-- NexaCRM Row Level Security policies
-- Run this after schema.sql.

alter table public.nexacrm_profiles enable row level security;
alter table public.nexacrm_companies enable row level security;
alter table public.nexacrm_contacts enable row level security;
alter table public.nexacrm_leads enable row level security;
alter table public.nexacrm_deals enable row level security;
alter table public.nexacrm_tasks enable row level security;
alter table public.nexacrm_activities enable row level security;

drop policy if exists "nexacrm_profiles_select" on public.nexacrm_profiles;
create policy "nexacrm_profiles_select"
on public.nexacrm_profiles
for select
to authenticated
using (true);

drop policy if exists "nexacrm_profiles_insert_own" on public.nexacrm_profiles;
create policy "nexacrm_profiles_insert_own"
on public.nexacrm_profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "nexacrm_profiles_update_own" on public.nexacrm_profiles;
create policy "nexacrm_profiles_update_own"
on public.nexacrm_profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "nexacrm_companies_full_access" on public.nexacrm_companies;
create policy "nexacrm_companies_full_access"
on public.nexacrm_companies
for all
to authenticated
using (true)
with check (true);

drop policy if exists "nexacrm_contacts_full_access" on public.nexacrm_contacts;
create policy "nexacrm_contacts_full_access"
on public.nexacrm_contacts
for all
to authenticated
using (true)
with check (true);

drop policy if exists "nexacrm_leads_full_access" on public.nexacrm_leads;
create policy "nexacrm_leads_full_access"
on public.nexacrm_leads
for all
to authenticated
using (true)
with check (true);

drop policy if exists "nexacrm_deals_full_access" on public.nexacrm_deals;
create policy "nexacrm_deals_full_access"
on public.nexacrm_deals
for all
to authenticated
using (true)
with check (true);

drop policy if exists "nexacrm_tasks_full_access" on public.nexacrm_tasks;
create policy "nexacrm_tasks_full_access"
on public.nexacrm_tasks
for all
to authenticated
using (true)
with check (true);

drop policy if exists "nexacrm_activities_full_access" on public.nexacrm_activities;
create policy "nexacrm_activities_full_access"
on public.nexacrm_activities
for all
to authenticated
using (true)
with check (true);
