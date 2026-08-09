-- NexaCRM extension policies

alter table public.nexacrm_products enable row level security;
alter table public.nexacrm_quotes enable row level security;
alter table public.nexacrm_tickets enable row level security;
alter table public.nexacrm_notifications enable row level security;
alter table public.nexacrm_conversations enable row level security;
alter table public.nexacrm_messages enable row level security;

drop policy if exists "nexacrm_products_full_access" on public.nexacrm_products;
create policy "nexacrm_products_full_access" on public.nexacrm_products
for all to authenticated using (true) with check (true);

drop policy if exists "nexacrm_quotes_full_access" on public.nexacrm_quotes;
create policy "nexacrm_quotes_full_access" on public.nexacrm_quotes
for all to authenticated using (true) with check (true);

drop policy if exists "nexacrm_tickets_full_access" on public.nexacrm_tickets;
create policy "nexacrm_tickets_full_access" on public.nexacrm_tickets
for all to authenticated using (true) with check (true);

drop policy if exists "nexacrm_notifications_full_access" on public.nexacrm_notifications;
create policy "nexacrm_notifications_full_access" on public.nexacrm_notifications
for all to authenticated using (true) with check (true);

drop policy if exists "nexacrm_conversations_full_access" on public.nexacrm_conversations;
create policy "nexacrm_conversations_full_access" on public.nexacrm_conversations
for all to authenticated using (true) with check (true);

drop policy if exists "nexacrm_messages_full_access" on public.nexacrm_messages;
create policy "nexacrm_messages_full_access" on public.nexacrm_messages
for all to authenticated using (true) with check (true);
