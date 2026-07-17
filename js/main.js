// Petty Cash Static Site - Shared functionality
const APP_URL = 'https://pattycashsystem.web.app';
const LANGS = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' }
];

function getLang() {
  const params = new URLSearchParams(window.location.search);
  const paramLang = params.get('lang');
  if (paramLang && ['en', 'ar'].includes(paramLang)) return paramLang;
  const stored = localStorage.getItem('pettycash-lang');
  if (stored && ['en', 'ar'].includes(stored)) return stored;
  return 'en';
}

function setLang(code) {
  if (!['en', 'ar'].includes(code)) return;
  localStorage.setItem('pettycash-lang', code);
  document.documentElement.lang = code;
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
}

function t(key, fallback) {
  const lang = getLang();
  const data = window.TRANSLATIONS?.[lang];
  if (!data) return fallback ?? key;
  const parts = key.split('.');
  let val = data;
  for (const p of parts) {
    if (val && typeof val === 'object' && p in val) val = val[p];
    else return fallback ?? key;
  }
  return val !== undefined && val !== null ? val : fallback ?? key;
}

function translatePage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const attr = el.dataset.i18nAttr;
    const value = t(key);
    if (attr) el.setAttribute(attr, value);
    else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      if (el.placeholder) el.placeholder = value;
      else el.value = value;
    } else {
      el.textContent = value;
    }
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
}

function renderNavbar() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const isHome = currentPath === '' || currentPath === 'index.html';
  const lang = getLang();

  const navLinks = [
    { href: './', label: t('nav.home'), exact: true },
    { href: './features.html', label: t('nav.features') },
    { href: './pricing.html', label: t('nav.pricing') },
    { href: './petty-cash-calculator.html', label: t('nav.calculator') },
    { href: './blog.html', label: t('nav.blog') },
    { href: './help.html', label: t('nav.help') },
    { href: './about.html', label: t('nav.about') },
    { href: './contact.html', label: t('nav.contact') }
  ];

  const currentLang = LANGS.find(l => l.code === lang) || LANGS[0];

  const langOptions = LANGS.map(l =>
    `<button data-lang="${l.code}" class="w-full text-start px-3 py-2 text-sm hover:bg-slate-100 rounded-md ${l.code === lang ? 'font-semibold text-blue-600' : 'text-slate-700'}">${l.label}</button>`
  ).join('');

  const linksHtml = navLinks.map(l => {
    const active = (l.exact && isHome) || (!l.exact && currentPath.includes(l.href.replace('./', '').replace('.html', '')));
    const activeClass = active ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50';
    return `<a href="${l.href}" class="${activeClass} px-3 py-2 rounded-lg text-sm font-medium transition-colors">${l.label}</a>`;
  }).join('');

  const mobileLinksHtml = navLinks.map(l => {
    const active = (l.exact && isHome) || (!l.exact && currentPath.includes(l.href.replace('./', '').replace('.html', '')));
    const activeClass = active ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50';
    return `<a href="${l.href}" class="${activeClass} block px-3 py-2.5 rounded-lg text-sm font-medium">${l.label}</a>`;
  }).join('');

  const html = `
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <a href="./" class="flex items-center gap-2 font-bold text-xl text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
            <span>Petty Cash</span>
          </a>
          <nav class="hidden md:flex items-center gap-1">${linksHtml}</nav>
          <div class="hidden md:flex items-center gap-2">
            <a href="${APP_URL}/login" class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">${t('nav.login')}</a>
            <a href="${APP_URL}/register" class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">${t('nav.signup')}</a>
            <div class="relative ml-2" id="lang-dropdown">
              <button id="lang-btn" class="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <span>${currentLang.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div id="lang-menu" class="hidden absolute end-0 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-lg p-1 z-50">${langOptions}</div>
            </div>
          </div>
          <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100" aria-label="Toggle menu">
            <svg id="menu-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </div>
      <div id="mobile-menu" class="hidden md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1">
        ${mobileLinksHtml}
        <div class="pt-3 border-t border-slate-100 flex flex-col gap-2">
          <a href="${APP_URL}/login" class="block text-center px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg">${t('nav.login')}</a>
          <a href="${APP_URL}/register" class="block text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg">${t('nav.signup')}</a>
        </div>
      </div>
    </header>
  `;

  const placeholder = document.getElementById('navbar');
  if (placeholder) placeholder.innerHTML = html;

  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) btn.addEventListener('click', () => menu.classList.toggle('hidden'));

  const langBtn = document.getElementById('lang-btn');
  const langMenu = document.getElementById('lang-menu');
  if (langBtn && langMenu) {
    langBtn.addEventListener('click', (e) => { e.stopPropagation(); langMenu.classList.toggle('hidden'); });
    document.addEventListener('click', () => langMenu.classList.add('hidden'));
  }

  document.querySelectorAll('[data-lang]').forEach(b => {
    b.addEventListener('click', () => { setLang(b.dataset.lang); window.location.reload(); });
  });
}

function renderFooter() {
  const year = new Date().getFullYear();
  const html = `
    <footer class="bg-slate-900 text-slate-300 mt-auto">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div class="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
              <span>Petty Cash</span>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed">${t('footer.tagline')}</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3 text-sm">${t('footer.links')}</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="./" class="hover:text-white transition-colors">${t('nav.home')}</a></li>
              <li><a href="./features.html" class="hover:text-white transition-colors">${t('nav.features')}</a></li>
              <li><a href="./pricing.html" class="hover:text-white transition-colors">${t('nav.pricing')}</a></li>
              <li><a href="./blog.html" class="hover:text-white transition-colors">${t('nav.blog')}</a></li>
              <li><a href="./about.html" class="hover:text-white transition-colors">${t('nav.about')}</a></li>
              <li><a href="./contact.html" class="hover:text-white transition-colors">${t('nav.contact')}</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3 text-sm">${t('footer.contact')}</h4>
            <ul class="space-y-2 text-sm">
              <li><span class="text-slate-400">${t('footer.email')}</span></li>
              <li><span class="text-slate-400">${t('footer.phone')}</span></li>
            </ul>
            <p class="mt-4 text-sm text-slate-500">${t('footer.copyright').replace('{{year}}', year)}</p>
          </div>
        </div>
        <div class="border-t border-slate-800 mt-10 pt-6 text-center text-sm text-slate-500">
          &copy; ${year} Petty Cash.
        </div>
      </div>
    </footer>
  `;
  const placeholder = document.getElementById('footer');
  if (placeholder) placeholder.innerHTML = html;
}

function initFAQs() {
  document.querySelectorAll('[data-faq-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const icon = btn.querySelector('[data-faq-icon]');
      if (answer) answer.classList.toggle('hidden');
      if (icon) icon.classList.toggle('rotate-180');
    });
  });
}

function initCore() {
  setLang(getLang());
  renderNavbar();
  renderFooter();
  translatePage();
  initFAQs();
}

document.addEventListener('DOMContentLoaded', initCore);
window.PettyCash = { t, getLang, setLang, APP_URL };
