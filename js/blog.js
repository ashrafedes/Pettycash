// Blog page - fast static-first rendering with background Firestore sync
const BLOG_CACHE_KEY = "pettycash_blog_articles";
const BLOG_CACHE_TIME_KEY = "pettycash_blog_articles_time";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const PAGE_SIZE = 12;

function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function getArticleLocale(article, lang) {
  if (article.translations && typeof article.translations === "object") {
    return article.translations[lang] || article.translations["en"] || {};
  }
  return {
    title: article.title || article[`title_${lang}`] || "",
    summary: article.summary || article[`summary_${lang}`] || "",
    content: article.content || article[`content_${lang}`] || ""
  };
}

function getCachedArticles() {
  try {
    const cached = localStorage.getItem(BLOG_CACHE_KEY);
    const cachedTime = localStorage.getItem(BLOG_CACHE_TIME_KEY);
    if (!cached || !cachedTime) return null;
    const age = Date.now() - parseInt(cachedTime, 10);
    if (age > CACHE_TTL_MS) {
      localStorage.removeItem(BLOG_CACHE_KEY);
      localStorage.removeItem(BLOG_CACHE_TIME_KEY);
      return null;
    }
    return JSON.parse(cached);
  } catch (e) {
    return null;
  }
}

function setCachedArticles(articles) {
  try {
    localStorage.setItem(BLOG_CACHE_KEY, JSON.stringify(articles));
    localStorage.setItem(BLOG_CACHE_TIME_KEY, String(Date.now()));
  } catch (e) {}
}

function renderArticles(articles, lang, data) {
  const grid = document.getElementById("blog-grid");
  if (!grid) return;
  grid.innerHTML = articles.map(a => {
    const tr = getArticleLocale(a, lang);
    const imageUrl = a.image || a.imageUrl || "./images/article-placeholder.svg";
    const targetUrl = a.url || `./article.html?slug=${encodeURIComponent(a.slug || a.id)}`;
    return `
    <a href="${targetUrl}" class="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
      <div class="h-48 overflow-hidden bg-slate-100"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(tr.title || '')}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width="400" height="192"></div>
      <div class="p-6">
        <h3 class="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">${escapeHtml(tr.title || '')}</h3>
        <p class="text-sm text-slate-500 line-clamp-3 mb-4">${escapeHtml(tr.summary || '')}</p>
        <div class="flex items-center justify-between text-xs text-slate-400">
          <span>${window.PettyCashFirebase.formatDate(a.date, lang)}</span>
          ${a.readTime ? `<span>${a.readTime} ${data.readTime}</span>` : ""}
        </div>
      </div>
    </a>
  `}).join("");
}

function renderSkeletonArticles(count) {
  const cards = Array.from({ length: count }, () => `
    <div class="block bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
      <div class="h-48 bg-slate-200"></div>
      <div class="p-6 space-y-3">
        <div class="h-5 bg-slate-200 rounded w-3/4"></div>
        <div class="h-4 bg-slate-200 rounded w-full"></div>
        <div class="h-4 bg-slate-200 rounded w-5/6"></div>
        <div class="flex justify-between pt-2">
          <div class="h-3 bg-slate-200 rounded w-20"></div>
          <div class="h-3 bg-slate-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  `).join("");
  return `<div class="contents">${cards}</div>`;
}

function showLoadingNote(lang, data, offline = false) {
  const grid = document.getElementById("blog-grid");
  if (!grid) return;
  const note = offline
    ? (lang === "ar" ? "تعرض المقالات المخزنة." : "Showing cached articles.")
    : (lang === "ar" ? "جاري تحديث المقالات..." : "Checking for more articles...");
  grid.insertAdjacentHTML("afterbegin", `<p class="col-span-full text-center text-xs text-slate-400 mb-4 loading-note">${note}</p>`);
  setTimeout(() => {
    grid.querySelectorAll(".loading-note").forEach(el => el.remove());
  }, 3000);
}

async function fetchArticlesFromFirestore(limitCount) {
  try {
    if (!window.PettyCashFirebase) return [];
    return await window.PettyCashFirebase.fetchLatestArticles(limitCount);
  } catch (err) {
    console.warn("Firestore fetch failed:", err);
    return [];
  }
}

function getStaticArticlesSync() {
  if (typeof window !== "undefined" && window.PettyCashArticlesData) {
    return window.PettyCashArticlesData;
  }
  return [];
}

function prepareArticles(articles, limitCount) {
  const sorted = window.PettyCashFirebase ? window.PettyCashFirebase.sortArticlesByDate(articles) : [...articles].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  const visible = sorted.filter(a => a.published !== false);
  return visible.slice(0, limitCount);
}

function mergeWithStatic(staticArticles, dbArticles) {
  if (!window.PettyCashFirebase || !window.PettyCashFirebase.mergeArticles) return dbArticles.length ? dbArticles : staticArticles;
  return window.PettyCashFirebase.mergeArticles(staticArticles, dbArticles);
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = t("articles");
  const title = document.querySelector("[data-i18n='articles.title']");
  if (title) title.textContent = data.title;

  const grid = document.getElementById("blog-grid");
  if (!grid || !window.PettyCashFirebase) {
    if (grid) grid.innerHTML = `<p class="text-slate-500 col-span-full text-center">${data.notFound}</p>`;
    return;
  }

  const lang = getLang();
  const cached = getCachedArticles();

  // 1. Render static articles immediately (fastest path)
  const staticArticles = getStaticArticlesSync();
  if (staticArticles.length) {
    renderArticles(prepareArticles(staticArticles, PAGE_SIZE), lang, data);
    showLoadingNote(lang, data);
  } else if (cached && cached.length) {
    renderArticles(prepareArticles(cached, PAGE_SIZE), lang, data);
    showLoadingNote(lang, data, true);
  } else {
    grid.innerHTML = renderSkeletonArticles(PAGE_SIZE);
  }

  // 2. Fetch Firestore in background and re-render if it returns fresh data
  const dbArticles = await fetchArticlesFromFirestore(PAGE_SIZE);
  if (dbArticles.length) {
    const merged = mergeWithStatic(staticArticles, dbArticles);
    const visible = prepareArticles(merged, PAGE_SIZE);
    renderArticles(visible, lang, data);
    setCachedArticles(merged);
  } else if (cached && cached.length && !staticArticles.length) {
    renderArticles(prepareArticles(cached, PAGE_SIZE), lang, data);
    showLoadingNote(lang, data, true);
  } else if (!staticArticles.length && !cached) {
    grid.innerHTML = `
      <p class="text-slate-500 col-span-full text-center">${data.notFound}</p>
      <div class="col-span-full text-center mt-4">
        <button id="retry-blog" class="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">${lang === "ar" ? "إعادة المحاولة" : "Retry"}</button>
      </div>
    `;
    document.getElementById("retry-blog")?.addEventListener("click", () => window.location.reload());
  }
});
