// About page dynamic content
document.addEventListener("DOMContentLoaded", () => {
  const data = t("about");
  const title = document.querySelector("[data-i18n='about.title']");
  const subtitle = document.querySelector("[data-i18n='about.subtitle']");
  const story = document.querySelector("[data-i18n='about.story']");
  const mission = document.querySelector("[data-i18n='about.mission']");
  const valuesGrid = document.getElementById("about-values");

  if (title) title.textContent = data.title;
  if (subtitle) subtitle.textContent = data.subtitle;
  if (story) story.textContent = data.story;
  if (mission) mission.textContent = data.mission;

  if (valuesGrid) {
    valuesGrid.innerHTML = data.values.map(v => `
      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h3 class="font-bold text-slate-900 mb-2">${v.title}</h3>
        <p class="text-sm text-slate-500 leading-relaxed">${v.desc}</p>
      </div>
    `).join("");
  }

  const cta = t("cta");
  const ctaTitle = document.querySelector("[data-i18n='cta.title']");
  const ctaSubtitle = document.querySelector("[data-i18n='cta.subtitle']");
  const ctaBtn = document.getElementById("about-cta-btn");
  if (ctaTitle) ctaTitle.textContent = cta.title;
  if (ctaSubtitle) ctaSubtitle.textContent = cta.subtitle;
  if (ctaBtn) {
    ctaBtn.textContent = cta.button;
    ctaBtn.href = `${APP_URL}/register`;
  }
});
