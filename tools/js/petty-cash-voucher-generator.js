(function () {
  'use strict';
  const { t, initTheme, toggleTheme, renderNav, saveToolState, loadToolState, clearToolState, formatMoney, todayStr, amountInWords, generateQR, exportPDF, exportPNG, handleLogoUpload, loadLogo, toast, debounce } = window.PCTools;

  const STORAGE_KEY = 'voucher_generator';

  const defaultState = {
    companyName: '', voucherNumber: '', date: todayStr(), employee: '', department: '', costCenter: '', project: '', vendor: '', expenseCategory: '', invoiceNumber: '',
    items: [{ id: 1, description: '', quantity: 1, unitCost: 0, vatPercent: 15, total: 0 }],
    preparedBy: '', checkedBy: '', approvedBy: '', receivedBy: '', logo: ''
  };

  let state = loadToolState(STORAGE_KEY) || (structuredClone ? structuredClone(defaultState) : JSON.parse(JSON.stringify(defaultState)));
  let itemCounter = state.items.length ? Math.max(...state.items.map(i => i.id)) + 1 : 2;

  function $(sel) { return document.querySelector(sel); }
  function $$$(sel) { return document.querySelectorAll(sel); }

  function init() {
    renderNav();
    initTheme();
    bindTheme();
    populateForm();
    renderItems();
    renderPreview();

    $('#add-item').addEventListener('click', () => addItem());
    $('#btn-save').addEventListener('click', () => { saveToolState(STORAGE_KEY, state); toast(t('common.saved')); });
    $('#btn-reset').addEventListener('click', resetForm);
    $('#btn-copy').addEventListener('click', copySummary);
    $('#btn-share').addEventListener('click', () => window.PCTools.sharePage());
    $('#btn-print').addEventListener('click', () => window.print());
    $('#btn-pdf').addEventListener('click', () => exportPDF($('#voucher-preview'), `Voucher-${state.voucherNumber || 'draft'}.pdf`));
    $('#btn-png').addEventListener('click', () => exportPNG($('#voucher-preview'), `Voucher-${state.voucherNumber || 'draft'}.png`));

    $('#voucher-form').addEventListener('input', debounce(() => { syncState(); renderPreview(); }, 100));
    handleLogoUpload($('#logo-input'), (base64) => { state.logo = base64; saveToolState(STORAGE_KEY, state); renderPreview(); }, 'voucher_logo');
    loadLogo('voucher_logo', (base64) => { state.logo = base64; renderPreview(); });

    window.addEventListener('pctool-lang-change', () => { renderNav(); renderItems(); translatePreviewLabels(); renderPreview(); });
  }

  function bindTheme() {
    const btn = document.getElementById('pctool-theme');
    if (btn) btn.addEventListener('click', toggleTheme);
  }

  function populateForm() {
    Object.entries(state).forEach(([k, v]) => {
      if (k === 'items') return;
      const el = $(`[name="${k}"]`);
      if (el) el.value = v ?? '';
    });
  }

  function addItem(data = null) {
    const item = data || { id: itemCounter++, description: '', quantity: 1, unitCost: 0, vatPercent: 15, total: 0 };
    if (!data) state.items.push(item);
    renderItems();
    renderPreview();
  }

  function deleteItem(id) {
    state.items = state.items.filter(i => i.id !== id);
    renderItems();
    renderPreview();
  }

  function renderItems() {
    const container = $('#items-container');
    container.innerHTML = '';
    state.items.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'grid grid-cols-12 gap-2 items-start bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl border border-slate-200 dark:border-slate-600 animate-fade-in';
      div.innerHTML = `
        <div class="col-span-12 sm:col-span-5"><input type="text" data-field="description" data-id="${item.id}" value="${esc(item.description)}" placeholder="${t('common.description')}" class="form-input"></div>
        <div class="col-span-4 sm:col-span-2"><input type="number" min="0" step="1" data-field="quantity" data-id="${item.id}" value="${item.quantity}" placeholder="${t('common.quantity')}" class="form-input"></div>
        <div class="col-span-4 sm:col-span-3"><input type="number" min="0" step="0.01" data-field="unitCost" data-id="${item.id}" value="${item.unitCost}" placeholder="${t('voucher.unitCost')}" class="form-input"></div>
        <div class="col-span-4 sm:col-span-2"><input type="number" min="0" step="0.01" data-field="vatPercent" data-id="${item.id}" value="${item.vatPercent}" placeholder="%" class="form-input"></div>
        <div class="col-span-12 text-end"><button type="button" data-del="${item.id}" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-slate-600 text-red-600 dark:text-red-300 hover:bg-red-100 text-xs font-medium" title="${t('common.delete')}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> ${t('common.delete')}</button></div>
      `;
      container.appendChild(div);
    });
    $$$('[data-del]').forEach(btn => btn.addEventListener('click', () => deleteItem(+btn.dataset.del)));
  }

  function syncState() {
    const form = $('#voucher-form');
    const fd = new FormData(form);
    fd.forEach((v, k) => { state[k] = v; });
    state.items = state.items.map(item => {
      const row = $(`[data-id="${item.id}"]`).closest('.grid');
      if (!row) return item;
      const get = (f) => { const el = row.querySelector(`[data-field="${f}"]`); return el ? el.value : ''; };
      const quantity = parseFloat(get('quantity')) || 0;
      const unitCost = parseFloat(get('unitCost')) || 0;
      const vatPercent = parseFloat(get('vatPercent')) || 0;
      const total = quantity * unitCost * (1 + vatPercent / 100);
      return { ...item, description: get('description'), quantity, unitCost, vatPercent, total };
    });
  }

  function calculations() {
    const subtotal = state.items.reduce((s, i) => s + (i.quantity * i.unitCost), 0);
    const vat = state.items.reduce((s, i) => s + (i.quantity * i.unitCost * (i.vatPercent / 100)), 0);
    const grand = subtotal + vat;
    return { subtotal, vat, grand };
  }

  async function renderPreview() {
    syncState();
    const c = calculations();

    const logo = $('#preview-logo');
    if (state.logo) { logo.src = state.logo; logo.classList.remove('hidden'); }
    else { logo.classList.add('hidden'); }

    $('#preview-company-name').textContent = state.companyName;
    $('#preview-voucher-number').textContent = state.voucherNumber;
    $('#preview-date').textContent = state.date;
    $('#preview-employee').textContent = state.employee;
    $('#preview-department').textContent = state.department;
    $('#preview-cost-center').textContent = state.costCenter;
    $('#preview-project').textContent = state.project;
    $('#preview-vendor').textContent = state.vendor;
    $('#preview-category').textContent = state.expenseCategory;
    $('#preview-invoice-number').textContent = state.invoiceNumber;

    const tbody = $('#preview-items-table tbody');
    tbody.innerHTML = '';
    state.items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${esc(item.description)}</td><td>${item.quantity}</td><td>${formatMoney(item.unitCost, 'SAR')}</td><td>${item.vatPercent}%</td><td>${formatMoney(item.total, 'SAR')}</td>`;
      tbody.appendChild(tr);
    });

    $('#preview-subtotal').textContent = formatMoney(c.subtotal, 'SAR');
    $('#preview-vat').textContent = formatMoney(c.vat, 'SAR');
    $('#preview-grand').textContent = formatMoney(c.grand, 'SAR');
    $('#preview-words').textContent = amountInWords(c.grand, window.PCTools.currentLang);

    $('#preview-prepared-by').textContent = state.preparedBy;
    $('#preview-checked-by').textContent = state.checkedBy;
    $('#preview-approved-by').textContent = state.approvedBy;
    $('#preview-received-by').textContent = state.receivedBy;

    translatePreviewLabels();
  }

  function translatePreviewLabels() {
    const ar = window.PCTools.currentLang === 'ar';
    $$$(`[data-i18n-en]`).forEach(el => {
      const text = ar ? el.dataset.i18nAr : el.dataset.i18nEn;
      if (text) el.textContent = text;
    });
  }

  function resetForm() {
    if (confirm(t('common.deleteConfirm'))) {
      state = structuredClone ? structuredClone(defaultState) : JSON.parse(JSON.stringify(defaultState));
      itemCounter = 2;
      clearToolState(STORAGE_KEY);
      clearToolState('voucher_logo');
      populateForm();
      renderItems();
      renderPreview();
      toast(t('common.reset'));
    }
  }

  function copySummary() {
    const c = calculations();
    const lines = [
      (window.PCTools.currentLang === 'ar' ? 'قسيمة: ' : 'Voucher: ') + state.voucherNumber,
      (window.PCTools.currentLang === 'ar' ? 'الإجمالي: ' : 'Grand Total: ') + formatMoney(c.grand, 'SAR')
    ];
    window.PCTools.copyText(lines.join('\n'));
  }

  function esc(s) { return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  document.addEventListener('DOMContentLoaded', init);
})();
