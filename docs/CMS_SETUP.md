# CMS Setup (GitHub Pages)

The `/admin/` interface is a static client application. Supabase Auth and Row Level Security protect all data mutations; GitHub Actions remains responsible for rebuilding public static routes.

## 1. Create and migrate Supabase

1. Create a Supabase project.
2. Run `supabase/migrations/202607100001_cms.sql` in the Supabase SQL editor or through the Supabase CLI.
3. In Authentication, create the initial email/password user.
4. Copy that user's UUID and grant admin access:

```sql
insert into public.admin_users (user_id)
values ('<auth-user-uuid>');
```

Do not add an in-app sign-up path. Admin accounts should be provisioned deliberately through the Supabase dashboard.

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

The command upserts the legacy generated products and blog posts by slug, so it can be safely rerun during initial setup.

## 4. Deploy the publish Edge Function

Deploy `supabase/functions/trigger-pages-deploy` and set these function secrets:

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

Repository secrets:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

When an admin selects **Publish site**, the Edge Function sends a `cms_publish` repository dispatch. The workflow synchronizes published CMS rows into generated TypeScript files, builds all static product/blog routes, and deploys GitHub Pages.

## Publishing behavior

- Saving a draft changes only Supabase.
- Publishing a record makes it eligible for the next static build.
- Selecting **Publish site** starts GitHub Actions; public changes normally appear after several minutes.
- Deleting a row removes it from the next build.
- If Supabase build secrets are absent locally, `cms:sync` skips and the existing generated content remains the fallback.

## Security checklist

- Keep RLS enabled on all CMS and Storage tables.
- Use the publishable key in browser code; never the service role.
- Grant admin access only through `admin_users`.
- Use a unique Admin password and enable MFA when available.
- Rotate the GitHub token and Supabase service role if either is exposed.
- Review Storage file type and 10 MB size limits before changing them.
