-- NexaCRM seed data
-- Run this after schema.sql and policies.sql.
-- This inserts sample CRM records. Running it multiple times may duplicate data.

insert into public.nexacrm_companies (name, industry, website, phone, city, country, size, revenue, status, description)
values
  ('TechNova Solutions', 'Software', 'technova.io', '+1 415 555 0132', 'San Francisco', 'USA', '201-500', 48000000, 'Active', 'Cloud infrastructure platform.'),
  ('Northwind Logistics', 'Logistics', 'northwindlog.com', '+1 312 555 0177', 'Chicago', 'USA', '501-1000', 120000000, 'Active', 'Freight and supply-chain orchestration.'),
  ('Bluepeak Analytics', 'Data & Analytics', 'bluepeak.ai', '+1 206 555 0119', 'Seattle', 'USA', '51-200', 15000000, 'Active', 'Self-serve BI and forecasting suite.'),
  ('Crestline Financial', 'Financial Services', 'crestline.fi', '+1 212 555 0143', 'New York', 'USA', '501-1000', 205000000, 'Active', 'Treasury and payments infrastructure.');

insert into public.nexacrm_contacts (name, title, email, phone, company_id, status)
select 'Sarah Ahmed', 'VP of Engineering', 'sarah.ahmed@technova.io', '+1 415 555 2201', id, 'Active'
from public.nexacrm_companies where name = 'TechNova Solutions';

insert into public.nexacrm_contacts (name, title, email, phone, company_id, status)
select 'Maria Santos', 'Director of Operations', 'maria.santos@northwindlog.com', '+1 312 555 2301', id, 'Active'
from public.nexacrm_companies where name = 'Northwind Logistics';

insert into public.nexacrm_contacts (name, title, email, phone, company_id, status)
select 'Robert Kim', 'Head of Data', 'robert.kim@bluepeak.ai', '+1 206 555 2401', id, 'Active'
from public.nexacrm_companies where name = 'Bluepeak Analytics';

insert into public.nexacrm_contacts (name, title, email, phone, company_id, status)
select 'Grace Liu', 'VP Finance', 'grace.liu@crestline.fi', '+1 212 555 2701', id, 'Active'
from public.nexacrm_companies where name = 'Crestline Financial';

insert into public.nexacrm_leads (name, title, email, phone, company, source, status, score, value, notes)
values
  ('Rachel Green', 'Marketing Director', 'rachel.g@brightlabs.co', '+1 628 555 3101', 'Bright Labs', 'Website', 'New', 'Hot', 24000, 'Requested pricing.'),
  ('Daniel Osei', 'Founder', 'daniel@oseia.io', '+1 669 555 3102', 'Oseia', 'Referral', 'Contacted', 'Warm', 12000, 'Wants a demo.'),
  ('Amira Khalil', 'Ops Manager', 'amira.k@swiftfreight.com', '+1 773 555 3103', 'Swift Freight', 'LinkedIn', 'Qualified', 'Hot', 48000, 'Evaluating two vendors.'),
  ('Elena Rodriguez', 'VP Sales', 'elena@meridianretail.com', '+1 305 555 3105', 'Meridian Retail', 'Advertisement', 'Qualified', 'Hot', 62000, 'Wants rollout across 40 stores.');

insert into public.nexacrm_deals (name, company_id, contact_id, amount, stage, probability, close_date, status)
select 'TechNova Platform Expansion', c.id, ct.id, 86000, 'Negotiation', 75, current_date + 14, 'Open'
from public.nexacrm_companies c, public.nexacrm_contacts ct
where c.name = 'TechNova Solutions' and ct.email = 'sarah.ahmed@technova.io';

insert into public.nexacrm_deals (name, company_id, contact_id, amount, stage, probability, close_date, status)
select 'Northwind Fleet Telemetry', c.id, ct.id, 54000, 'Proposal', 60, current_date + 21, 'Open'
from public.nexacrm_companies c, public.nexacrm_contacts ct
where c.name = 'Northwind Logistics' and ct.email = 'maria.santos@northwindlog.com';

insert into public.nexacrm_deals (name, company_id, contact_id, amount, stage, probability, close_date, status)
select 'Crestline Renewal', c.id, ct.id, 98000, 'Won', 100, current_date - 12, 'Won'
from public.nexacrm_companies c, public.nexacrm_contacts ct
where c.name = 'Crestline Financial' and ct.email = 'grace.liu@crestline.fi';

insert into public.nexacrm_tasks (title, description, priority, status, due_date)
values
  ('Send TechNova revised contract', 'Include updated MSA and SLA terms.', 'High', 'In Progress', current_date + 1),
  ('Prep Northwind demo environment', 'Load fleet telemetry sample data.', 'Medium', 'To Do', current_date + 3),
  ('Follow up with Bluepeak on pricing', 'They asked about annual discount tiers.', 'High', 'To Do', current_date + 2),
  ('Review churned accounts list', 'Identify win-back candidates.', 'Low', 'To Do', current_date + 7);

insert into public.nexacrm_activities (type, subject, description)
values
  ('Call', 'Discovery call with Sarah Ahmed', 'Mapped expansion requirements and timeline.'),
  ('Email', 'Sent Northwind proposal v2', 'Included telemetry pricing sheet.'),
  ('Meeting', 'Bluepeak product walkthrough', 'Demoed forecasting modules.'),
  ('Note', 'Crestline renewal complete', 'Kick off expansion planning.');
