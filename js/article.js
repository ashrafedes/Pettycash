// Article detail page with caching and retry
const ARTICLE_BLOG_CACHE_KEY = "pettycash_blog_articles";

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

function findCachedArticleBySlug(slug) {
  try {
    const cached = localStorage.getItem(ARTICLE_BLOG_CACHE_KEY);
    if (!cached) return null;
    const articles = JSON.parse(cached);
    return articles.find(a => a.slug === slug || a.id === slug) || null;
  } catch (e) { return null; }
}

async function fetchArticleWithRetry(slug, retries = 2) {
  let lastError = null;
  for (let i = 0; i <= retries; i++) {
    try {
      const article = await window.PettyCashFirebase.fetchArticleBySlug(slug);
      return { success: true, article };
    } catch (err) {
      lastError = err;
      if (i < retries) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  return { success: false, error: lastError };
}

function renderArticle(article, lang) {
  const hero = document.getElementById("article-hero");
  const titleEl = document.getElementById("article-title");
  const metaEl = document.getElementById("article-meta");
  const imageEl = document.getElementById("article-image");
  const contentEl = document.getElementById("article-content");
  const notFoundEl = document.getElementById("article-not-found");

  if (!article) {
    notFoundEl.classList.remove("hidden");
    return;
  }

  const tr = getArticleLocale(article, lang);
  const title = tr.title || article.slug || "Article";
  const summary = tr.summary || "";
  const content = tr.content || summary || "";
  const imageUrl = article.image || article.imageUrl || "";

  document.title = `${title} - Petty Cash`;

  if (titleEl) titleEl.textContent = title;
  if (metaEl) {
    const date = window.PettyCashFirebase.formatDate(article.date, lang);
    const readTime = article.readTime ? `${article.readTime} min read` : "";
    metaEl.textContent = [date, readTime].filter(Boolean).join(" · ");
  }

  if (imageUrl && imageEl) {
    imageEl.innerHTML = `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}" class="w-full h-auto object-cover">`;
    imageEl.classList.remove("hidden");
  }

  if (contentEl) {
    contentEl.innerHTML = content ? content.replace(/\n/g, "<br>") : `<p class="text-slate-500">${summary}</p>`;
  }

  hero.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const notFoundEl = document.getElementById("article-not-found");

  if (!slug || !window.PettyCashFirebase) {
    notFoundEl.classList.remove("hidden");
    return;
  }

  const lang = getLang();
  const cached = findCachedArticleBySlug(slug);
  if (cached) renderArticle(cached, lang);

  const result = await fetchArticleWithRetry(slug);
  if (result.success && result.article) {
    renderArticle(result.article, lang);
  } else if (!cached) {
    notFoundEl.classList.remove("hidden");
  }
});
