-- NexaCRM extension seed data

insert into public.nexacrm_products (name, sku, price, category, status, description)
values
  ('Nexa Platform - Growth', 'NEX-GRW-001', 499, 'Subscription', 'Active', 'Per-seat monthly growth plan.'),
  ('Nexa Platform - Enterprise', 'NEX-ENT-002', 899, 'Subscription', 'Active', 'Per-seat monthly enterprise plan.'),
  ('Implementation Package', 'NEX-IMP-100', 7500, 'Services', 'Active', 'Guided onboarding and migration.'),
  ('Premium Support', 'NEX-SUP-200', 1200, 'Services', 'Active', '24/7 priority support, quarterly.'),
  ('Analytics Suite', 'NEX-ANA-400', 649, 'Add-on', 'Active', 'Advanced reporting module.');

insert into public.nexacrm_quotes (number, company_id, contact_id, status, expiration, items, discount, tax)
select 'QT-2026-001', c.id, ct.id, 'Sent', current_date + 20,
  (select jsonb_agg(jsonb_build_object('product_id', p.id, 'qty', 40, 'price', p.price)) from public.nexacrm_products p where p.sku = 'NEX-ENT-002'),
  5, 8
from public.nexacrm_companies c, public.nexacrm_contacts ct
where c.name = 'TechNova Solutions' and ct.email = 'sarah.ahmed@technova.io';

insert into public.nexacrm_quotes (number, company_id, contact_id, status, expiration, items, discount, tax)
select 'QT-2026-002', c.id, ct.id, 'Draft', current_date + 30,
  (select jsonb_agg(jsonb_build_object('product_id', p.id, 'qty', 25, 'price', p.price)) from public.nexacrm_products p where p.sku = 'NEX-GRW-001'),
  0, 8
from public.nexacrm_companies c, public.nexacrm_contacts ct
where c.name = 'Northwind Logistics' and ct.email = 'maria.santos@northwindlog.com';

insert into public.nexacrm_tickets (number, subject, contact_id, company_id, priority, status, category, messages)
select 'TCK-1041', 'Unable to export pipeline report', ct.id, c.id, 'High', 'In Progress', 'Reporting',
  '[{"from":"them","text":"Export button spins and never downloads.","at":"2026-08-06T09:00:00Z"}]'::jsonb
from public.nexacrm_contacts ct, public.nexacrm_companies c
where ct.email = 'sarah.ahmed@technova.io' and c.name = 'TechNova Solutions';

insert into public.nexacrm_tickets (number, subject, contact_id, company_id, priority, status, category, messages)
select 'TCK-1042', 'SSO login loop after password reset', ct.id, c.id, 'Urgent', 'Open', 'Authentication',
  '[{"from":"them","text":"Users stuck in redirect loop after reset.","at":"2026-08-08T09:00:00Z"}]'::jsonb
from public.nexacrm_contacts ct, public.nexacrm_companies c
where ct.email = 'maria.santos@northwindlog.com' and c.name = 'Northwind Logistics';

insert into public.nexacrm_tickets (number, subject, contact_id, company_id, priority, status, category, messages)
select 'TCK-1043', 'Invoice mismatch for March billing', ct.id, c.id, 'Medium', 'Resolved', 'Billing',
  '[{"from":"them","text":"Invoice shows 42 seats but we have 38.","at":"2026-07-20T09:00:00Z"}]'::jsonb
from public.nexacrm_contacts ct, public.nexacrm_companies c
where ct.email = 'grace.liu@crestline.fi' and c.name = 'Crestline Financial';

insert into public.nexacrm_notifications (type, body, read)
values
  ('lead', 'New lead Rachel Green was created.', false),
  ('deal', 'Crestline Renewal was marked as Won.', false),
  ('ticket', 'Ticket TCK-1042 (Urgent) needs a response.', false),
  ('system', 'Weekly sales report is ready to view.', true);

insert into public.nexacrm_conversations (contact_id, subject, unread, starred)
select id, 'Platform expansion next steps', true, true
from public.nexacrm_contacts where email = 'sarah.ahmed@technova.io';

insert into public.nexacrm_conversations (contact_id, subject, unread, starred)
select id, 'Fleet telemetry proposal feedback', true, false
from public.nexacrm_contacts where email = 'maria.santos@northwindlog.com';

insert into public.nexacrm_conversations (contact_id, subject, unread, starred)
select id, 'Renewal paperwork', false, true
from public.nexacrm_contacts where email = 'grace.liu@crestline.fi';

insert into public.nexacrm_messages (conversation_id, sender, body)
select id, 'them', 'We reviewed the expansion proposal. Can we discuss seat counts?'
from public.nexacrm_conversations where subject = 'Platform expansion next steps';

insert into public.nexacrm_messages (conversation_id, sender, body)
select id, 'me', 'Of course. I can flex seats between teams. Call tomorrow?'
from public.nexacrm_conversations where subject = 'Platform expansion next steps';

insert into public.nexacrm_messages (conversation_id, sender, body)
select id, 'them', 'The telemetry pricing looks reasonable. We need the rollout timeline.'
from public.nexacrm_conversations where subject = 'Fleet telemetry proposal feedback';

insert into public.nexacrm_activities (type, subject, description, scheduled_at)
values
  ('Meeting', 'Quarterly business review', 'Review expansion metrics with TechNova.', now() + interval '2 days'),
  ('Call', 'Pricing follow-up with Bluepeak', 'Discuss annual discount tiers.', now() + interval '1 day'),
  ('Follow-up', 'Check in with Omar on pilot scope', 'Confirm storage capacity requirements.', now() + interval '4 days');
