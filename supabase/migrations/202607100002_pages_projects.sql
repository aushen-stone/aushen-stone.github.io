-- Extends the CMS to managed singleton pages and repeatable project records.

create table if not exists public.cms_pages (
  page_key text primary key check (page_key in ('home', 'services', 'about')),
  title text not null check (char_length(title) between 1 and 200),
  status text not null default 'draft' check (status in ('draft', 'published')),
  hero_image_url text,
  content jsonb not null default '{"blocks":[]}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 200),
  category text not null default 'Residential',
  status text not null default 'draft' check (status in ('draft', 'published')),
  hero_image_url text,
  content jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cms_pages_status_updated_idx
  on public.cms_pages (status, updated_at desc);
create index if not exists cms_projects_status_updated_idx
  on public.cms_projects (status, updated_at desc);

alter table public.cms_pages enable row level security;
alter table public.cms_projects enable row level security;

create policy "Published pages are public"
  on public.cms_pages for select to anon, authenticated
  using (status = 'published');
create policy "Admins manage pages"
  on public.cms_pages for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Published projects are public"
  on public.cms_projects for select to anon, authenticated
  using (status = 'published');
create policy "Admins manage projects"
  on public.cms_projects for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
