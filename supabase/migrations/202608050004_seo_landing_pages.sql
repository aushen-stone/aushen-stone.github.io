-- Editable, statically published SEO landing pages for product materials and applications.
create table if not exists public.cms_seo_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  page_type text not null check (page_type in ('material', 'application')),
  title text not null check (char_length(title) between 1 and 200),
  status text not null default 'draft' check (status in ('draft', 'published')),
  content jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_type, slug)
);

create index if not exists cms_seo_pages_status_type_updated_idx
  on public.cms_seo_pages (status, page_type, updated_at desc);

alter table public.cms_seo_pages enable row level security;

create policy "Published SEO pages are public"
  on public.cms_seo_pages for select to anon, authenticated
  using (status = 'published');

create policy "Permitted users manage SEO pages"
  on public.cms_seo_pages for all to authenticated
  using ((select public.has_cms_permission('seo_pages')))
  with check ((select public.has_cms_permission('seo_pages')));

-- Extend the module allow-list without changing any existing user's grants.
alter table public.cms_user_permissions
  drop constraint if exists cms_user_permissions_module_check;
alter table public.cms_user_permissions
  add constraint cms_user_permissions_module_check
  check (module in ('products', 'blog', 'projects', 'home', 'services', 'about', 'seo_pages'));

create or replace function public.my_cms_permissions()
returns text[]
language sql
stable
security definer
set search_path = public
as $$
  select case
    when public.is_admin() then array['products', 'blog', 'projects', 'home', 'services', 'about', 'seo_pages']::text[]
    else coalesce(
      (select array_agg(module order by module) from public.cms_user_permissions where user_id = (select auth.uid())),
      array[]::text[]
    )
  end;
$$;

-- SEO page media can be added later without revisiting storage security.
-- Existing users keep exactly their current grants; only super admins receive
-- this module automatically through my_cms_permissions().
