-- NexaCRM extension schema

alter table public.nexacrm_activities
add column if not exists scheduled_at timestamptz;

create table if not exists public.nexacrm_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text,
  price numeric not null default 0,
  category text,
  status text not null default 'Active',
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nexacrm_quotes (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  company_id uuid references public.nexacrm_companies(id) on delete set null,
  contact_id uuid references public.nexacrm_contacts(id) on delete set null,
  status text not null default 'Draft',
  expiration date,
  items jsonb not null default '[]',
  discount numeric not null default 0,
  tax numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nexacrm_tickets (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  subject text not null,
  contact_id uuid references public.nexacrm_contacts(id) on delete set null,
  company_id uuid references public.nexacrm_companies(id) on delete set null,
  priority text not null default 'Medium',
  status text not null default 'Open',
  category text,
  assignee_id uuid references public.nexacrm_profiles(id) on delete set null,
  messages jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nexacrm_notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'system',
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.nexacrm_conversations (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.nexacrm_contacts(id) on delete cascade,
  subject text not null,
  unread boolean not null default true,
  starred boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.nexacrm_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.nexacrm_conversations(id) on delete cascade,
  sender text not null default 'them',
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists nexacrm_products_created_at_idx on public.nexacrm_products(created_at desc);
create index if not exists nexacrm_quotes_created_at_idx on public.nexacrm_quotes(created_at desc);
create index if not exists nexacrm_tickets_created_at_idx on public.nexacrm_tickets(created_at desc);
create index if not exists nexacrm_notifications_created_at_idx on public.nexacrm_notifications(created_at desc);
create index if not exists nexacrm_conversations_created_at_idx on public.nexacrm_conversations(created_at desc);
create index if not exists nexacrm_messages_created_at_idx on public.nexacrm_messages(created_at desc);

drop trigger if exists nexacrm_products_updated_at on public.nexacrm_products;
create trigger nexacrm_products_updated_at
before update on public.nexacrm_products
for each row execute procedure public.set_updated_at();

drop trigger if exists nexacrm_quotes_updated_at on public.nexacrm_quotes;
create trigger nexacrm_quotes_updated_at
before update on public.nexacrm_quotes
for each row execute procedure public.set_updated_at();

drop trigger if exists nexacrm_tickets_updated_at on public.nexacrm_tickets;
create trigger nexacrm_tickets_updated_at
before update on public.nexacrm_tickets
for each row execute procedure public.set_updated_at();
