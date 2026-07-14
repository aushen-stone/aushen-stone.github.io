-- Aushen CMS schema for a static GitHub Pages frontend.
-- Security is enforced in Postgres because /admin itself is a public static route.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- SECURITY DEFINER avoids recursive RLS checks while keeping the admin list private.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table if not exists public.cms_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 160),
  material text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  image_url text,
  content jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 200),
  status text not null default 'draft' check (status in ('draft', 'published')),
  hero_image_url text,
  content jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cms_products_status_updated_idx
  on public.cms_products (status, updated_at desc);
create index if not exists cms_blog_posts_status_updated_idx
  on public.cms_blog_posts (status, updated_at desc);

alter table public.cms_products enable row level security;
alter table public.cms_blog_posts enable row level security;

create policy "Published products are public"
  on public.cms_products for select
  to anon, authenticated
  using (status = 'published');
create policy "Admins manage products"
  on public.cms_products for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Published blog posts are public"
  on public.cms_blog_posts for select
  to anon, authenticated
  using (status = 'published');
create policy "Admins manage blog posts"
  on public.cms_blog_posts for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- The public bucket serves images in the static site; writes remain admin-only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media',
  'cms-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read CMS media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'cms-media');
create policy "Admins upload CMS media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'cms-media' and (select public.is_admin()));
create policy "Admins update CMS media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'cms-media' and (select public.is_admin()))
  with check (bucket_id = 'cms-media' and (select public.is_admin()));
create policy "Admins delete CMS media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'cms-media' and (select public.is_admin()));
