// Blog page - fetch articles from Firebase
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
  const data = t("articles");
  const title = document.querySelector("[data-i18n='articles.title']");
  if (title) title.textContent = data.title;

  const grid = document.getElementById("blog-grid");
  if (!grid || !window.PettyCashFirebase) {
    if (grid) grid.innerHTML = `<p class="text-slate-500 col-span-full text-center">${data.notFound}</p>`;
    return;
  }

  grid.innerHTML = `<p class="text-slate-500 col-span-full text-center">${data.loading}</p>`;
  const articles = await window.PettyCashFirebase.fetchLatestArticles(50);

  if (!articles.length) {
    grid.innerHTML = `<p class="text-slate-500 col-span-full text-center">${data.notFound}</p>`;
    return;
  }

  const lang = getLang();
  grid.innerHTML = articles.map(a => {
    const tr = getArticleLocale(a, lang);
    const imageUrl = a.image || a.imageUrl || "";
    const targetUrl = a.url || `./article.html?slug=${encodeURIComponent(a.slug || a.id)}`;
    return `
    <a href="${targetUrl}" class="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
      ${imageUrl ? `<div class="h-48 overflow-hidden"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(tr.title || '')}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"></div>` : ""}
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
});
