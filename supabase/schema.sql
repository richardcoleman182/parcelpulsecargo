create extension if not exists pgcrypto;

create table if not exists public.shipments (
  tracking_number text primary key,
  sender jsonb not null,
  receiver jsonb not null,
  origin text not null,
  destination text not null,
  service text not null,
  service_level text,
  parcel_type text not null,
  item_description text,
  currency text,
  weight_kg numeric,
  declared_value numeric,
  insurance_value numeric,
  current_status text not null,
  current_location text not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shipment_updates (
  id uuid primary key default gen_random_uuid(),
  tracking_number text not null references public.shipments(tracking_number) on delete cascade,
  date timestamptz not null default now(),
  location text not null,
  title text not null,
  note text not null,
  internal_note text,
  severity text not null check (severity in ('normal', 'warning', 'issue', 'delivered'))
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists shipments_created_at_idx on public.shipments (created_at desc);
create index if not exists shipments_status_idx on public.shipments (current_status);
create index if not exists shipment_updates_tracking_date_idx on public.shipment_updates (tracking_number, date desc);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

alter table public.shipments enable row level security;
alter table public.shipment_updates enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "no anon shipments" on public.shipments;
create policy "no anon shipments" on public.shipments for all using (false) with check (false);

drop policy if exists "no anon shipment_updates" on public.shipment_updates;
create policy "no anon shipment_updates" on public.shipment_updates for all using (false) with check (false);

drop policy if exists "no anon contact_messages" on public.contact_messages;
create policy "no anon contact_messages" on public.contact_messages for all using (false) with check (false);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists shipments_set_updated_at on public.shipments;
create trigger shipments_set_updated_at
before update on public.shipments
for each row
execute function public.set_updated_at();
