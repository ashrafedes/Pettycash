// PDF Tools Shared Library
(function (global) {
  'use strict';

  // ===================== Language =====================
  function getLang() {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('lang');
    if (p && ['en', 'ar'].includes(p)) return p;
    const s = localStorage.getItem('pettycash-lang');
    if (s && ['en', 'ar'].includes(s)) return s;
    return 'en';
  }

  function setLang(lang) {
    if (!['en', 'ar'].includes(lang)) return;
    localStorage.setItem('pettycash-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    renderNav();
    translatePage();
    window.dispatchEvent(new CustomEvent('pdftool-lang-change', { detail: { lang } }));
  }

  let currentLang = getLang();

  function t(key, fallback) {
    const data = global.PDF_TRANSLATIONS?.[currentLang];
    if (!data) return fallback || key;
    const parts = key.split('.');
    let val = data;
    for (const p of parts) {
      if (val && typeof val === 'object' && p in val) val = val[p];
      else return fallback || key;
    }
    return val !== undefined && val !== null ? val : fallback || key;
  }

  function translatePage() {
    document.querySelectorAll('[data-pt]').forEach(el => {
      const key = el.dataset.pt;
      const value = t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.placeholder) el.placeholder = value;
      } else {
        el.textContent = value;
      }
    });
    document.querySelectorAll('[data-pt-ph]').forEach(el => {
      el.placeholder = t(el.dataset.ptPh);
    });
  }

  // ===================== Theme =====================
  function initTheme() {
    const saved = localStorage.getItem('pdftool_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  }

  function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('pdftool_theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    renderNav();
  }

  // ===================== Navbar =====================
  function renderNav() {
    const nav = document.getElementById('pdftool-nav');
    if (!nav) return;
    const base = nav.dataset.base || '../';
    const current = window.location.pathname.split('/').pop();
    currentLang = getLang();

    nav.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <a href="${base}pdf-tools/" class="flex items-center gap-2 font-bold text-lg text-blue-600 dark:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>
            <span data-pt="nav.appName">PDF Tools</span>
          </a>
          <div class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="${base}pdf-tools/" class="hover:text-blue-600 ${current === 'index.html' || current === '' ? 'text-blue-600' : ''}" data-pt="nav.allTools">All Tools</a>
            <a href="${base}tools/" class="hover:text-blue-600" data-pt="nav.businessTools">Business Tools</a>
            <a href="${base}" class="hover:text-blue-600" data-pt="nav.home">Home</a>
          </div>
          <div class="flex items-center gap-3">
            <button id="pdftool-theme" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" aria-label="Toggle theme">
              ${document.documentElement.classList.contains('dark') ? '☀️' : '🌙'}
            </button>
            <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1" role="group" aria-label="Language switch">
              <button data-pdftool-lang="en" class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${currentLang === 'en' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'}">EN</button>
              <button data-pdftool-lang="ar" class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${currentLang === 'ar' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'}">AR</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('pdftool-theme')?.addEventListener('click', toggleTheme);
    document.querySelectorAll('[data-pdftool-lang]').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.dataset.pdftoolLang));
    });
    translatePage();
  }

  // ===================== Drag & Drop =====================
  function initDropZone(zoneEl, inputEl, onFiles, opts = {}) {
    const accept = opts.accept || '.pdf';
    const multiple = opts.multiple !== false;

    if (inputEl) {
      inputEl.accept = accept;
      inputEl.multiple = multiple;
    }

    zoneEl.addEventListener('click', () => inputEl?.click());

    zoneEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      zoneEl.classList.add('dragover');
    });
    zoneEl.addEventListener('dragleave', () => zoneEl.classList.remove('dragover'));
    zoneEl.addEventListener('drop', (e) => {
      e.preventDefault();
      zoneEl.classList.remove('dragover');
      const files = Array.from(e.dataTransfer.files).filter(f => {
        if (accept === '.pdf') return f.type === 'application/pdf' || f.name.endsWith('.pdf');
        return true;
      });
      if (files.length) onFiles(multiple ? files : [files[0]]);
    });

    if (inputEl) {
      inputEl.addEventListener('change', () => {
        if (inputEl.files.length) onFiles(Array.from(inputEl.files));
        inputEl.value = '';
      });
    }
  }

  // ===================== Progress Bar =====================
  function showProgress(container, percent) {
    let bar = container.querySelector('.progress-track');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'progress-track mt-4';
      bar.innerHTML = '<div class="progress-fill" style="width:0%"></div>';
      container.appendChild(bar);
    }
    bar.querySelector('.progress-fill').style.width = percent + '%';
    if (percent >= 100) setTimeout(() => bar.remove(), 1000);
  }

  // ===================== File Helpers =====================
  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ===================== Toast =====================
  function toast(message, duration = 2500) {
    let el = document.getElementById('pdftool-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'pdftool-toast';
      el.className = 'fixed bottom-6 end-6 z-50 translate-y-20 opacity-0 transition-all duration-300 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-xl shadow-lg text-sm font-medium';
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.remove('translate-y-20', 'opacity-0');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.add('translate-y-20', 'opacity-0'), duration);
  }

  // ===================== Library Loader =====================
  const libCache = {};
  function loadLib(src) {
    if (libCache[src]) return libCache[src];
    libCache[src] = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return libCache[src];
  }

  async function ensurePDFLib() {
    if (global.PDFLib) return global.PDFLib;
    await loadLib('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js');
    return global.PDFLib;
  }

  async function ensureFileSaver() {
    if (global.saveAs) return global.saveAs;
    await loadLib('https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js');
    return global.saveAs;
  }

  async function ensurePDFJS() {
    if (global.pdfjsLib) return global.pdfjsLib;
    await loadLib('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    global.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    return global.pdfjsLib;
  }

  async function ensureJSZip() {
    if (global.JSZip) return global.JSZip;
    await loadLib('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    return global.JSZip;
  }

  // ===================== PDF Preview =====================
  async function renderPDFPreview(container, fileOrBlob, opts = {}) {
    const maxPages = opts.maxPages || 20;
    const scale = opts.scale || 0.4;
    const onProgress = opts.onProgress;
    const selectable = opts.selectable || false;
    const selectionClass = opts.selectionClass ? opts.selectionClass.split(' ').filter(Boolean) : ['ring-4', 'ring-green-500', 'rounded-lg'];
    const badgeClass = opts.badgeClass || 'select-badge absolute top-1 end-1 bg-green-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg';
    const selectionLabel = opts.selectionLabel;
    const disabledPages = opts.disabledPages ? new Set(opts.disabledPages) : new Set();
    const disabledLabel = opts.disabledLabel || 'Assigned';
    const rotationMap = opts.rotationMap || null; // { pageIndex: angle }
    const onSelectionChange = opts.onSelectionChange;
    const pdfjs = await ensurePDFJS();
    const arrayBuffer = await (fileOrBlob.arrayBuffer ? fileOrBlob.arrayBuffer() : fileOrBlob);
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;
    const pagesToShow = Math.min(totalPages, maxPages);
    const selectedSet = new Set();

    container.innerHTML = '';
    container.classList.remove('hidden');

    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-wrap gap-3 justify-center p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl';
    container.appendChild(wrapper);

    for (let i = 1; i <= pagesToShow; i++) {
      const page = await pdf.getPage(i);
      const pageRotation = rotationMap ? (rotationMap[i - 1] || 0) : 0;
      const viewport = page.getViewport({ scale, rotation: pageRotation });
      const canvas = document.createElement('canvas');
      canvas.className = 'rounded-lg shadow-md bg-white pointer-events-none';
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;

      const item = document.createElement('div');
      item.className = 'relative';
      item.dataset.pageIndex = i - 1;
      item.dataset.pageNum = i;
      const isDisabled = disabledPages.has(i - 1);

      if (selectable && !isDisabled) {
        item.classList.add('cursor-pointer');
        item.addEventListener('click', () => {
          const idx = parseInt(item.dataset.pageIndex);
          const pageNum = parseInt(item.dataset.pageNum);
          if (selectedSet.has(idx)) {
            selectedSet.delete(idx);
            item.classList.remove(...selectionClass);
            const badge = item.querySelector('.select-badge');
            if (badge) badge.remove();
          } else {
            selectedSet.add(idx);
            item.classList.add(...selectionClass);
            const badge = document.createElement('div');
            badge.className = badgeClass;
            if (typeof selectionLabel === 'function') {
              badge.textContent = selectionLabel(idx, pageNum, Array.from(selectedSet).indexOf(idx) + 1);
            } else if (typeof selectionLabel === 'string') {
              badge.textContent = selectionLabel;
            } else {
              badge.textContent = Array.from(selectedSet).indexOf(idx) + 1;
            }
            item.appendChild(badge);
          }
          // Re-number badges when using order labels
          if (typeof selectionLabel !== 'string') {
            let order = 0;
            wrapper.querySelectorAll('[data-page-index]').forEach(el => {
              const b = el.querySelector('.select-badge');
              if (b && typeof selectionLabel !== 'function' && typeof selectionLabel !== 'string') {
                b.textContent = ++order;
              } else if (b && typeof selectionLabel !== 'string') {
                // keep existing label (string) or function-based label is set once
              }
            });
          }
          if (onSelectionChange) onSelectionChange(Array.from(selectedSet).sort((a, b) => a - b));
        });
      } else if (isDisabled) {
        item.classList.add('opacity-40');
        const lockBadge = document.createElement('div');
        lockBadge.className = 'absolute top-1 end-1 bg-slate-500 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-lg';
        lockBadge.textContent = disabledLabel;
        item.appendChild(lockBadge);
      }

      item.appendChild(canvas);

      const label = document.createElement('div');
      label.className = 'text-xs text-center text-slate-500 dark:text-slate-400 mt-1';
      label.textContent = 'Page ' + i;
      item.appendChild(label);

      if (pageRotation) {
        const rotBadge = document.createElement('div');
        rotBadge.className = 'absolute bottom-1 start-1 bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-lg';
        rotBadge.textContent = pageRotation + '°';
        item.appendChild(rotBadge);
      }

      wrapper.appendChild(item);
      if (onProgress) onProgress(i, pagesToShow);
    }

    if (totalPages > maxPages) {
      const note = document.createElement('p');
      note.className = 'text-xs text-center text-slate-400 mt-3';
      note.textContent = 'Showing ' + maxPages + ' of ' + totalPages + ' pages';
      wrapper.appendChild(note);
    }

    container._selectedPages = selectedSet;
    container._totalPages = totalPages;
    return totalPages;
  }

  // ===================== Public API =====================
  const PDFTools = {
    get currentLang() { return currentLang; },
    getLang, setLang, t, translatePage,
    initTheme, toggleTheme, renderNav,
    initDropZone, showProgress,
    formatBytes, downloadBlob, toast,
    ensurePDFLib, ensureFileSaver, ensurePDFJS, ensureJSZip,
    renderPDFPreview,
    loadLib,
    loadScript: loadLib
  };

  global.PDFTools = PDFTools;
})(this);
