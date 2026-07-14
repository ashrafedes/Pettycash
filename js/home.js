// Home page dynamic content
function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderHero() {
  const hero = t("hero");
  const container = document.getElementById("hero-content");
  if (!container) return;
  container.innerHTML = `
    <span class="inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6">${hero.badge}</span>
    <h1 class="text-3xl sm:text-5xl font-extrabold leading-tight mb-6">${hero.title}</h1>
    <p class="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">${hero.subtitle}</p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <a href="${APP_URL}/register" class="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-base shadow-lg">
        ${hero.cta}
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </a>
      <a href="${APP_URL}/login" class="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-base">
        ${hero.login}
      </a>
    </div>
    <p class="mt-8 text-sm text-blue-200">${hero.trustedBy}</p>
    <div id="visitor-counter" class="mt-6 flex justify-center min-h-[40px]"></div>
  `;
}

function renderProblems() {
  const section = document.getElementById("problem-section");
  if (!section) return;
  const data = t("problem");
  section.querySelector("[data-i18n='problem.title']").textContent = data.title;
  section.querySelector("[data-i18n='problem.subtitle']").textContent = data.subtitle;
  const list = section.querySelector("#problem-list");
  list.innerHTML = data.items.map(item => `
    <div class="flex items-start gap-3 bg-white border border-red-100 rounded-xl p-4">
      <svg class="text-red-400 shrink-0 mt-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
      <span class="text-slate-700 text-sm">${item}</span>
    </div>
  `).join("");
}

function renderSolutions() {
  const section = document.getElementById("solution-section");
  if (!section) return;
  const data = t("solution");
  section.querySelector("[data-i18n='solution.title']").textContent = data.title;
  section.querySelector("[data-i18n='solution.subtitle']").textContent = data.subtitle;
  const list = section.querySelector("#solution-list");
  list.innerHTML = data.points.map(point => `
    <div class="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
      <svg class="text-blue-500 shrink-0 mt-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      <span class="text-slate-700 text-sm">${point}</span>
    </div>
  `).join("");
}

function renderFeatures() {
  const section = document.getElementById("features-section");
  if (!section) return;
  const data = t("features");
  section.querySelector("[data-i18n='features.title']").textContent = data.title;
  section.querySelector("[data-i18n='features.subtitle']").textContent = data.subtitle;
  const icons = {
    LayoutDashboard: `<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>`,
    UserPlus: `<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>`,
    Receipt: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>`,
    CheckCircle: `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>`,
    FileSpreadsheet: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>`,
    Globe: `<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>`
  };
  section.querySelector("#features-grid").innerHTML = data.list.map(f => `
    <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
      <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4"><svg class="text-blue-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icons[f.icon] || ""}</svg></div>
      <h3 class="font-bold text-slate-900 mb-1">${f.title}</h3>
      <p class="text-sm text-slate-500 leading-relaxed">${f.desc}</p>
    </div>
  `).join("");
}

function renderHowItWorks() {
  const section = document.getElementById("how-it-works-section");
  if (!section) return;
  const data = t("howItWorks");
  section.querySelector("[data-i18n='howItWorks.title']").textContent = data.title;
  section.querySelector("[data-i18n='howItWorks.subtitle']").textContent = data.subtitle;
  section.querySelector("#how-it-works-grid").innerHTML = data.steps.map((s, i) => `
    <div class="flex flex-col items-center text-center">
      <div class="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-extrabold mb-4 shadow-lg">${i + 1}</div>
      <h3 class="font-bold text-slate-900 mb-2">${s.title}</h3>
      <p class="text-sm text-slate-500">${s.desc}</p>
    </div>
  `).join("");
}

function renderBenefits() {
  const section = document.getElementById("benefits-section");
  if (!section) return;
  const data = t("benefits");
  section.querySelector("[data-i18n='benefits.title']").textContent = data.title;
  const renderCard = (key, color) => {
    const card = data[key];
    const el = section.querySelector(`#benefits-${key}`);
    el.innerHTML = `
      <h3 class="font-bold text-xl mb-4 ${color}">${card.title}</h3>
      <ul class="space-y-3">
        ${card.items.map(item => `
          <li class="flex items-center gap-3 text-slate-200 text-sm"><svg class="text-green-400 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>${item}</li>
        `).join("")}
      </ul>
    `;
  };
  renderCard("manager", "text-blue-300");
  renderCard("employee", "text-blue-300");
}

function renderFAQ() {
  const section = document.getElementById("faq-section");
  if (!section) return;
  const data = t("faq");
  section.querySelector("[data-i18n='faq.title']").textContent = data.title;
  section.querySelector("#faq-list").innerHTML = data.items.map((item, i) => `
    <div class="border border-slate-200 rounded-xl overflow-hidden">
      <button data-faq-toggle class="w-full flex items-center justify-between px-5 py-4 text-start font-semibold text-slate-800 hover:bg-slate-50 transition-colors">
        <span>${item.q}</span>
        <svg data-faq-icon width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div class="hidden px-5 pb-4 text-sm text-slate-600 leading-relaxed whitespace-pre-line">${item.a}</div>
    </div>
  `).join("");
  initFAQs();
}

