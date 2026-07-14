// Blog page - fetch articles from Firebase
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
  grid.innerHTML = articles.map(a => `
    <a href="${a.url || './blog.html'}" class="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
      ${a.imageUrl ? `<div class="h-48 overflow-hidden"><img src="${escapeHtml(a.imageUrl)}" alt="${escapeHtml(a.title || a[`title_${lang}`] || '')}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"></div>` : ""}
      <div class="p-6">
        <h3 class="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">${escapeHtml(a.title || a[`title_${lang}`] || '')}</h3>
        <p class="text-sm text-slate-500 line-clamp-3 mb-4">${escapeHtml(a.summary || a[`summary_${lang}`] || '')}</p>
        <div class="flex items-center justify-between text-xs text-slate-400">
          <span>${window.PettyCashFirebase.formatDate(a.date, lang)}</span>
          ${a.readTime ? `<span>${a.readTime} ${data.readTime}</span>` : ""}
        </div>
      </div>
    </a>
  `).join("");
});

function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
