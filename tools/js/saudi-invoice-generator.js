(function () {
  'use strict';
  const { t, setLang, currentLang, initTheme, toggleTheme, renderNav, saveToolState, loadToolState, clearToolState, formatMoney, todayStr, amountInWords, zatcaTlvBase64, generateQR, exportPDF, exportPNG, validateForm, handleLogoUpload, loadLogo, toast, debounce } = window.PCTools;

  const STORAGE_KEY = 'saudi_invoice';

  const defaultState = {
    companyName: '', companyVat: '', companyCr: '', companyPhone: '', companyEmail: '', companyAddress: '', companyWebsite: '', bankName: '', iban: '',
    customerName: '', customerVat: '', customerPhone: '', customerEmail: '', customerAddress: '',
    invoiceNumber: '', invoiceTitleEn: '', invoiceTitleAr: '', issueDate: todayStr(), issueTime: new Date().toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit', hour12:false}), dueDate: '', currency: 'SAR', paymentTerms: '', poNumber: '', reference: '',
    items: [{ id: 1, description: '', quantity: 1, unit: 'PCS', unitPrice: 0, discount: 0, vatPercent: 15, total: 0 }],
    discount: 0, vatPercent: 15, paidAmount: 0,
    notes: '', terms: '', signatureName: '', logo: ''
  };

  const saved = loadToolState(STORAGE_KEY);
  let state = structuredClone
    ? structuredClone({ ...defaultState, ...saved, items: saved?.items || defaultState.items })
    : JSON.parse(JSON.stringify({ ...defaultState, ...saved, items: saved?.items || defaultState.items }));
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
    $('#btn-pdf').addEventListener('click', () => exportPDF($('#invoice-preview'), `Invoice-${state.invoiceNumber || 'draft'}.pdf`));
    $('#btn-png').addEventListener('click', () => exportPNG($('#invoice-preview'), `Invoice-${state.invoiceNumber || 'draft'}.png`));

    handleLogoUpload($('#logo-input'), (base64) => { state.logo = base64; saveToolState(STORAGE_KEY, state); renderPreview(); }, 'saudi_invoice_logo');
    loadLogo('saudi_invoice_logo', (base64) => { state.logo = base64; renderPreview(); });

    document.getElementById('invoice-form').addEventListener('input', debounce(() => { syncState(); renderPreview(); }, 100));
    window.addEventListener('pctool-lang-change', () => { renderNav(); renderItems(); translatePreviewLabels(); renderPreview(); });
  }

  function bindTheme() {
    const btn = document.getElementById('pctool-theme');
    if (btn) btn.addEventListener('click', toggleTheme);
  }

  function populateForm() {
    const set = (name, val) => { const el = $(`[name="${name}"]`); if (el) el.value = val ?? ''; };
    Object.entries(state).forEach(([k, v]) => { if (k !== 'items') set(k, v); });
  }

  function addItem(data = null) {
    syncState();
    const item = data || { id: itemCounter++, description: '', quantity: 1, unit: 'PCS', unitPrice: 0, discount: 0, vatPercent: state.vatPercent || 15, total: 0 };
    state.items.push(item);
    renderItems();
    renderPreview();
  }

  function duplicateItem(id) {
    const src = state.items.find(i => i.id === id);
    if (src) addItem({ ...src, id: itemCounter++ });
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
      div.className = 'item-row bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl border border-slate-200 dark:border-slate-600 animate-fade-in space-y-2';
      div.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-slate-400">#${idx + 1}</span>
          <input type="text" data-field="description" data-id="${item.id}" value="${esc(item.description)}" placeholder="${t('common.description')}" class="form-input flex-1 h-10 text-base py-2">
          <button type="button" data-dup="${item.id}" class="p-2 rounded-lg bg-blue-50 dark:bg-slate-600 text-blue-600 dark:text-blue-300 hover:bg-blue-100 shrink-0" title="${t('common.duplicate')}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
          <button type="button" data-del="${item.id}" class="p-2 rounded-lg bg-red-50 dark:bg-slate-600 text-red-600 dark:text-red-300 hover:bg-red-100 shrink-0" title="${t('common.delete')}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
        </div>
        <div class="flex flex-nowrap gap-3 overflow-x-auto pb-2">
          <div class="min-w-[140px] flex-1"><label class="block text-sm text-slate-500 mb-1 whitespace-nowrap">${t('common.quantity')}</label><input type="number" min="0" step="1" data-field="quantity" data-id="${item.id}" value="${item.quantity}" class="form-input h-10 text-base py-2 w-full"></div>
          <div class="min-w-[140px] flex-1"><label class="block text-sm text-slate-500 mb-1 whitespace-nowrap">${t('common.unit')}</label><input type="text" data-field="unit" data-id="${item.id}" value="${esc(item.unit)}" class="form-input h-10 text-base py-2 w-full"></div>
          <div class="min-w-[140px] flex-1"><label class="block text-sm text-slate-500 mb-1 whitespace-nowrap">${t('common.unitPrice')}</label><input type="number" min="0" step="0.01" data-field="unitPrice" data-id="${item.id}" value="${item.unitPrice}" class="form-input h-10 text-base py-2 w-full"></div>
          <div class="min-w-[140px] flex-1"><label class="block text-sm text-slate-500 mb-1 whitespace-nowrap">${t('common.discount')} %</label><input type="number" min="0" step="0.01" data-field="discount" data-id="${item.id}" value="${item.discount}" class="form-input h-10 text-base py-2 w-full"></div>
          <div class="min-w-[140px] flex-1"><label class="block text-sm text-slate-500 mb-1 whitespace-nowrap">${t('common.tax')} %</label><input type="number" min="0" step="0.01" data-field="vatPercent" data-id="${item.id}" value="${item.vatPercent}" class="form-input h-10 text-base py-2 w-full"></div>
        </div>
      `;
      container.appendChild(div);
    });

    $$$('[data-dup]').forEach(btn => btn.addEventListener('click', () => duplicateItem(+btn.dataset.dup)));
    $$$('[data-del]').forEach(btn => btn.addEventListener('click', () => deleteItem(+btn.dataset.del)));
  }

  function syncState() {
    const form = $('#invoice-form');
    const fd = new FormData(form);
    fd.forEach((v, k) => { state[k] = v; });
    state.discount = parseFloat(state.discount) || 0;
    state.vatPercent = parseFloat(state.vatPercent) || 0;
    state.paidAmount = parseFloat(state.paidAmount) || 0;

    state.items = state.items.map(item => {
      const row = $(`[data-id="${item.id}"]`).closest('.item-row');
      if (!row) return item;
      const get = (field) => {
        const el = row.querySelector(`[data-field="${field}"]`);
        return el ? el.value : '';
      };
      const quantity = parseFloat(get('quantity')) || 0;
      const unitPrice = parseFloat(get('unitPrice')) || 0;
      const discount = parseFloat(get('discount')) || 0;
      const vatPercent = parseFloat(get('vatPercent')) || 0;
      const base = quantity * unitPrice * (1 - Math.min(discount / 100, 1));
      const vat = base * (vatPercent / 100);
      return {
        ...item,
        description: get('description'),
        quantity,
        unit: get('unit'),
        unitPrice,
        discount,
        vatPercent,
        total: base + vat
      };
    });
  }

  function calculations() {
    const subtotal = state.items.reduce((s, i) => s + (i.quantity * i.unitPrice * (1 - Math.min(i.discount / 100, 1))), 0);
    const totalVat = state.items.reduce((s, i) => s + (i.quantity * i.unitPrice * (1 - Math.min(i.discount / 100, 1)) * (i.vatPercent / 100)), 0);
    const discountTotal = subtotal * (state.discount / 100);
    const taxable = subtotal - discountTotal;
    const vatOnInvoice = taxable * (state.vatPercent / 100);
    const grand = taxable + vatOnInvoice;
    const remaining = Math.max(0, grand - state.paidAmount);
    return { subtotal, totalVat, discountTotal, taxable, vatOnInvoice, grand, remaining };
  }

  async function renderPreview() {
    syncState();
    const c = calculations();

    $('#calc-subtotal').textContent = formatMoney(c.subtotal, state.currency);
    $('#calc-discount').textContent = formatMoney(c.discountTotal, state.currency);
    $('#calc-vat').textContent = formatMoney(c.vatOnInvoice, state.currency);
    $('#calc-grand').textContent = formatMoney(c.grand, state.currency);
    $('#calc-paid').textContent = formatMoney(state.paidAmount, state.currency);
    $('#calc-remaining').textContent = formatMoney(c.remaining, state.currency);

    const logo = $('#preview-logo');
    if (state.logo) { logo.src = state.logo; logo.classList.remove('hidden'); }
    else { logo.classList.add('hidden'); }

    $('#preview-company-name').textContent = state.companyName;
    $('#preview-company-vat').textContent = state.companyVat;
    $('#preview-company-address').textContent = [state.companyAddress, state.companyPhone, state.companyEmail, state.companyWebsite].filter(Boolean).join(' · ');

    const defaultTitle = currentLang === 'ar' ? 'فاتورة ضريبية مبسطة' : 'Simplified Tax Invoice';
    $('#preview-title').textContent = (currentLang === 'ar' ? state.invoiceTitleAr : state.invoiceTitleEn) || defaultTitle;

    $('#preview-invoice-number').textContent = state.invoiceNumber;
    $('#preview-issue-date').textContent = state.issueDate;
    $('#preview-due-date').textContent = state.dueDate;

    $('#preview-customer-name').textContent = state.customerName;
    const vatLabel = currentLang === 'ar' ? 'الرقم الضريبي:' : 'VAT:';
    $('#preview-customer-vat').textContent = state.customerVat ? `${vatLabel} ${state.customerVat}` : '';
    $('#preview-customer-address').textContent = [state.customerAddress, state.customerPhone, state.customerEmail].filter(Boolean).join(' · ');

    const tbody = $('#preview-items-table tbody');
    tbody.innerHTML = '';
    state.items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${esc(item.description)}</td><td>${item.quantity}</td><td>${esc(item.unit)}</td><td>${formatMoney(item.unitPrice, state.currency)}</td><td>${item.discount}%</td><td>${item.vatPercent}%</td><td>${formatMoney(item.total, state.currency)}</td>`;
      tbody.appendChild(tr);
    });

    $('#preview-subtotal').textContent = formatMoney(c.subtotal, state.currency);
    $('#preview-discount').textContent = formatMoney(c.discountTotal, state.currency);
    $('#preview-vat').textContent = formatMoney(c.vatOnInvoice, state.currency);
    $('#preview-grand').textContent = formatMoney(c.grand, state.currency);
    $('#preview-paid').textContent = formatMoney(state.paidAmount, state.currency);
    $('#preview-remaining').textContent = formatMoney(c.remaining, state.currency);
    $('#preview-words').textContent = amountInWords(c.grand, currentLang);

    $('#preview-notes').textContent = state.notes;
    $('#preview-terms').textContent = state.terms;
    $('#preview-signature').textContent = state.signatureName;

    translatePreviewLabels();

    let qrPayload = '';
    try {
      const dateStr = state.issueDate || new Date().toISOString().split('T')[0];
      const timeStr = state.issueTime || new Date().toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit', hour12:false});
      const invoiceDate = new Date(`${dateStr}T${timeStr}`);
      qrPayload = zatcaTlvBase64({
        sellerName: state.companyName,
        vatNumber: state.companyVat,
        invoiceTimestamp: isNaN(invoiceDate.getTime()) ? new Date().toISOString() : invoiceDate.toISOString(),
        totalAmount: c.grand,
        vatAmount: c.vatOnInvoice
      });
    } catch (err) {
      console.error('TLV payload failed:', err);
      const dateTime = new Date().toISOString();
      qrPayload = `اسم المورد: ${state.companyName}\nالرقم الضريبي للمورد: ${state.companyVat}\nتاريخ ووقت الإصدار: ${dateTime}\nإجمالي الفاتورة شاملاً الضريبة: ${c.grand.toFixed(2)}\nإجمالي قيمة الضريبة: ${c.vatOnInvoice.toFixed(2)}`;
    }

    try {
      const qrImg = await generateQR(qrPayload, 120);
      $('#preview-qr').src = qrImg;
    } catch (err) {
      console.error('QR image generation failed:', err);
      $('#preview-qr').src = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=' + encodeURIComponent(qrPayload);
    }
    $('#preview-qr').style.display = 'inline';
  }

  function translatePreviewLabels() {
    const ar = currentLang === 'ar';
    $$$('[data-i18n-en]').forEach(el => {
      const text = ar ? el.dataset.i18nAr : el.dataset.i18nEn;
      if (!text) return;
      if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        el.textContent = text;
      } else if (el.childNodes.length && el.childNodes[0].nodeType === 3) {
        el.childNodes[0].textContent = text + ' ';
      } else {
        el.textContent = text;
      }
    });
  }

  function resetForm() {
    if (confirm(t('common.deleteConfirm'))) {
      state = structuredClone ? structuredClone(defaultState) : JSON.parse(JSON.stringify(defaultState));
      itemCounter = 2;
      clearToolState(STORAGE_KEY);
      clearToolState('saudi_invoice_logo');
      populateForm();
      renderItems();
      renderPreview();
      toast(t('common.reset'));
    }
  }

  function copySummary() {
    const c = calculations();
    const lines = [
      `${t('invoice.title')}: ${state.invoiceNumber || ''}`,
      `${t('invoice.companyName')}: ${state.companyName}`,
      `${t('invoice.customerName')}: ${state.customerName}`,
      `${t('common.grandTotal')}: ${formatMoney(c.grand, state.currency)}`,
      `${t('common.remaining')}: ${formatMoney(c.remaining, state.currency)}`
    ];
    window.PCTools.copyText(lines.join('\n'));
  }

  function esc(s) {
    return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  document.addEventListener('DOMContentLoaded', init);
})();
