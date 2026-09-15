create extension if not exists pgcrypto;

create type public.content_status as enum ('draft', 'published', 'archived');
create type public.event_status as enum ('upcoming', 'past', 'cancelled', 'draft');
create type public.booking_status as enum ('new', 'contacted', 'follow_up', 'quoted', 'confirmed', 'completed', 'cancelled');

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id boolean primary key default true check (id),
  site_name text not null default 'DJ Paloma',
  logo_media_id uuid,
  favicon_media_id uuid,
  primary_email text,
  primary_phone text,
  whatsapp_number text,
  whatsapp_url text,
  location text,
  address text,
  copyright_text text,
  maintenance_mode boolean not null default false,
  announcement_visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  icon text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  is_cta boolean not null default false,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.homepage_content (
  id boolean primary key default true check (id),
  hero_eyebrow text,
  hero_headline text,
  hero_description text,
  hero_primary_cta text,
  hero_primary_link text,
  hero_secondary_cta text,
  hero_secondary_link text,
  hero_background_media_id uuid,
  hero_overlay numeric not null default 0.65 check (hero_overlay between 0 and 1),
  hero_position text not null default 'right center',
  promo_award text,
  promo_announcement text,
  promo_booking_status text,
  promo_availability text,
  promo_instagram text,
  promo_cta text,
  promo_cta_link text,
  about_label text,
  about_heading text,
  about_description text,
  about_image_media_id uuid,
  about_cta text,
  about_cta_link text,
  mission text,
  cta_heading text,
  cta_description text,
  updated_at timestamptz not null default now()
);

