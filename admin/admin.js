const sections = [
  ['dashboard', 'Dashboard'], ['homepage_content', 'Homepage'], ['services', 'Services / Experience'],
  ['mixes', 'Media / Gospel Mixes'], ['gallery_items', 'Gallery / Highlights'], ['events', 'Events'],
  ['bookings', 'Bookings'], ['awards', 'Awards & Press'], ['featured_in', 'Featured In'],
  ['contact_messages', 'Messages'], ['site_settings', 'Contact / Site Settings'],
  ['navigation_items', 'Navigation'], ['social_links', 'Social Links'], ['seo_settings', 'SEO'],
  ['media', 'Media Library'], ['admin_profiles', 'Admin Settings']
];

const definitions = {
  homepage_content: [['hero_eyebrow','Hero eyebrow','text'],['hero_headline','Hero headline','text'],['hero_description','Hero description','textarea'],['hero_primary_cta','Primary CTA','text'],['hero_primary_link','Primary CTA link','url'],['about_label','About label','text'],['about_heading','About heading','text'],['about_description','About description','textarea'],['mission','Mission','textarea'],['cta_heading','CTA heading','text'],['cta_description','CTA description','textarea']],
  site_settings: [['site_name','Site name','text'],['primary_email','Primary email','email'],['primary_phone','Primary phone','tel'],['whatsapp_number','WhatsApp number','text'],['whatsapp_url','WhatsApp URL','url'],['location','Location','text'],['address','Address','text'],['copyright_text','Copyright text','text']],
  bookings: [['full_name','Name','text'],['phone','Phone','tel'],['email','Email','email'],['event_type','Event type','text'],['event_date','Event date','date'],['location','Location','text'],['details','Details','textarea'],['status','Status','select'],['internal_notes','Internal notes','textarea']],
  contact_messages: [['name','Name','text'],['email','Email','email'],['subject','Subject','text'],['message','Message','textarea'],['is_read','Read','text'],['is_archived','Archived','text'],['internal_notes','Internal notes','textarea']],
  media: [['file_name','File name','text'],['storage_path','Storage path','text'],['public_url','Public URL','url'],['alt_text','Alt text','text'],['caption','Caption','text'],['mime_type','File type','text']],
  services: [['title','Title','text'],['short_description','Short description','textarea'],['number','Number','text'],['display_order','Order','number'],['status','Status','select']],
  mixes: [['title','Title','text'],['description','Description','textarea'],['platform','Platform','text'],['platform_url','Platform URL','url'],['embed_url','Embed URL','url'],['published_on','Date','date'],['status','Status','select']],
  gallery_items: [['title','Title','text'],['event_name','Event name','text'],['event_date','Event date','date'],['location','Location','text'],['category','Category','text'],['status','Status','select']],
  events: [['name','Event name','text'],['event_date','Date','date'],['start_time','Start time','time'],['end_time','End time','time'],['venue','Venue','text'],['city','City','text'],['country','Country','text'],['event_type','Event type','text'],['reservation_url','Reservation URL','url'],['status','Status','select'],['visibility','Visibility','select']],
  awards: [['name','Award name','text'],['organization','Organization','text'],['award_year','Year','number'],['category','Category','text'],['description','Description','textarea'],['status','Status','select']],
  featured_in: [['organization_name','Organization','text'],['website_url','Website URL','url'],['display_order','Order','number'],['status','Status','select']],
  social_links: [['label','Label','text'],['url','URL','url'],['icon','Icon','text'],['display_order','Order','number']],
  navigation_items: [['label','Label','text'],['href','Link','text'],['display_order','Order','number'],['status','Status','select']],
  seo_settings: [['page_key','Page key','text'],['title','Title','text'],['meta_description','Description','textarea'],['canonical_url','Canonical URL','url']],
  statistics: [['number_value','Number','text'],['label','Label','text'],['display_order','Order','number'],['status','Status','select']]
};

let client;
let currentUser;
const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

async function boot() {
  const config = await fetch('/api/config').then((response) => response.json());
  if (!config.url || !config.anonKey) throw new Error(config.error || 'Admin configuration is unavailable.');
  client = window.supabase.createClient(config.url, config.anonKey);
  client.auth.onAuthStateChange((_event, session) => setSession(session));
  setSession((await client.auth.getSession()).data.session);
}

function setSession(session) {
  currentUser = session?.user || null;
  $('#loginView').classList.toggle('hidden', Boolean(currentUser));
  $('#appView').classList.toggle('hidden', !currentUser);
  if (currentUser) {
    $('#adminEmail').textContent = currentUser.email;
    renderNav();
    showSection('dashboard');
  }
}

function renderNav() {
  $('#adminNav').innerHTML = sections.map(([key, label]) => `<button class="nav-item" data-section="${key}">${label}</button>`).join('');
  $('#adminNav').querySelectorAll('button').forEach((button) => button.addEventListener('click', () => showSection(button.dataset.section)));
}

async function showSection(section) {
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.section === section));
  $('#pageTitle').textContent = sections.find(([key]) => key === section)?.[1] || 'Dashboard';
  $('#dashboardPanel').classList.toggle('hidden', section !== 'dashboard');
  $('#resourcePanel').classList.toggle('hidden', section === 'dashboard');
  if (section === 'dashboard') return renderDashboard();
  return renderResource(section);
}

