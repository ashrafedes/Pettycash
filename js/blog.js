// Blog page - fetch articles from Firebase with caching and retry
const BLOG_CACHE_KEY = "pettycash_blog_articles";
const BLOG_CACHE_TIME_KEY = "pettycash_blog_articles_time";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

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
    const imageUrl = a.image || a.imageUrl || "";
    const targetUrl = a.url || `./article.html?slug=${encodeURIComponent(a.slug || a.id)}`;
    return `
    <a href="${targetUrl}" class="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
      ${imageUrl ? `<div class="h-48 overflow-hidden"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(tr.title || '')}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"></div>` : ""}
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

async function fetchArticlesWithRetry(limitCount, retries = 2) {
  let lastError = null;
  for (let i = 0; i <= retries; i++) {
    try {
      const articles = await window.PettyCashFirebase.fetchLatestArticles(limitCount);
      return { success: true, articles };
    } catch (err) {
      lastError = err;
      if (i < retries) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      }
    }
  }
  return { success: false, error: lastError };
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
  const cachedVisible = (cached || []).filter(a => a.published !== false);

  if (cachedVisible.length) {
    renderArticles(cachedVisible, lang, data);
  } else {
    grid.innerHTML = `<p class="text-slate-500 col-span-full text-center">${data.loading}</p>`;
  }

  const result = await fetchArticlesWithRetry(50);
  const allArticles = result.success ? result.articles : cached || [];
  const visibleArticles = allArticles.filter(a => a.published !== false);

  if (result.success && visibleArticles.length) {
    setCachedArticles(result.articles);
    renderArticles(visibleArticles, lang, data);
    return;
  }

  if (cachedVisible.length) {
    renderArticles(cachedVisible, lang, data);
    grid.insertAdjacentHTML("afterbegin", `<p class="col-span-full text-center text-xs text-slate-400 mb-4">${lang === "ar" ? "تعرض المقالات المخزنة." : "Showing cached articles."}</p>`);
    return;
  }

  grid.innerHTML = `
    <p class="text-slate-500 col-span-full text-center">${data.notFound}</p>
    <div class="col-span-full text-center mt-4">
      <button id="retry-blog" class="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">${lang === "ar" ? "إعادة المحاولة" : "Retry"}</button>
    </div>
  `;
  document.getElementById("retry-blog")?.addEventListener("click", () => window.location.reload());
});
