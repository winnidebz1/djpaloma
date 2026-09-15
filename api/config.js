const { sendJson } = require('./_supabase');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return sendJson(res, 500, { error: 'Supabase public configuration is missing' });
  return sendJson(res, 200, { url, anonKey });
};