function renderCTA() {
  const section = document.getElementById("cta-section");
  if (!section) return;
  const data = t("cta");
  section.querySelector("[data-i18n='cta.title']").textContent = data.title;
  section.querySelector("[data-i18n='cta.subtitle']").textContent = data.subtitle;
  const btn = section.querySelector("[data-i18n='cta.button']");
  if (btn) {
    btn.textContent = data.button;
    btn.href = `${APP_URL}/register`;
  }
}

async function renderVisitorCounter() {
  const container = document.getElementById("visitor-counter");
  if (!container || !window.PettyCashFirebase) return;
  const count = await window.PettyCashFirebase.trackVisitor();
  if (count === null) {
    container.style.display = "none";
    return;
  }
  const lang = getLang();
  const label = count === 1 ? (lang === "ar" ? "زائر" : "visitor") : (lang === "ar" ? "زائر" : "visitors");
  container.innerHTML = `
    <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
      <span class="text-white/90 font-medium">${count.toLocaleString(lang)} ${label}</span>
    </div>
  `;
}

const HOME_BLOG_CACHE_KEY = "pettycash_blog_articles";
const HOME_BLOG_CACHE_TIME_KEY = "pettycash_blog_articles_time";
const HOME_CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

function getHomeCachedArticles() {
  try {
    const cached = localStorage.getItem(HOME_BLOG_CACHE_KEY);
    const cachedTime = localStorage.getItem(HOME_BLOG_CACHE_TIME_KEY);
    if (!cached || !cachedTime) return null;
    const age = Date.now() - parseInt(cachedTime, 10);
    if (age > HOME_CACHE_TTL_MS) return null;
    return JSON.parse(cached);
  } catch (e) { return null; }
}

function setHomeCachedArticles(articles) {
  try {
    localStorage.setItem(HOME_BLOG_CACHE_KEY, JSON.stringify(articles));
    localStorage.setItem(HOME_BLOG_CACHE_TIME_KEY, String(Date.now()));
  } catch (e) {}
}

async function fetchHomeArticlesWithRetry(limitCount, retries = 2) {
  let lastError = null;
  for (let i = 0; i <= retries; i++) {
    try {
      const articles = await window.PettyCashFirebase.fetchLatestArticles(limitCount);
      return { success: true, articles };
    } catch (err) {
      lastError = err;
      if (i < retries) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  return { success: false, error: lastError };
}

async function renderLatestArticles() {
  const section = document.getElementById("latest-articles");
  const grid = document.getElementById("articles-grid");
  if (!section || !grid || !window.PettyCashFirebase) return;
  section.classList.remove("hidden");
  const data = t("articles");
  const lang = getLang();

  const cached = getHomeCachedArticles();
  if (cached && cached.length) {
    renderHomeArticles(cached.slice(0, 3), lang, data);
  } else {
    grid.innerHTML = `<p class="text-slate-500 col-span-full text-center">${data.loading}</p>`;
  }

  const result = await fetchHomeArticlesWithRetry(3);
  if (result.success && result.articles.length) {
    setHomeCachedArticles(result.articles);
    renderHomeArticles(result.articles.slice(0, 3), lang, data);
    return;
  }

  if (cached && cached.length) {
    renderHomeArticles(cached.slice(0, 3), lang, data);
    return;
  }

  grid.innerHTML = `<p class="text-slate-500 col-span-full text-center">${data.notFound}</p>`;
}

function renderHomeArticles(articles, lang, data) {
  const grid = document.getElementById("articles-grid");
  if (!grid) return;
  grid.innerHTML = articles.map(a => {
    const tr = a.translations?.[lang] || a.translations?.en || {};
    const imageUrl = a.image || a.imageUrl || "";
    const targetUrl = a.url || `./article.html?slug=${encodeURIComponent(a.slug || a.id)}`;
    return `
    <a href="${targetUrl}" class="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
      ${imageUrl ? `<div class="h-40 overflow-hidden"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(tr.title || '')}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"></div>` : ""}
      <div class="p-5">
        <h3 class="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">${escapeHtml(tr.title || '')}</h3>
        <p class="text-sm text-slate-500 line-clamp-2 mb-4">${escapeHtml(tr.summary || '')}</p>
        <div class="flex items-center justify-between text-xs text-slate-400">
          <span>${window.PettyCashFirebase.formatDate(a.date, lang)}</span>
          ${a.readTime ? `<span>${a.readTime} ${data.readTime}</span>` : ""}
        </div>
      </div>
    </a>
  `}).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderHero();
  renderProblems();
  renderSolutions();
  renderFeatures();
  renderHowItWorks();
  renderBenefits();
  renderFAQ();
  renderCTA();
  renderVisitorCounter();
  renderLatestArticles();
});
