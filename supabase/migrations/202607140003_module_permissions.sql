-- Module-level CMS permissions. Super admins in admin_users always retain full access.
create table if not exists public.cms_user_permissions (
  user_id uuid not null references auth.users(id) on delete cascade,
  module text not null check (module in ('products', 'blog', 'projects', 'home', 'services', 'about')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (user_id, module)
);

create index if not exists cms_user_permissions_user_idx
  on public.cms_user_permissions (user_id);

alter table public.cms_user_permissions enable row level security;

create or replace function public.has_cms_permission(requested_module text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin() or exists (
    select 1
    from public.cms_user_permissions
    where user_id = (select auth.uid()) and module = requested_module
  );
$$;

create or replace function public.my_cms_permissions()
returns text[]
language sql
stable
security definer
set search_path = public
as $$
  select case
    when public.is_admin() then array['products', 'blog', 'projects', 'home', 'services', 'about']::text[]
    else coalesce(
      (select array_agg(module order by module) from public.cms_user_permissions where user_id = (select auth.uid())),
      array[]::text[]
    )
  end;
$$;

revoke all on function public.has_cms_permission(text) from public;
revoke all on function public.my_cms_permissions() from public;
grant execute on function public.has_cms_permission(text) to authenticated;
grant execute on function public.my_cms_permissions() to authenticated;

create policy "Users read own permissions"
  on public.cms_user_permissions for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "Super admins manage permissions"
  on public.cms_user_permissions for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Replace broad admin policies with module-specific checks.
drop policy if exists "Admins manage products" on public.cms_products;
create policy "Permitted users manage products"
  on public.cms_products for all to authenticated
  using ((select public.has_cms_permission('products')))
  with check ((select public.has_cms_permission('products')));

drop policy if exists "Admins manage blog posts" on public.cms_blog_posts;
create policy "Permitted users manage blog posts"
  on public.cms_blog_posts for all to authenticated
  using ((select public.has_cms_permission('blog')))
  with check ((select public.has_cms_permission('blog')));

drop policy if exists "Admins manage projects" on public.cms_projects;
create policy "Permitted users manage projects"
  on public.cms_projects for all to authenticated
  using ((select public.has_cms_permission('projects')))
  with check ((select public.has_cms_permission('projects')));

drop policy if exists "Admins manage pages" on public.cms_pages;
create policy "Permitted users manage pages"
  on public.cms_pages for all to authenticated
  using ((select public.has_cms_permission(page_key)))
  with check ((select public.has_cms_permission(page_key)));

-- Media paths start with the module name, e.g. blog/<uuid>-image.webp.
drop policy if exists "Admins upload CMS media" on storage.objects;
drop policy if exists "Admins update CMS media" on storage.objects;
drop policy if exists "Admins delete CMS media" on storage.objects;
create policy "Permitted users upload CMS media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'cms-media'
    and (select public.has_cms_permission((storage.foldername(name))[1]))
  );
create policy "Permitted users update CMS media"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'cms-media'
    and (select public.has_cms_permission((storage.foldername(name))[1]))
  )
  with check (
    bucket_id = 'cms-media'
    and (select public.has_cms_permission((storage.foldername(name))[1]))
  );
create policy "Permitted users delete CMS media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'cms-media'
    and (select public.has_cms_permission((storage.foldername(name))[1]))
  );
