// Article detail page
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

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  const hero = document.getElementById("article-hero");
  const titleEl = document.getElementById("article-title");
  const metaEl = document.getElementById("article-meta");
  const imageEl = document.getElementById("article-image");
  const contentEl = document.getElementById("article-content");
  const notFoundEl = document.getElementById("article-not-found");

  if (!slug || !window.PettyCashFirebase) {
    notFoundEl.classList.remove("hidden");
    return;
  }

  const article = await window.PettyCashFirebase.fetchArticleBySlug(slug);

  if (!article) {
    notFoundEl.classList.remove("hidden");
    return;
  }

  const lang = getLang();
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
});
