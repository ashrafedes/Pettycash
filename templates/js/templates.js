// Templates shared JS — nav, email gate, file generation
const APP_URL = 'https://pattycashsystem.web.app';
const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSfBxEr1lkgOpsYY1mBLdXYw896sMWK6PQDhgqTbzy-yXspE-g/formResponse';
const GOOGLE_FORM_EMAIL_ENTRY = 'entry.1577520220';

const PCTemplates = {
  lang: 'en',

  init() {
    this.lang = new URLSearchParams(window.location.search).get('lang') || localStorage.getItem('pettycash-lang') || 'en';
    this.renderNav();
    this.renderFooter();
    this.applyLang();
  },

  // ===================== Nav =====================
  renderNav() {
    const nav = document.getElementById('tmpl-nav');
    if (!nav) return;
    nav.className = 'sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm';
    const current = window.location.pathname.split('/').pop();
    const isHub = current === 'index.html' || current === '';
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
                <span>Free Tools</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div class="absolute top-full start-0 mt-1 w-auto bg-white border border-slate-200 rounded-lg shadow-lg p-1 z-50 hidden group-hover:block">
                <a href="../tools/" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md whitespace-nowrap">Business Tools</a>
                <a href="../pdf-tools/" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md whitespace-nowrap">PDF Tools</a>
                <a href="./" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md whitespace-nowrap">Templates</a>
                <a href="../industries/" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md whitespace-nowrap">Industries</a>
                <a href="../compare/" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md whitespace-nowrap">Compare</a>
                <a href="../ai/" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md whitespace-nowrap">AI Center</a>
                <a href="../tools/ai-presentation-generator.html" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md whitespace-nowrap">AI Presentation Generator</a>
              </div>
            </div>
            <a href="../blog.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">Blog</a>
            <a href="../help.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">Help</a>
            <a href="../about.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">About</a>
            <a href="../contact.html" class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">Contact</a>
          </nav>
          <div class="flex items-center gap-2">
            <a href="${APP_URL}/login" class="hidden sm:inline-block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Login</a>
            <a href="${APP_URL}/register" class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Sign Up</a>
            <div class="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button data-tmpl-lang="en" class="tmpl-lang-btn px-3 py-1.5 text-xs font-semibold rounded-md ${this.lang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}">EN</button>
              <button data-tmpl-lang="ar" class="tmpl-lang-btn px-3 py-1.5 text-xs font-semibold rounded-md ${this.lang === 'ar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}">AR</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.querySelectorAll('.tmpl-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.lang = btn.dataset.tmplLang;
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
    const footer = document.getElementById('tmpl-footer');
    if (!footer) return;
    footer.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 py-8 grid sm:grid-cols-3 gap-6 text-sm text-slate-500">
        <div>
          <h4 class="font-semibold text-slate-700 mb-3">Templates</h4>
          <ul class="space-y-1">
            <li><a href="./petty-cash-excel-template.html" class="hover:text-blue-600">Petty Cash Excel Template</a></li>
            <li><a href="./expense-tracker-excel.html" class="hover:text-blue-600">Expense Tracker Excel</a></li>
            <li><a href="./cash-count-sheet-template.html" class="hover:text-blue-600">Cash Count Sheet</a></li>
            <li><a href="./expense-approval-form.html" class="hover:text-blue-600">Expense Approval Form</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-slate-700 mb-3">More Templates</h4>
          <ul class="space-y-1">
            <li><a href="./receipt-register.html" class="hover:text-blue-600">Receipt Register</a></li>
            <li><a href="./petty-cash-policy-pdf.html" class="hover:text-blue-600">Petty Cash Policy PDF</a></li>
            <li><a href="./internal-audit-checklist.html" class="hover:text-blue-600">Internal Audit Checklist</a></li>
            <li><a href="./finance-dashboard-excel.html" class="hover:text-blue-600">Finance Dashboard Excel</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-slate-700 mb-3">Company</h4>
          <ul class="space-y-1">
            <li><a href="../" class="hover:text-blue-600">Home</a></li>
            <li><a href="../features.html" class="hover:text-blue-600">Features</a></li>
            <li><a href="../pricing.html" class="hover:text-blue-600">Pricing</a></li>
            <li><a href="../blog.html" class="hover:text-blue-600">Blog</a></li>
            <li><a href="../help.html" class="hover:text-blue-600">Help</a></li>
            <li><a href="../contact.html" class="hover:text-blue-600">Contact</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        &copy; 2026 PettyCash.site — Free templates and tools.
      </div>
    `;
  },

  applyLang() {
    document.documentElement.lang = this.lang;
    document.documentElement.dir = this.lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n-en]').forEach(el => {
      el.textContent = this.lang === 'ar' ? el.dataset.i18nAr : el.dataset.i18nEn;
    });
  },

  // ===================== Email Gate =====================
  isEmailCaptured() {
    return localStorage.getItem('tmpl_email') !== null;
  },

  getEmail() {
    return localStorage.getItem('tmpl_email') || '';
  },

  async submitEmail(email, templateName) {
    try {
      const payload = new URLSearchParams();
      payload.append(GOOGLE_FORM_EMAIL_ENTRY, email);
      await fetch(GOOGLE_FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      });
    } catch (e) { /* no-cors always throws, ignore */ }
    localStorage.setItem('tmpl_email', email);
    return true;
  },

  initEmailGate(onUnlock) {
    const gate = document.getElementById('email-gate');
    const downloadArea = document.getElementById('download-area');
    if (!gate || !downloadArea) return;

    if (this.isEmailCaptured()) {
      gate.classList.add('hidden');
      downloadArea.classList.remove('hidden');
      const emailDisplay = document.getElementById('user-email');
      if (emailDisplay) emailDisplay.textContent = this.getEmail();
      if (onUnlock) onUnlock();
      return;
    }

    const form = document.getElementById('email-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      const btn = form.querySelector('button[type="submit"]');
      const btnText = btn?.querySelector('.btn-text');
      const spinner = btn?.querySelector('.spinner');
      if (btn) btn.disabled = true;
      if (btnText) btnText.textContent = '...';
      if (spinner) spinner.classList.remove('hidden');
      await this.submitEmail(email);
      gate.classList.add('hidden');
      downloadArea.classList.remove('hidden');
      const emailDisplay = document.getElementById('user-email');
      if (emailDisplay) emailDisplay.textContent = email;
      if (onUnlock) onUnlock();
    });
  },

  // ===================== File Generation =====================
  downloadCSV(filename, rows) {
    const csv = rows.map(row =>
      row.map(cell => {
        const s = String(cell ?? '');
        if (s.includes(',') || s.includes('"') || s.includes('\n')) return '"' + s.replace(/"/g, '""') + '"';
        return s;
      }).join(',')
    ).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  },

  async downloadPDF(filename, htmlContent, orientation = 'p') {
    return new Promise((resolve, reject) => {
      function doExport() {
        try {
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
          pdf.html(htmlContent, {
            callback: function () {
              pdf.save(filename);
              resolve();
            },
            x: 10,
            y: 10,
            html2canvas: { scale: 0.75 },
            margin: [10, 10, 10, 10]
          });
        } catch (err) { reject(err); }
      }
      if (typeof jspdf === 'undefined' || typeof jspdf.jsPDF === 'undefined') {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
        s.onload = doExport;
        s.onerror = () => reject(new Error('jsPDF failed to load'));
        document.body.appendChild(s);
      } else {
        doExport();
      }
    });
  },

  // ===================== Toast =====================
  toast(msg) {
    let el = document.getElementById('tmpl-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'tmpl-toast';
      el.className = 'fixed bottom-6 end-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium';
      el.style.transition = 'opacity 0.3s';
      el.style.opacity = '0';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    setTimeout(() => el.style.opacity = '0', 2500);
  }
};
