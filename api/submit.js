const { sendJson, supabaseRequest } = require('./_supabase');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, max = 4000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function validate(payload, fields) {
  const values = Object.fromEntries(fields.map((field) => [field, clean(payload[field])]));
  if (fields.some((field) => !values[field])) return { error: 'Please complete all required fields.' };
  if (!emailPattern.test(values.email)) return { error: 'Please enter a valid email address.' };
  return { values };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
  const payload = req.body || {};
  if (clean(payload.website, 100)) return sendJson(res, 200, { ok: true });

  try {
    if (payload.type === 'booking') {
      const result = validate(payload, ['full_name', 'phone', 'email', 'event_type', 'event_date', 'location']);
      if (result.error) return sendJson(res, 400, result);
      await supabaseRequest('bookings', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ ...result.values, details: clean(payload.details) })
      });
    } else if (payload.type === 'contact') {
      const result = validate(payload, ['name', 'email', 'subject', 'message']);
      if (result.error) return sendJson(res, 400, result);
      await supabaseRequest('contact_messages', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify(result.values)
      });
    } else {
      return sendJson(res, 400, { error: 'Unknown submission type.' });
    }
    return sendJson(res, 201, { ok: true, message: 'Thanks. Your message has been received.' });
  } catch (error) {
    console.error(error);
    return sendJson(res, error.status || 500, { error: 'Unable to submit your request right now.' });
  }
};