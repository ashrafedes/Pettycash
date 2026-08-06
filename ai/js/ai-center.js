// AI Center shared JS — nav, footer, language toggle
const APP_URL = 'https://pattycashsystem.web.app';

const NAV_LABELS = {
  en: { home: 'Home', features: 'Features', pricing: 'Pricing', tools: 'Free Tools', blog: 'Blog', help: 'Help', about: 'About', contact: 'Contact', login: 'Login', signup: 'Sign Up', businessTools: 'Business Tools', pdfTools: 'PDF Tools', templates: 'Templates', industries: 'Industries', compare: 'Compare', aiCenter: 'AI Center', aiPresentation: 'AI Presentation Generator' },
  ar: { home: 'الرئيسية', features: 'الميزات', pricing: 'الأسعار', tools: 'الأدوات المجانية', blog: 'المدونة', help: 'المساعدة', about: 'من نحن', contact: 'تواصل', login: 'تسجيل الدخول', signup: 'إنشاء حساب', businessTools: 'أدوات الأعمال', pdfTools: 'أدوات PDF', templates: 'القوالب', industries: 'القطاعات', compare: 'المقارنة', aiCenter: 'مركز الذكاء', aiPresentation: 'مولد العروض التقديمية بالذكاء الاصطناعي' }
};

const FOOTER_LABELS = {
  en: { aiTools: 'AI Tools', industries: 'Industries', moreIndustries: 'More Industries', company: 'Company', tools: 'Tools', legal: 'Legal' },
  ar: { aiTools: 'أدوات الذكاء', industries: 'القطاعات', moreIndustries: 'قطاعات أخرى', company: 'الشركة', tools: 'الأدوات', legal: 'قانوني' }
};

