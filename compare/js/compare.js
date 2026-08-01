// Compare shared JS — nav, footer, language toggle
const APP_URL = 'https://pattycashsystem.web.app';

const PCCompare = {
  lang: 'en',

  init() {
    this.lang = new URLSearchParams(window.location.search).get('lang') || localStorage.getItem('pettycash-lang') || 'en';
    this.renderNav();
    this.renderFooter();
    this.applyLang();
  },

  renderNav() {
    const nav = document.getElementById('cmp-nav');
    if (!nav) return;
    nav.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <a href="../" class="flex items-center gap-2 font-bold text-xl text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
            <span>Petty Cash</span>
          </a>
          <nav class="hidden md:flex items-center gap-1">
            <a href="../" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">Home</a>
            <a href="../features.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">Features</a>
            <a href="../pricing.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">Pricing</a>
            <div class="relative group">
              <button class="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                <span>Resources</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div class="absolute top-full start-0 mt-1 w-auto bg-white border border-slate-200 rounded-lg shadow-lg p-1 z-50 hidden group-hover:block">
                <a href="../tools/" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md whitespace-nowrap">Business Tools</a>
                <a href="../templates/" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md whitespace-nowrap">Templates</a>
                <a href="../industries/" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md whitespace-nowrap">Industries</a>
                <a href="./" class="block px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-md whitespace-nowrap">Compare</a>
              </div>
            </div>
            <a href="../blog.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">Blog</a>
          </nav>
          <div class="flex items-center gap-2">
            <a href="${APP_URL}/login" class="hidden sm:inline-block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Login</a>
            <a href="${APP_URL}/register" class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Sign Up</a>
            <div class="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button data-cmp-lang="en" class="cmp-lang-btn px-3 py-1.5 text-xs font-semibold rounded-md ${this.lang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}">EN</button>
              <button data-cmp-lang="ar" class="cmp-lang-btn px-3 py-1.5 text-xs font-semibold rounded-md ${this.lang === 'ar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}">AR</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.querySelectorAll('.cmp-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.lang = btn.dataset.cmpLang;
        localStorage.setItem('pettycash-lang', this.lang);
        document.documentElement.lang = this.lang;
        document.documentElement.dir = this.lang === 'ar' ? 'rtl' : 'ltr';
        this.applyLang();
        this.renderNav();
        this.renderFooter();
      });
    });
  },

  renderFooter() {
    const footer = document.getElementById('cmp-footer');
    if (!footer) return;
    footer.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-8 grid sm:grid-cols-3 gap-6 text-sm text-slate-500">
        <div>
          <h4 class="font-semibold text-slate-700 mb-3">Comparisons</h4>
          <ul class="space-y-1">
            <li><a href="./petty-cash-vs-excel.html" class="hover:text-blue-600">vs. Excel</a></li>
            <li><a href="./petty-cash-vs-zoho-expense.html" class="hover:text-blue-600">vs. Zoho Expense</a></li>
            <li><a href="./petty-cash-vs-expensify.html" class="hover:text-blue-600">vs. Expensify</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-slate-700 mb-3">More Comparisons</h4>
          <ul class="space-y-1">
            <li><a href="./petty-cash-vs-sap-concur.html" class="hover:text-blue-600">vs. SAP Concur</a></li>
            <li><a href="./petty-cash-vs-odoo.html" class="hover:text-blue-600">vs. Odoo</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-slate-700 mb-3">Company</h4>
          <ul class="space-y-1">
            <li><a href="../" class="hover:text-blue-600">Home</a></li>
            <li><a href="../features.html" class="hover:text-blue-600">Features</a></li>
            <li><a href="../pricing.html" class="hover:text-blue-600">Pricing</a></li>
            <li><a href="../blog.html" class="hover:text-blue-600">Blog</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-slate-200 py-4 text-center text-xs text-slate-400">&copy; 2026 PettyCash.site</div>
    `;
  },

  applyLang() {
    document.documentElement.lang = this.lang;
    document.documentElement.dir = this.lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n-en]').forEach(el => {
      el.textContent = this.lang === 'ar' ? el.dataset.i18nAr : el.dataset.i18nEn;
    });
  }
};
