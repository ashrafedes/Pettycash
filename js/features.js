// Features page dynamic content
document.addEventListener("DOMContentLoaded", () => {
  const data = t("features");
  const title = document.querySelector("[data-i18n='features.title']");
  const subtitle = document.querySelector("[data-i18n='features.subtitle']");
  const grid = document.getElementById("features-page-grid");
  const ctaTitle = document.querySelector("[data-i18n='cta.title']");
  const ctaSubtitle = document.querySelector("[data-i18n='cta.subtitle']");
  const ctaBtn = document.getElementById("features-cta-btn");

  if (title) title.textContent = data.title;
  if (subtitle) subtitle.textContent = data.subtitle;

  const icons = {
    LayoutDashboard: `<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>`,
    UserPlus: `<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>`,
    Receipt: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>`,
    CheckCircle: `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>`,
    FileSpreadsheet: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>`,
    Globe: `<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>`
  };

  if (grid) {
    grid.innerHTML = data.list.map(f => `
      <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
        <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4"><svg class="text-blue-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icons[f.icon] || ""}</svg></div>
        <h3 class="font-bold text-slate-900 mb-2">${f.title}</h3>
        <p class="text-sm text-slate-500 leading-relaxed">${f.desc}</p>
      </div>
    `).join("");
  }

  const cta = t("cta");
  if (ctaTitle) ctaTitle.textContent = cta.title;
  if (ctaSubtitle) ctaSubtitle.textContent = cta.subtitle;
  if (ctaBtn) {
    ctaBtn.textContent = cta.button;
    ctaBtn.href = `${APP_URL}/register`;
  }
});
