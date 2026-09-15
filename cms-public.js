(async function loadCmsContent() {
  try {
    const response = await fetch('/api/content');
    if (!response.ok) return;
    const content = await response.json();
    const home = content.homepage?.[0] || {};
    const setText = (selector, value) => { if (value) document.querySelector(selector)?.replaceChildren(document.createTextNode(value)); };
    const setLink = (selector, value) => { if (value) document.querySelector(selector)?.setAttribute('href', value); };

    setText('.slide strong', home.hero_headline);
    setText('.slide p.lede', home.hero_description);
    setText('.hero-ctas .btn-primary', home.hero_primary_cta);
    setLink('.hero-ctas .btn-primary', home.hero_primary_link);
    setText('.about-copy .kicker', home.about_label);
    setText('.about-copy h3', home.about_heading);
    if (home.about_description) setText('.about-copy > p', home.about_description);
    setText('.mission-box p', home.mission);
    setText('.cta-band h2', home.cta_heading);
    setText('.cta-band p', home.cta_description);

    if (content.statistics?.length) {
      document.querySelector('.stat-row')?.replaceChildren(...content.statistics.map((stat) => {
        const item = document.createElement('div');
        item.className = 'stat';
        item.innerHTML = `<strong>${escapeHtml(stat.number_value)}</strong><span>${escapeHtml(stat.label)}</span>`;
        return item;
      }));
    }
    if (content.services?.length) {
      document.querySelector('.feature-grid')?.replaceChildren(...content.services.map((service, index) => {
        const item = document.createElement('div');
        item.className = 'feature-card';
        item.innerHTML = `<span class="feature-num">${escapeHtml(service.number || String(index + 1).padStart(2, '0'))}</span><div class="feature-copy"><h4>${escapeHtml(service.title)}</h4><p>${escapeHtml(service.short_description || service.full_description)}</p></div>`;
        return item;
      }));
    }
    if (content.mixes?.[0]) {
      const mix = content.mixes[0];
      setText('.audiomack-link span', mix.title || 'Listen to the playlist');
      setLink('.audiomack-link', mix.platform_url);
    }
    if (content.events?.length) renderEvents(content.events);
    if (content.awards?.length) {
      document.querySelector('.awards-grid')?.replaceChildren(...content.awards.map((award) => {
        const item = document.createElement('div');
        item.className = 'award-card';
        item.innerHTML = `<h4>${escapeHtml(award.name)}</h4><span>${escapeHtml([award.organization, award.award_year].filter(Boolean).join(', '))}</span>`;
        return item;
      }));
    }
    applySettings(content.settings?.[0], content.social);
  } catch (error) {
    console.warn('CMS content unavailable; keeping the built-in website content.', error);
  }
})();

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

function renderEvents(events) {
  const list = document.querySelector('.event-list');
  if (!list) return;
  list.replaceChildren(...events.map((event) => {
    const row = document.createElement('div');
    row.className = 'event-row';
    const date = new Date(`${event.event_date}T00:00:00`);
    const time = [event.start_time, event.end_time].filter(Boolean).join(' - ');
    row.innerHTML = `<div class="event-date"><strong>${date.getDate()}</strong><span>${date.toLocaleString('en', {month:'short'}).toUpperCase()}</span></div><div class="event-info"><h4>${escapeHtml(event.name)}</h4><p>${escapeHtml([event.venue, event.city].filter(Boolean).join(', '))}${time ? ` &nbsp;·&nbsp; ${escapeHtml(time)}` : ''}</p></div><a href="${escapeHtml(event.reservation_url || '#contact')}" class="event-cta">Reserve a spot</a>`;
    return row;
  }));
}

function applySettings(settings, socials = []) {
  if (!settings) return;
  document.querySelectorAll('.contact-line span').forEach((element, index) => {
    const value = [settings.primary_phone, settings.primary_email, settings.location][index];
    if (value) element.textContent = value;
  });
  const whatsapp = socials.find((item) => item.label.toLowerCase() === 'whatsapp');
  if (whatsapp) document.querySelectorAll('a[href*="wa.me"]').forEach((link) => link.href = whatsapp.url);
}