create table public.statistics (
  id uuid primary key default gen_random_uuid(),
  number_value text not null,
  label text not null,
  icon text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  short_description text,
  full_description text,
  number text,
  icon text,
  image_media_id uuid,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  display_order integer not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null unique,
  public_url text not null,
  alt_text text,
  caption text,
  mime_type text not null,
  file_size bigint,
  width integer,
  height integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mixes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_media_id uuid references public.media(id) on delete set null,
  platform text,
  platform_url text,
  embed_url text,
  published_on date,
  is_featured boolean not null default false,
  display_order integer not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  media_id uuid not null references public.media(id) on delete restrict,
  title text,
  description text,
  event_name text,
  event_date date,
  location text,
  instagram_url text,
  category text,
  is_featured boolean not null default false,
  display_order integer not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  event_date date not null,
  start_time time,
  end_time time,
  venue text,
  city text,
  country text,
  description text,
  image_media_id uuid references public.media(id) on delete set null,
  event_type text,
  reservation_url text,
  is_featured boolean not null default false,
  status public.event_status not null default 'upcoming',
  visibility public.content_status not null default 'published',
  manual_group text check (manual_group in ('upcoming', 'past') or manual_group is null),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.awards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text,
  award_year integer,
  category text,
  description text,
  image_media_id uuid references public.media(id) on delete set null,
  is_featured boolean not null default false,
  display_order integer not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.featured_in (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  logo_media_id uuid references public.media(id) on delete set null,
  website_url text,
  display_order integer not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.seo_settings (
  id uuid primary key default gen_random_uuid(),
  page_key text not null unique,
  title text,
  meta_description text,
  keywords text,
  og_title text,
  og_description text,
  og_image_media_id uuid references public.media(id) on delete set null,
  twitter_card text,
  google_verification text,
  canonical_url text,
  updated_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  event_type text not null,
  event_date date not null,
  location text not null,
  details text,
  status public.booking_status not null default 'new',
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  is_read boolean not null default false,
  is_archived boolean not null default false,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.admin_profiles(id) on delete set null,
  action text not null,
  content_type text,
  content_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admin_profiles where id = auth.uid()); $$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare table_name text;
begin
  foreach table_name in array array['admin_profiles','site_settings','social_links','navigation_items','homepage_content','statistics','services','media','mixes','gallery_items','events','awards','featured_in','seo_settings','bookings','contact_messages'] loop
    execute format('drop trigger if exists %I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger %I_updated_at before update on public.%I for each row execute function public.touch_updated_at()', table_name, table_name);
  end loop;
end $$;

alter table public.admin_profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.social_links enable row level security;
alter table public.navigation_items enable row level security;
alter table public.homepage_content enable row level security;
alter table public.statistics enable row level security;
alter table public.services enable row level security;
alter table public.media enable row level security;
alter table public.mixes enable row level security;
alter table public.gallery_items enable row level security;
alter table public.events enable row level security;
alter table public.awards enable row level security;
alter table public.featured_in enable row level security;
alter table public.seo_settings enable row level security;
alter table public.bookings enable row level security;
alter table public.contact_messages enable row level security;
alter table public.activity_log enable row level security;

create policy "public read published site settings" on public.site_settings for select using (true);
create policy "public read active social links" on public.social_links for select using (is_active);
create policy "public read visible navigation" on public.navigation_items for select using (is_visible and status = 'published');
create policy "public read homepage" on public.homepage_content for select using (true);
create policy "public read published statistics" on public.statistics for select using (is_active and status = 'published');
create policy "public read published services" on public.services for select using (is_active and status = 'published');
create policy "public read media" on public.media for select using (true);
create policy "public read published mixes" on public.mixes for select using (status = 'published');
create policy "public read published gallery" on public.gallery_items for select using (status = 'published');
create policy "public read published events" on public.events for select using (visibility = 'published' and status <> 'draft');
create policy "public read published awards" on public.awards for select using (status = 'published');
create policy "public read published featured in" on public.featured_in for select using (status = 'published');
create policy "public read seo" on public.seo_settings for select using (true);

create policy "admins manage admin profiles" on public.admin_profiles for all using (is_admin()) with check (is_admin());
create policy "admins manage site settings" on public.site_settings for all using (is_admin()) with check (is_admin());
create policy "admins manage social links" on public.social_links for all using (is_admin()) with check (is_admin());
create policy "admins manage navigation" on public.navigation_items for all using (is_admin()) with check (is_admin());
create policy "admins manage homepage" on public.homepage_content for all using (is_admin()) with check (is_admin());
create policy "admins manage statistics" on public.statistics for all using (is_admin()) with check (is_admin());
create policy "admins manage services" on public.services for all using (is_admin()) with check (is_admin());
create policy "admins manage media" on public.media for all using (is_admin()) with check (is_admin());
create policy "admins manage mixes" on public.mixes for all using (is_admin()) with check (is_admin());
create policy "admins manage gallery" on public.gallery_items for all using (is_admin()) with check (is_admin());
create policy "admins manage events" on public.events for all using (is_admin()) with check (is_admin());
create policy "admins manage awards" on public.awards for all using (is_admin()) with check (is_admin());
create policy "admins manage featured in" on public.featured_in for all using (is_admin()) with check (is_admin());
create policy "admins manage seo" on public.seo_settings for all using (is_admin()) with check (is_admin());
create policy "admins manage bookings" on public.bookings for all using (is_admin()) with check (is_admin());
create policy "admins manage contact messages" on public.contact_messages for all using (is_admin()) with check (is_admin());
create policy "admins read activity log" on public.activity_log for select using (is_admin());
create policy "admins write activity log" on public.activity_log for insert with check (is_admin());

create policy "public submit bookings" on public.bookings for insert with check (true);
create policy "public submit contact messages" on public.contact_messages for insert with check (true);

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

create policy "public read media files" on storage.objects for select
using (bucket_id = 'media');

create policy "admins upload media files" on storage.objects for insert
with check (bucket_id = 'media' and public.is_admin());

create policy "admins update media files" on storage.objects for update
using (bucket_id = 'media' and public.is_admin())
with check (bucket_id = 'media' and public.is_admin());

create policy "admins delete media files" on storage.objects for delete
using (bucket_id = 'media' and public.is_admin());

insert into public.site_settings (id) values (true) on conflict (id) do nothing;
insert into public.homepage_content (id) values (true) on conflict (id) do nothing;