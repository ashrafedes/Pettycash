// Pricing page dynamic content
document.addEventListener("DOMContentLoaded", () => {
  const data = t("pricing");
  const title = document.querySelector("[data-i18n='pricing.title']");
  const subtitle = document.querySelector("[data-i18n='pricing.subtitle']");
  const grid = document.getElementById("pricing-grid");
  const note = document.getElementById("pricing-note");

  if (title) title.textContent = data.title;
  if (subtitle) subtitle.textContent = data.subtitle;

  if (grid) {
    grid.innerHTML = data.plans.map(plan => `
      <div class="relative rounded-2xl p-7 flex flex-col border transition-shadow hover:shadow-xl ${plan.highlight ? 'bg-blue-600 border-blue-500 text-white shadow-2xl ring-2 ring-blue-400' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}">
        ${plan.badge ? `<span class="absolute -top-3 ${getLang() === 'ar' ? 'end-1/2 translate-x-1/2' : 'start-1/2 -translate-x-1/2'} text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap ${plan.highlight ? 'bg-amber-400 text-amber-900' : 'bg-slate-800 text-white'}">${plan.badge}</span>` : ""}
        <h2 class="text-xl font-extrabold mb-1 ${plan.highlight ? 'text-white' : 'text-slate-900'}">${plan.name}</h2>
        <div class="flex items-end gap-1 mb-0.5"><span class="text-3xl font-extrabold">${plan.price}</span></div>
        <p class="text-xs mb-1 ${plan.highlight ? 'text-blue-200' : 'text-slate-400'}">${plan.period}</p>
        <p class="text-xs mb-5 font-medium ${plan.highlight ? 'text-blue-100' : 'text-slate-500'}">${getLang() === 'ar' ? 'حد أقصى' : 'Max'} ${plan.maxEmployees} ${getLang() === 'ar' ? 'موظف' : 'employees'}</p>
        <ul class="space-y-2.5 flex-1 mb-7">
          ${plan.features.map(f => `<li class="flex items-start gap-2.5 text-sm ${plan.highlight ? 'text-blue-100' : 'text-slate-600'}"><svg class="mt-0.5 shrink-0 ${plan.highlight ? 'text-green-300' : 'text-green-500'}" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>${f}</li>`).join("")}
        </ul>
        <a href="${APP_URL}/register" class="inline-flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl transition-colors text-sm ${plan.highlight ? 'bg-white text-blue-700 hover:bg-blue-50' : 'bg-blue-600 text-white hover:bg-blue-700'}">${plan.cta} <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
      </div>
    `).join("");
  }

  if (note) note.textContent = data.note;
});
