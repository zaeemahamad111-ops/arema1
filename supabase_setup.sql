-- Enable UUID and JSON support
create extension if not exists "uuid-ossp";

-- 1. Site Translations Table
create table if not exists site_translations (
  key text not null,
  lang text not null,
  value text not null,
  primary key (key, lang)
);

-- 2. Products Tables
create table if not exists products (
  id text primary key,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists product_translations (
  product_id text references products(id) on delete cascade not null,
  lang text not null,
  name text not null,
  category text not null,
  tagline text not null,
  description text not null,
  highlights jsonb not null default '[]'::jsonb,
  specs jsonb not null default '[]'::jsonb,
  primary key (product_id, lang)
);

-- 3. Blogs Tables
create table if not exists blogs (
  id text primary key,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists blog_translations (
  blog_id text references blogs(id) on delete cascade not null,
  lang text not null,
  category text not null,
  "readTime" text not null,
  date text not null,
  title text not null,
  excerpt text not null,
  body jsonb not null default '[]'::jsonb,
  primary key (blog_id, lang)
);

-- 4. Image Overrides Table
create table if not exists image_overrides (
  key text primary key,
  url text not null
);

-- Enable public select access (Row Level Security policies)
alter table site_translations enable row level security;
create policy "Allow public read" on site_translations for select using (true);
create policy "Allow all for everyone" on site_translations for all using (true);

alter table products enable row level security;
create policy "Allow public read" on products for select using (true);
create policy "Allow all for everyone" on products for all using (true);

alter table product_translations enable row level security;
create policy "Allow public read" on product_translations for select using (true);
create policy "Allow all for everyone" on product_translations for all using (true);

alter table blogs enable row level security;
create policy "Allow public read" on blogs for select using (true);
create policy "Allow all for everyone" on blogs for all using (true);

alter table blog_translations enable row level security;
create policy "Allow public read" on blog_translations for select using (true);
create policy "Allow all for everyone" on blog_translations for all using (true);

alter table image_overrides enable row level security;
create policy "Allow public read" on image_overrides for select using (true);
create policy "Allow all for everyone" on image_overrides for all using (true);

-- 5. Storage configuration for cms-media bucket
insert into storage.buckets (id, name, public)
values ('cms-media', 'cms-media', true)
on conflict (id) do nothing;

-- Storage object policies
create policy "Allow public select on cms-media" on storage.objects
  for select using (bucket_id = 'cms-media');

create policy "Allow public insert on cms-media" on storage.objects
  for insert with check (bucket_id = 'cms-media');

create policy "Allow public update on cms-media" on storage.objects
  for update with check (bucket_id = 'cms-media');

create policy "Allow public delete on cms-media" on storage.objects
  for delete using (bucket_id = 'cms-media');

