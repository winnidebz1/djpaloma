const { sendJson, supabaseRequest } = require('./_supabase');

const publicTables = {
  settings: 'site_settings?select=*&limit=1',
  homepage: 'homepage_content?select=*&limit=1',
  navigation: 'navigation_items?select=*&is_visible=eq.true&status=eq.published&order=display_order.asc',
  social: 'social_links?select=*&is_active=eq.true&order=display_order.asc',
  statistics: 'statistics?select=*&is_active=eq.true&status=eq.published&order=display_order.asc',
  services: 'services?select=*&is_active=eq.true&status=eq.published&order=display_order.asc',
  mixes: 'mixes?select=*&status=eq.published&order=display_order.asc',
  gallery: 'gallery_items?select=*&status=eq.published&order=display_order.asc',
  events: 'events?select=*&visibility=eq.published&status=neq.draft&order=event_date.asc',
  awards: 'awards?select=*&status=eq.published&order=display_order.asc',
  featuredIn: 'featured_in?select=*&status=eq.published&order=display_order.asc',
  seo: 'seo_settings?select=*&page_key=eq.home&limit=1'
};

module.exports = async (req, res) => {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
  try {
    const entries = await Promise.all(Object.entries(publicTables).map(async ([key, query]) => [key, await supabaseRequest(query)]));
    return sendJson(res, 200, Object.fromEntries(entries));
  } catch (error) {
    console.error(error);
    return sendJson(res, error.status || 500, { error: 'Unable to load website content' });
  }
};