-- =============================================
-- Coffizza Cafe — Supabase SQL Schema
-- ਇਹ SQL Supabase Dashboard > SQL Editor ਵਿੱਚ Run ਕਰੋ
-- =============================================

-- Orders Table
create table if not exists public.orders (
  id text primary key,
  customer_name text not null,
  phone text not null,
  fulfillment_type text not null,
  address text not null,
  table_number text,
  items text not null,
  subtotal numeric not null default 0,
  gst numeric not null default 0,
  delivery_fee numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'placed',
  payment_method text default 'cod',
  special_instructions text,
  cancellation_reason text,
  cancelled_at timestamptz,
  created_at timestamptz not null default now()
);

-- Table Reservations
create table if not exists public.table_reservations (
  id text primary key,
  customer_name text not null,
  phone text not null,
  guest_count integer not null default 1,
  date text not null,
  time_slot text not null,
  seating_preference text not null default 'indoor',
  special_requests text,
  status text not null default 'confirmed',
  cancellation_reason text,
  cancelled_at timestamptz,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (allow all access via anon key for cafe app)
alter table public.orders enable row level security;
alter table public.table_reservations enable row level security;

-- Add columns if table already exists
alter table public.orders add column if not exists table_number text;
alter table public.orders add column if not exists payment_method text default 'cod';
alter table public.orders add column if not exists cancellation_reason text;
alter table public.orders add column if not exists cancelled_at timestamptz;

alter table public.table_reservations add column if not exists cancellation_reason text;
alter table public.table_reservations add column if not exists cancelled_at timestamptz;

-- Allow public read/write policies
drop policy if exists "Allow public read orders" on public.orders;
drop policy if exists "Allow public insert orders" on public.orders;
drop policy if exists "Allow public update orders" on public.orders;
drop policy if exists "Allow public delete orders" on public.orders;

create policy "Allow public read orders" on public.orders for select using (true);
create policy "Allow public insert orders" on public.orders for insert with check (true);
create policy "Allow public update orders" on public.orders for update using (true);
create policy "Allow public delete orders" on public.orders for delete using (true);

drop policy if exists "Allow public read reservations" on public.table_reservations;
drop policy if exists "Allow public insert reservations" on public.table_reservations;
drop policy if exists "Allow public update reservations" on public.table_reservations;
drop policy if exists "Allow public delete reservations" on public.table_reservations;

create policy "Allow public read reservations" on public.table_reservations for select using (true);
create policy "Allow public insert reservations" on public.table_reservations for insert with check (true);
create policy "Allow public update reservations" on public.table_reservations for update using (true);
create policy "Allow public delete reservations" on public.table_reservations for delete using (true);
