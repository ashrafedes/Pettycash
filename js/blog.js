// Blog page - fast static-first rendering with pagination and tag filters
const BLOG_CACHE_KEY = "pettycash_blog_articles";
const BLOG_CACHE_TIME_KEY = "pettycash_blog_articles_time";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const PAGE_SIZE = 12;
const INITIAL_DISPLAY_LIMIT = 1000;

let allArticles = [];
let displayLimit = INITIAL_DISPLAY_LIMIT;
let activeTag = null;
let searchQuery = '';

function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function debounce(fn, ms = 250) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

function getArticleLocale(article, lang) {
  if (article.translations && typeof article.translations === "object") {
    const t = article.translations[lang] || article.translations["en"] || {};
    return {
      title: t.title || article.title || "",
      summary: t.summary || article.summary || "",
      content: t.content || article.content || "",
      metaTitle: t.metaTitle || "",
      metaDescription: t.metaDescription || "",
      keywords: Array.isArray(t.keywords) ? t.keywords : []
    };
  }
  return {
    title: article.title || "",
    summary: article.summary || "",
    content: article.content || "",
    metaTitle: "",
    metaDescription: "",
    keywords: []
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

function formatDate(article, lang) {
  if (window.PettyCashFirebase && window.PettyCashFirebase.formatDate) {
    return window.PettyCashFirebase.formatDate(article.date, lang);
  }
  return article.date || "";
}

function prepareArticles(articles) {
  const sorted = window.PettyCashFirebase && window.PettyCashFirebase.sortArticlesByDate
    ? window.PettyCashFirebase.sortArticlesByDate(articles)
    : [...articles].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  return sorted.filter(a => a.published !== false);
}

function renderTagPills(keywords) {
  return keywords.slice(0, 5).map(k => `<span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">#${escapeHtml(k)}</span>`).join("");
}

function renderArticles(articles, lang, data) {
  const grid = document.getElementById("blog-grid");
  if (!grid) return;
  if (!articles.length) {
    grid.innerHTML = `<p class="text-slate-500 col-span-full text-center">${data.notFound}</p>`;
    return;
  }
  grid.innerHTML = articles.map(a => {
    const tr = getArticleLocale(a, lang);
    const imageUrl = a.image || a.imageUrl || "./images/article-placeholder.svg";
    const targetUrl = a.url || `./article.html?slug=${encodeURIComponent(a.slug || a.id)}`;
    const tagsHtml = renderTagPills(tr.keywords);
    return `
    <a href="${targetUrl}" class="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
      <div class="h-48 overflow-hidden bg-slate-100"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(tr.title || '')}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width="400" height="192"></div>
      <div class="p-6">
        <h3 class="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">${escapeHtml(tr.title || '')}</h3>
        <p class="text-sm text-slate-500 line-clamp-3 mb-4">${escapeHtml(tr.summary || '')}</p>
        ${tagsHtml ? `<div class="flex flex-wrap gap-2 mb-4">${tagsHtml}</div>` : ""}
        <div class="flex items-center justify-between text-xs text-slate-400">
          <span>${formatDate(a, lang)}</span>
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

function renderTagCloud(all, lang, data) {
  const container = document.getElementById("tag-cloud");
  if (!container) return;
  const tagCounts = {};
  all.forEach(a => {
    const tr = getArticleLocale(a, lang);
    (tr.keywords || []).forEach(k => {
      const key = String(k).trim().toLowerCase();
      if (key) tagCounts[key] = (tagCounts[key] || 0) + 1;
    });
  });
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 30);
  if (!sortedTags.length) { container.innerHTML = ""; return; }
  let html = `<span class="text-sm font-semibold text-slate-700 me-2">${data.tags}:</span>`;
  html += `<button class="tag-filter text-xs px-3 py-1 rounded-full ${!activeTag ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}" data-tag="">#${data.allTags}</button>`;
  html += sortedTags.map(([tag, count]) => {
    const isActive = activeTag === tag;
    return `<button class="tag-filter text-xs px-3 py-1 rounded-full ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}" data-tag="${escapeHtml(tag)}">#${escapeHtml(tag)} (${count})</button>`;
  }).join("");
  container.innerHTML = `<div class="flex flex-wrap items-center gap-2">${html}</div>`;
  container.querySelectorAll(".tag-filter").forEach(btn => {
    btn.addEventListener("click", (e) => {
      activeTag = e.target.dataset.tag || null;
      displayLimit = PAGE_SIZE;
      updateView(lang, data);
    });
  });
}

function renderControls(visibleCount, totalFiltered, lang, data) {
  const container = document.getElementById("blog-controls");
  if (!container) return;
  if (visibleCount >= totalFiltered && !activeTag) { container.innerHTML = ""; return; }
  let html = "";
  if (visibleCount < totalFiltered) {
    html += `<button id="load-more" class="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">${data.loadMore}</button>`;
    html += `<button id="show-all" class="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">${data.showAll}</button>`;
  }
  if (activeTag) {
    html += `<button id="clear-filter" class="px-5 py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors">${data.allTags}</button>`;
  }
  container.innerHTML = `<div class="flex flex-wrap justify-center gap-3 mt-8">${html}</div>`;
  const loadMore = document.getElementById("load-more");
  if (loadMore) loadMore.addEventListener("click", () => { displayLimit += PAGE_SIZE; updateView(lang, data); });
  const showAll = document.getElementById("show-all");
  if (showAll) showAll.addEventListener("click", () => { displayLimit = totalFiltered; updateView(lang, data); });
  const clear = document.getElementById("clear-filter");
  if (clear) clear.addEventListener("click", () => { activeTag = null; displayLimit = INITIAL_DISPLAY_LIMIT; updateView(lang, data); });
}

function matchesSearch(article, lang, query) {
  if (!query) return true;
  const tr = getArticleLocale(article, lang);
  const haystack = [
    tr.title || '',
    tr.summary || '',
    tr.content || '',
    (tr.keywords || []).join(' '),
    article.slug || '',
    article.author || ''
  ].join(' ').toLowerCase();
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return terms.every(term => haystack.includes(term));
}

function updateView(lang, data) {
  let filtered = allArticles;
  if (searchQuery) {
    filtered = filtered.filter(a => matchesSearch(a, lang, searchQuery));
  }
  if (activeTag) {
    filtered = filtered.filter(a => {
      const tr = getArticleLocale(a, lang);
      return (tr.keywords || []).some(k => String(k).trim().toLowerCase() === activeTag);
    });
  }
  const visible = filtered.slice(0, displayLimit);
  if (searchQuery && filtered.length === 0) {
    const grid = document.getElementById('blog-grid');
    if (grid) grid.innerHTML = `<p class="text-slate-500 col-span-full text-center">${data.searchNoResults}</p>`;
    const controls = document.getElementById('blog-controls');
    if (controls) controls.innerHTML = '';
    const tagCloud = document.getElementById('tag-cloud');
    if (tagCloud) tagCloud.innerHTML = '';
    return;
  }
  renderArticles(visible, lang, data);
  renderTagCloud(allArticles, lang, data);
  renderControls(visible.length, filtered.length, lang, data);
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

async function fetchArticlesFromFirestore() {
  try {
    if (!window.PettyCashFirebase || !window.PettyCashFirebase.fetchLatestArticles) return [];
    // Fetch enough articles so the full blog index is available.
    return await window.PettyCashFirebase.fetchLatestArticles(1000);
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

function mergeWithStatic(staticArticles, dbArticles) {
  if (!window.PettyCashFirebase || !window.PettyCashFirebase.mergeArticles) return dbArticles.length ? dbArticles : staticArticles;
  return window.PettyCashFirebase.mergeArticles(staticArticles, dbArticles);
}

function initSearch(lang, data) {
  const searchInput = document.getElementById('blog-search');
  const clearBtn = document.getElementById('blog-search-clear');
  if (!searchInput) return;
  searchInput.placeholder = data.searchPlaceholder || 'Search articles...';
  const debouncedSearch = debounce((value) => {
    searchQuery = value.trim();
    displayLimit = INITIAL_DISPLAY_LIMIT;
    if (clearBtn) clearBtn.classList.toggle('hidden', !searchQuery);
    updateView(lang, data);
  }, 250);
  searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearBtn.classList.add('hidden');
      displayLimit = INITIAL_DISPLAY_LIMIT;
      updateView(lang, data);
    });
  }
}

async function initBlog() {
  const data = t("articles");
  const title = document.querySelector("[data-i18n='articles.title']");
  if (title) title.textContent = data.title;

  const grid = document.getElementById("blog-grid");
  if (!grid || !window.PettyCashFirebase) {
    if (grid) grid.innerHTML = `<p class="text-slate-500 col-span-full text-center">${data.notFound}</p>`;
    return;
  }

  const lang = getLang();
  initSearch(lang, data);
  const cached = getCachedArticles();
  const staticArticles = getStaticArticlesSync();

  if (staticArticles.length) {
    allArticles = prepareArticles(mergeWithStatic(staticArticles, []));
  } else if (cached && cached.length) {
    allArticles = prepareArticles(cached);
  } else {
    grid.innerHTML = renderSkeletonArticles(PAGE_SIZE);
  }

  updateView(lang, data);
  showLoadingNote(lang, data);

  const dbArticles = await fetchArticlesFromFirestore();
  const merged = mergeWithStatic(staticArticles, dbArticles);
  allArticles = prepareArticles(merged);
  setCachedArticles(merged);
  updateView(lang, data);
}

document.addEventListener("DOMContentLoaded", initBlog);
