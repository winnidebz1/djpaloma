# DJ Paloma CMS setup

The existing static frontend remains in place. The CMS adds Vercel serverless functions, Supabase/PostgreSQL storage, and a protected dashboard at `/admin/`.

## 1. Create Supabase

1. Create a Supabase project.
2. In the SQL editor, run `supabase/schema.sql`.
3. Run `supabase/seed.sql` to migrate the current text records.
4. In Authentication, create the first user with the email/password that will administer the site.
5. Insert that user's UUID into `admin_profiles`:

```sql
insert into public.admin_profiles (id, display_name, role)
values ('AUTH_USER_UUID', 'DJ Paloma Admin', 'admin');
```

The user must exist in Supabase Auth before this insert.

## 2. Vercel environment variables

Add these variables to the Vercel project for Preview and Production:

```text
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_SERVICE_ROLE_KEY
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code. The `/api/content` and `/api/submit` functions use it only on the server.

## 3. Routes and data flow

- Public website: `/index.html` and `/mobile.html`
- Admin login/dashboard: `/admin/`
- Public CMS payload: `GET /api/content`
- Public form endpoint: `POST /api/submit`
- Public Supabase client configuration: `GET /api/config`

The public endpoint returns only site content intended for published pages. Booking and contact rows are write-only for anonymous visitors and readable only by authenticated admin profiles through Supabase RLS.

## 4. Storage

Create a private `media` bucket in Supabase Storage for administrator uploads. Add storage policies that allow authenticated admin profiles to upload, update, and delete files, and allow public reads only if the bucket is made public. Record the resulting URL and metadata in `public.media`.

The schema keeps media in its own table so the same image can be reused by hero, gallery, awards, and featured-in records.

## 5. Deployment

Commit the repository, connect it to Vercel, add the three environment variables, and redeploy. No frontend build command is required. Vercel detects the `api/` serverless functions and serves `admin/index.html` at `/admin/`.

## 6. Acceptance checks

After configuration:

1. Sign in at `/admin/`.
2. Edit a service or event and publish it.
3. Refresh the public page and confirm the CMS hydration changes the visible record.
4. Submit the booking and contact forms and confirm the rows are visible only to the admin.
5. Create a draft record and confirm it is excluded from `/api/content`.

The current static content remains as a fallback until the database is configured, so the public site does not go blank during setup.