# CMS Setup (GitHub Pages)

The `/admin/` interface is a static client application. Supabase Auth and Row Level Security protect all data mutations; GitHub Actions remains responsible for rebuilding public static routes.

## 1. Create and migrate Supabase

1. Create a Supabase project.
2. Run all migrations in filename order through the Supabase SQL editor or CLI:
   - `supabase/migrations/202607100001_cms.sql`
   - `supabase/migrations/202607100002_pages_projects.sql`
   - `supabase/migrations/202607140003_module_permissions.sql`
3. In Authentication, create the initial email/password user.
4. Copy that user's UUID and grant admin access:

```sql
insert into public.admin_users (user_id)
values ('<auth-user-uuid>');
```

Do not add an in-app sign-up path. Admin accounts should be provisioned deliberately through the Supabase dashboard.

### Bootstrap the two super admins

Set the server-only environment variables and run the one-off command:

```bash
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
INITIAL_ADMIN_PASSWORD=<temporary-password>
npm run cms:bootstrap-admins
```

This creates (or grants super-admin access to) `dave@aushenstone.com.au` and
`maggie@aushenstone.com.au`. The temporary password is read from the environment
and is never committed. Both users should select **Change password** immediately
after their first sign-in.

## 2. Local environment

Create `.env.local` from `.env.example` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

Restart `npm run dev`, then open `/admin/`.

## 3. Import existing content once

Set server-only values in the current shell or a non-committed environment file:

```bash
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

Run:

```bash
npm run cms:seed
```

The command upserts products, blog posts, Home, Services, Our Story and Projects, so it can be safely rerun during initial setup.

## 4. Deploy the publish Edge Function

Deploy both Edge Functions:

```bash
supabase functions deploy trigger-pages-deploy
supabase functions deploy manage-cms-users
```

Set these secrets for the publish function:

```text
GITHUB_REPOSITORY=aushen-stone/aushen-stone.github.io
GITHUB_PAGES_TOKEN=<fine-grained-token>
```

The fine-grained GitHub token needs access only to this repository and `Contents: Read and write`, which is required for `repository_dispatch`. The function verifies the caller against `admin_users` before using the token.

Never expose this token or `SUPABASE_SERVICE_ROLE_KEY` through a `NEXT_PUBLIC_*` variable.

## 5. Configure GitHub Actions

Repository variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

No Supabase service-role secret is required in GitHub. The build reads only
published rows using the publishable key, and Postgres RLS remains enforced.

When an admin selects **Publish site**, the Edge Function sends a `cms_publish` repository dispatch. The workflow synchronizes published CMS rows into generated TypeScript files, builds all static product/blog routes, and deploys GitHub Pages.

## Publishing behavior

- Saving a draft changes only Supabase.
- Publishing a record makes it eligible for the next static build.
- Selecting **Publish site** starts GitHub Actions; public changes normally appear after several minutes.
- Deleting a row removes it from the next build.
- Home, Services and Our Story are block-based singleton pages. Add, remove or reorder their `blocks` in Advanced JSON.
- Projects are repeatable records with gallery, credits, tags and linked-product fields in Advanced JSON.
- If Supabase build secrets are absent locally, `cms:sync` skips and the existing generated content remains the fallback.

## Accounts and module permissions

- Super admins are rows in `admin_users`; they can manage all content, publish the site and manage accounts.
- Editors are created from **Users & permissions** and can be granted Products, Blog, Projects, Home, Services and/or Our Story independently.
- Postgres RLS enforces every module permission even if someone bypasses the Admin interface.
- All signed-in users can change their own password. Only super admins can create/delete accounts or change another editor's permissions.

## Security checklist

- Keep RLS enabled on all CMS and Storage tables.
- Use the publishable key in browser code; never the service role.
- Grant admin access only through `admin_users`.
- Use a unique Admin password and enable MFA when available.
- Rotate the GitHub token and Supabase service role if either is exposed.
- Review Storage file type and 10 MB size limits before changing them.