const PCAI = {
  lang: 'en',

  init() {
    this.lang = new URLSearchParams(window.location.search).get('lang') || localStorage.getItem('pettycash-lang') || 'en';
    this.renderNav();
    this.renderFooter();
    this.applyLang();
  },

  L(key) { return (NAV_LABELS[this.lang] || NAV_LABELS.en)[key] || key; },
  FL(key) { return (FOOTER_LABELS[this.lang] || FOOTER_LABELS.en)[key] || key; },

  renderNav() {
    const nav = document.getElementById('ai-nav');
    if (!nav) return;
    nav.className = 'sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm';
    nav.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <a href="../" class="flex items-center gap-2 font-bold text-xl text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
            <span>Petty Cash</span>
          </a>
          <nav class="hidden md:flex items-center gap-1">
            <a href="../" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">${this.L('home')}</a>
            <a href="../features.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">${this.L('features')}</a>
            <a href="../pricing.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">${this.L('pricing')}</a>
            <div class="relative">
              <button id="tools-btn" class="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                <span>${this.L('tools')}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div id="tools-menu" class="hidden absolute top-full start-0 mt-1 w-auto bg-white border border-slate-200 rounded-lg shadow-lg p-1 z-50">
                <a href="../tools/" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md whitespace-nowrap">${this.L('businessTools')}</a>
                <a href="../pdf-tools/" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md whitespace-nowrap">${this.L('pdfTools')}</a>
                <a href="../templates/" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md whitespace-nowrap">${this.L('templates')}</a>
                <a href="./" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md whitespace-nowrap">${this.L('industries')}</a>
                <a href="../compare/" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md whitespace-nowrap">${this.L('compare')}</a>
                <a href="../ai/" class="block px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-md whitespace-nowrap">${this.L('aiCenter')}</a>
                <a href="../tools/ai-presentation-generator.html" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md whitespace-nowrap">${this.L('aiPresentation')}</a>
              </div>
            </div>
            <a href="../blog.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">${this.L('blog')}</a>
            <a href="../about.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">${this.L('about')}</a>
            <a href="../contact.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">${this.L('contact')}</a>
          </nav>
          <div class="flex items-center gap-2">
            <a href="${APP_URL}/login" class="hidden sm:inline-block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">${this.L('login')}</a>
            <a href="${APP_URL}/register" class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">${this.L('signup')}</a>
            <div class="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button data-ai-lang="en" class="ai-lang-btn px-3 py-1.5 text-xs font-semibold rounded-md ${this.lang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}">EN</button>
              <button data-ai-lang="ar" class="ai-lang-btn px-3 py-1.5 text-xs font-semibold rounded-md ${this.lang === 'ar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}">AR</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.querySelectorAll('.ai-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.lang = btn.dataset.indLang;
        localStorage.setItem('pettycash-lang', this.lang);
        document.documentElement.lang = this.lang;
        document.documentElement.dir = this.lang === 'ar' ? 'rtl' : 'ltr';
        this.applyLang();
        this.renderNav();
        this.renderFooter();
      });
    });
    const toolsBtn = document.getElementById('tools-btn');
    const toolsMenu = document.getElementById('tools-menu');
    if (toolsBtn && toolsMenu) {
      toolsBtn.addEventListener('click', e => { e.stopPropagation(); toolsMenu.classList.toggle('hidden'); });
      document.addEventListener('click', () => toolsMenu.classList.add('hidden'));
    }
  },

  renderFooter() {
    const footer = document.getElementById('ai-footer');
    if (!footer) return;
    const isAr = this.lang === 'ar';
    const aiLinks = [
      { href: './expense-analyzer.html', en: 'Expense Analyzer', ar: 'محلل المصروفات' },
      { href: './receipt-analyzer.html', en: 'Receipt Analyzer', ar: 'محلل الإيصالات' },
      { href: './policy-generator.html', en: 'Policy Generator', ar: 'مولد السياسات' }
    ];
    const companyLinks = [
      { href: '../', en: 'Home', ar: 'الرئيسية' },
      { href: '../features.html', en: 'Features', ar: 'الميزات' },
      { href: '../pricing.html', en: 'Pricing', ar: 'الأسعار' },
      { href: '../about.html', en: 'About', ar: 'من نحن' },
      { href: '../blog.html', en: 'Blog', ar: 'المدونة' },
      { href: '../contact.html', en: 'Contact', ar: 'تواصل' }
    ];
    const resourceLinks = [
      { href: '../tools/', en: 'Business Tools', ar: 'أدوات الأعمال' },
      { href: '../pdf-tools/', en: 'PDF Tools', ar: 'أدوات PDF' },
      { href: '../templates/', en: 'Templates', ar: 'القوالب' },
      { href: '../compare/', en: 'Compare', ar: 'المقارنة' },
      { href: '../ai/', en: 'AI Center', ar: 'مركز الذكاء' }
    ];
    const legalLinks = [
      { href: '../privacy.html', en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
      { href: '../security.html', en: 'Security', ar: 'الأمان' },
      { href: '../compliance.html', en: 'Compliance', ar: 'الامتثال' }
    ];
    const renderLinks = (links) => links.map(l => `<li><a href="${l.href}" class="hover:text-blue-600">${isAr ? l.ar : l.en}</a></li>`).join('');
    footer.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm text-slate-500">
        <div>
          <h3 class="font-semibold text-slate-700 mb-3">${this.FL('aiTools')}</h3>
          <ul class="space-y-1">${renderLinks(aiLinks)}</ul>
        </div>
        <div>
          <h3 class="font-semibold text-slate-700 mb-3">${this.FL('tools')}</h3>
          <ul class="space-y-1">${renderLinks(resourceLinks)}</ul>
        </div>
        <div>
          <h3 class="font-semibold text-slate-700 mb-3">${this.FL('company')}</h3>
          <ul class="space-y-1">${renderLinks(companyLinks)}</ul>
          <h3 class="font-semibold text-slate-700 mb-3 mt-6">${this.FL('tools')}</h3>
          <ul class="space-y-1">${renderLinks(resourceLinks)}</ul>
        </div>
        <div>
          <h3 class="font-semibold text-slate-700 mb-3">${this.FL('legal')}</h3>
          <ul class="space-y-1">${renderLinks(legalLinks)}</ul>
        </div>
      </div>
      <div class="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        &copy; 2026 PettyCash.site
      </div>
    `;
  },

  applyLang() {
    document.documentElement.lang = this.lang;
    document.documentElement.dir = this.lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n-en]').forEach(el => {
      if (this.lang === 'ar') {
        let val = el.dataset.i18nAr;
        if (val && /[\u2500-\u257F]/.test(val)) val = el.dataset.i18nEn;
        el.textContent = val || el.dataset.i18nEn;
      } else {
        el.textContent = el.dataset.i18nEn;
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => PCAI.init());
