// Article detail page with caching and retry
const ARTICLE_BLOG_CACHE_KEY = "pettycash_blog_articles";

function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
  const keywords = tr.keywords || [];
  const imageUrl = article.image || article.imageUrl || "/images/article-placeholder.svg";
  const slug = article.slug || article.id;
  const canonicalUrl = `${window.location.origin}/${lang}/articles/${encodeURIComponent(slug)}`;
  const altLang = lang === 'ar' ? 'en' : 'ar';
  const altUrl = `${window.location.origin}/${altLang}/articles/${encodeURIComponent(slug)}`;
  const metaTitle = tr.metaTitle || title;
  const metaDescription = tr.metaDescription || summary;

  // Update SEO meta dynamically
  document.title = metaTitle ? `${metaTitle}` : `${title} - PettyCash`;
  setOrCreateMeta("description", metaDescription || summary);
  setOrCreateMeta("keywords", keywords.join(", "));
  setOrCreateLink("canonical", canonicalUrl);
  setOrCreateMeta("og:title", metaTitle || title, true);
  setOrCreateMeta("og:description", metaDescription || summary, true);
  setOrCreateMeta("og:url", canonicalUrl, true);
  setOrCreateMeta("og:type", "article", true);
  setOrCreateMeta("og:image", imageUrl, true);
  setOrCreateMeta("twitter:title", metaTitle || title, true);
  setOrCreateMeta("twitter:description", metaDescription || summary, true);
  setOrCreateMeta("twitter:image", imageUrl, true);
  setOrCreateMeta("twitter:card", "summary_large_image", true);
  setOrCreateMeta("article:tag", keywords.slice(0, 5).join(","), true);
  setOrCreateMeta("twitter:url", canonicalUrl, true);
  setOrCreateLink("alternate", altUrl, "xhtml:link", "hreflang", altLang);
  setOrCreateLink("alternate", canonicalUrl, "xhtml:link", "hreflang", lang);
  setOrCreateLink("alternate", `${window.location.origin}/en/articles/${encodeURIComponent(slug)}`, "xhtml:link", "hreflang", "x-default");
  setArticleSchema(article, tr, lang, canonicalUrl, imageUrl);

  if (titleEl) titleEl.textContent = title;

  // Update breadcrumb
  const breadcrumbEl = document.getElementById("article-breadcrumb");
  const breadcrumbTitle = document.getElementById("breadcrumb-title");
  if (breadcrumbEl) {
    const homeLink = breadcrumbEl.querySelector("a:first-child");
    const articlesLink = breadcrumbEl.querySelector("a:nth-child(2)");
    if (homeLink) { homeLink.href = `/${lang}/`; homeLink.textContent = lang === "ar" ? "الرئيسية" : "Home"; }
    if (articlesLink) { articlesLink.href = `/${lang}/blog.html`; articlesLink.textContent = lang === "ar" ? "المقالات" : "Articles"; }
    if (breadcrumbTitle) breadcrumbTitle.textContent = title;
    breadcrumbEl.classList.remove("hidden");
  }
  if (metaEl) {
    const date = window.PettyCashFirebase ? window.PettyCashFirebase.formatDate(article.date, lang) : article.date;
    const readTime = article.readTime ? `${article.readTime} min read` : "";
    metaEl.textContent = [date, readTime].filter(Boolean).join(" · ");
  }

  if (imageEl) {
    imageEl.innerHTML = `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}" class="w-full h-auto object-cover" loading="eager">`;
    imageEl.classList.remove("hidden");
  }

  if (contentEl) {
    contentEl.innerHTML = content ? content.replace(/\n/g, "<br>") : `<p class="text-slate-500">${summary}</p>`;
  }

  const tagsEl = document.getElementById("article-tags");
  if (tagsEl) {
    if (keywords.length) {
      const langForTags = lang === "ar" ? "ar" : "en";
      const tagsHtml = keywords.map(k => `<span class="inline-block text-sm bg-white/20 text-white px-3 py-1 rounded-full">#${escapeHtml(k)}</span>`).join("");
      tagsEl.innerHTML = `<div class="flex flex-wrap gap-2 justify-center">${tagsHtml}</div>`;
      tagsEl.classList.remove("hidden");
    } else {
      tagsEl.classList.add("hidden");
    }
  }

  hero.classList.remove("hidden");
}

function setOrCreateMeta(name, value, property) {
  const key = property ? `property="${name}"` : `name="${name}"`;
  let tag = document.querySelector(`meta[${key}]`);
  if (!tag) {
    tag = document.createElement("meta");
    if (property) tag.setAttribute("property", name);
    else tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
}

function setOrCreateLink(rel, href, attrName, attrValue, hreflang) {
  let selector = `link[rel="${rel}"]`;
  if (hreflang) selector += `[hreflang="${hreflang}"]`;
  let link = document.querySelector(selector);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    if (attrName && attrValue) link.setAttribute(attrName, attrValue);
    if (hreflang) link.setAttribute("hreflang", hreflang);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function setArticleSchema(article, tr, lang, url, imageUrl) {
  const title = tr.title || article.slug || "Article";
  const summary = tr.summary || "";
  const date = article.date || "";
  const keywords = Array.isArray(tr.keywords) ? tr.keywords : [];
  const publisher = { "@type": "Organization", "name": "PettyCash", "logo": `${window.location.origin}/images/favicon.png` };
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": summary,
    "image": imageUrl,
    "datePublished": date,
    "dateModified": date,
    "author": publisher,
    "publisher": publisher,
    "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    "inLanguage": lang,
    "keywords": keywords.join(", ")
  };
  let script = document.getElementById("article-schema");
  if (!script) {
    script = document.createElement("script");
    script.id = "article-schema";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema, null, 2);
}

function getSlugFromPath() {
  const path = window.location.pathname;
  const m = path.match(/\/(en|ar)\/articles\/([^/]+)$/);
  if (m) return { slug: decodeURIComponent(m[2]), lang: m[1] };
  return null;
}

function getSlugFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  if (!slug) return null;
  const path = window.location.pathname;
  const langMatch = path.match(/\/(en|ar)\//);
  const lang = langMatch ? langMatch[1] : 'en';
  return { slug, lang };
}

document.addEventListener("DOMContentLoaded", async () => {
  const notFoundEl = document.getElementById("article-not-found");

  let slugInfo = getSlugFromPath();

  // Backward compat: old URL format article.html?slug=X → redirect to new clean URL
  if (!slugInfo) {
    slugInfo = getSlugFromQuery();
    if (slugInfo) {
      const newUrl = `${window.location.origin}/${slugInfo.lang}/articles/${encodeURIComponent(slugInfo.slug)}`;
      window.location.replace(newUrl);
      return;
    }
  }

  if (!slugInfo || !window.PettyCashFirebase) {
    notFoundEl.classList.remove("hidden");
    return;
  }

  const { slug, lang: urlLang } = slugInfo;
  const lang = urlLang || getLang();
  const cached = findCachedArticleBySlug(slug);
  if (cached) renderArticle(cached, lang);

  const result = await fetchArticleWithRetry(slug);
  if (result.success && result.article && result.article.published !== false) {
    renderArticle(result.article, lang);
  } else if (!cached || cached.published === false) {
    notFoundEl.classList.remove("hidden");
  }
});