async function renderDashboard() {
  const tables = ['events','gallery_items','mixes','awards','bookings','contact_messages'];
  const counts = await Promise.all(tables.map(async (table) => {
    const result = await client.from(table).select('*', { count: 'exact', head: true });
    return [table, result.count || 0];
  }));
  const countMap = Object.fromEntries(counts);
  $('#dashboardPanel').innerHTML = `<div class="stat-grid">${[['events','Events'],['gallery_items','Gallery items'],['mixes','Gospel mixes'],['awards','Awards'],['bookings','Bookings'],['contact_messages','Messages']].map(([key,label]) => `<div class="stat-card"><strong>${countMap[key]}</strong><span>${label}</span></div>`).join('')}</div><div class="content-card" style="margin-top:20px"><h2>Quick actions</h2><div class="table-actions">${['events','gallery_items','mixes','awards'].map((key) => `<button class="button primary" data-quick="${key}">Add ${sections.find(([id]) => id === key)[1]}</button>`).join('')}</div></div>`;
  $('#dashboardPanel').querySelectorAll('[data-quick]').forEach((button) => button.addEventListener('click', () => showSection(button.dataset.quick)));
}

function fieldMarkup([key, label, type], value = '') {
  if (type === 'textarea') return `<label class="${key === 'description' ? 'full' : ''}">${label}<textarea name="${key}">${escapeHtml(value)}</textarea></label>`;
  if (type === 'select') {
    const options = key === 'status' && label === 'Status' && document.querySelector('[data-section="bookings"]') ? ['new','contacted','follow_up','quoted','confirmed','completed','cancelled'] : ['draft','published','archived'];
    return `<label>${label}<select name="${key}">${options.map((option) => `<option value="${option}" ${value === option ? 'selected' : ''}>${option.replace('_',' ')}</option>`).join('')}</select></label>`;
  }
  return `<label>${label}<input name="${key}" type="${type}" value="${escapeHtml(value)}"></label>`;
}

async function renderResource(table) {
  if (!definitions[table]) return renderPlaceholder(table);
  const { data, error } = await client.from(table).select('*').order('updated_at', { ascending: false }).limit(100);
  if (error) return showError(error.message);
  const fields = definitions[table];
  const canArchive = !['homepage_content', 'site_settings'].includes(table);
  const isSingleton = ['homepage_content', 'site_settings'].includes(table);
  $('#resourcePanel').innerHTML = `<div class="section-toolbar"><h2>${sections.find(([key]) => key === table)[1]}</h2>${isSingleton ? '' : '<button class="button primary" id="newRecord">Add new</button>'}</div><form class="editor hidden" id="editor">${fields.map((field) => fieldMarkup(field)).join('')}<div class="editor-actions full"><button class="button primary">Save</button><button class="text-button" type="button" id="cancelEdit">Cancel</button><input type="hidden" name="id"></div></form><div class="content-card"><table class="data-table"><thead><tr>${fields.slice(0,4).map(([,label]) => `<th>${label}</th>`).join('')}<th>Actions</th></tr></thead><tbody>${(data || []).map((row) => `<tr>${fields.slice(0,4).map(([key]) => `<td>${escapeHtml(row[key])}</td>`).join('')}<td><div class="table-actions"><button class="small-button" data-edit="${row.id}">Edit</button>${canArchive ? `<button class="small-button danger" data-delete="${row.id}">Archive</button>` : ''}</div></td></tr>`).join('') || '<tr><td colspan="5">No records yet.</td></tr>'}</tbody></table></div>`;
  const editor = $('#editor');
  if (!isSingleton) $('#newRecord').addEventListener('click', () => { editor.classList.remove('hidden'); editor.reset(); });
  $('#cancelEdit').addEventListener('click', () => editor.classList.add('hidden'));
  editor.addEventListener('submit', async (event) => { event.preventDefault(); const payload = Object.fromEntries(new FormData(editor)); const id = payload.id; delete payload.id; const result = id ? await client.from(table).update(payload).eq('id', id) : await client.from(table).insert(payload); if (result.error) return showError(result.error.message); notify('Changes saved'); renderResource(table); });
  editor.querySelector('[name="id"]').value = '';
  $('#resourcePanel').querySelectorAll('[data-edit]').forEach((button) => button.addEventListener('click', () => { const row = data.find((item) => item.id === button.dataset.edit); editor.classList.remove('hidden'); fields.forEach(([key]) => { const input = editor.elements[key]; if (input) input.value = row[key] ?? ''; }); editor.elements.id.value = row.id; }));
  $('#resourcePanel').querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', async () => { if (!confirm('Archive this record?')) return; const result = await client.from(table).update({ status: 'archived' }).eq('id', button.dataset.delete); if (result.error) return showError(result.error.message); renderResource(table); }));
}

function renderPlaceholder(table) { $('#resourcePanel').innerHTML = `<div class="content-card"><h2>${sections.find(([key]) => key === table)[1]}</h2><p class="muted">This protected workspace is ready for the normalized CMS records. Configure the table in Supabase, then manage it here.</p></div>`; }
function showError(message) { $('#resourcePanel').innerHTML = `<div class="content-card"><p class="form-message">${escapeHtml(message)}</p></div>`; }
function notify(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2400); }

$('#loginForm').addEventListener('submit', async (event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget)); const result = await client.auth.signInWithPassword(values); if (result.error) $('#loginMessage').textContent = result.error.message; });
$('#forgotPassword').addEventListener('click', async () => { const email = $('#loginForm').elements.email.value; if (!email) return $('#loginMessage').textContent = 'Enter your email first.'; const result = await client.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/admin/` }); $('#loginMessage').textContent = result.error ? result.error.message : 'Password reset email sent.'; });
$('#logoutButton').addEventListener('click', () => client.auth.signOut());
boot().catch((error) => { $('#loginMessage').textContent = error.message; });