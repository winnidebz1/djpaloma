insert into public.site_settings (id, site_name, primary_email, primary_phone, whatsapp_number, whatsapp_url, location, copyright_text)
values (true, 'DJ Paloma', 'booking@djpaloma.com', '+233 24 462 1771', '+233244621771', 'https://wa.me/233244621771', 'Accra, Ghana', '© 2026 DJ Paloma. All Rights Reserved.')
on conflict (id) do update set
  primary_email = excluded.primary_email,
  primary_phone = excluded.primary_phone,
  whatsapp_number = excluded.whatsapp_number,
  whatsapp_url = excluded.whatsapp_url,
  location = excluded.location,
  copyright_text = excluded.copyright_text;

insert into public.homepage_content (id, hero_eyebrow, hero_headline, hero_description, hero_primary_cta, hero_primary_link, about_label, about_heading, about_description, mission, cta_heading, cta_description)
values (true, 'Ghana Gospel DJ', 'Praise and Worship That moves the room', 'DJ Paloma blends contemporary gospel, live praise breaks and timeless worship classics into a single unforgettable set.', 'Check availability', '#contact', 'Get to Know DJ Paloma', 'A journey of faith, carried through music', 'DJ Paloma is one of Ghana''s most sought-after Gospel DJs, known for creating praise and worship experiences that bring congregations and communities together in faith.', 'To use music as a tool for worship, spreading the gospel message and creating faith-driven experiences that glorify God, one event at a time.', 'Ready to bring worship to your next event?', 'From Sunday service to a National Gospel Festival, let''s build a set that fits the moment.')
on conflict (id) do update set
  hero_eyebrow = excluded.hero_eyebrow,
  hero_headline = excluded.hero_headline,
  hero_description = excluded.hero_description,
  hero_primary_cta = excluded.hero_primary_cta,
  hero_primary_link = excluded.hero_primary_link,
  about_label = excluded.about_label,
  about_heading = excluded.about_heading,
  about_description = excluded.about_description,
  mission = excluded.mission,
  cta_heading = excluded.cta_heading,
  cta_description = excluded.cta_description;

insert into public.statistics (number_value, label, display_order) values
  ('500+', 'Events played', 1), ('100+', 'Churches served', 2), ('15', 'Cities reached', 3), ('9', 'Years active', 4);

insert into public.services (title, short_description, number, display_order) values
  ('Live Praise Sets', 'Reading the room in real time to build praise breaks that rise and fall with the congregation.', '01', 1),
  ('Curated Song Flow', 'Contemporary gospel and timeless worship classics sequenced for one continuous emotional arc.', '02', 2),
  ('Sound & Lighting', 'Full PA and lighting coordination available for churches, halls and outdoor gospel festivals.', '03', 3),
  ('MC & Hosting', 'Light hosting between sets to keep programme flow smooth for pastors and event organisers.', '04', 4),
  ('Custom Playlists', 'Send a list of favourite hymns or artists and they are woven directly into the set.', '05', 5),
  ('On-Time, Every Time', 'Full setup ahead of programme start, with a sound check run before guests arrive.', '06', 6);

insert into public.navigation_items (label, href, display_order, is_cta) values
  ('Home', '#home', 1, false), ('About', '#about', 2, false), ('Events', '#events', 3, false), ('Awards', '#awards', 4, false), ('Book Now', '#contact', 5, true);

insert into public.social_links (label, url, icon, display_order) values
  ('Instagram', 'https://instagram.com/gh.djpaloma', 'instagram', 1),
  ('WhatsApp', 'https://wa.me/233244621771', 'whatsapp', 2);

insert into public.awards (name, organization, award_year, display_order) values
  ('Gospel DJ of the Year', 'Ghana Gospel Music Awards', 2024, 1),
  ('Best Male DJ', 'Ghana DJ Awards', 2023, 2),
  ('Excellence in Gospel Music', 'Christian Music Awards', 2023, 3);

insert into public.seo_settings (page_key, title, meta_description, canonical_url)
values ('home', 'DJ Paloma - Ghana''s Gospel DJ | Praise & Worship Experience', 'DJ Paloma brings praise and worship experiences to churches, weddings and events nationwide.', 'https://djpaloma.vercel.app/')
on conflict (page_key) do nothing;