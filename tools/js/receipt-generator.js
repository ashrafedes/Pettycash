(function () {
  'use strict';
  const { t, currentLang, initTheme, toggleTheme, renderNav, saveToolState, loadToolState, clearToolState, formatMoney, todayStr, amountInWords, generateQR, exportPDF, exportPNG, handleLogoUpload, loadLogo, toast, debounce } = window.PCTools;

  const STORAGE_KEY = 'receipt_generator';

  const defaultState = {
    companyName: '', companyVat: '', companyPhone: '', companyAddress: '',
    receiptNumber: '', receiptDate: todayStr(), receivedFrom: '', amount: 0,
    currency: 'SAR', paymentMethod: 'Cash', referenceNumber: '', description: '',
    receivedBy: '', approvedBy: '', notes: '', logo: ''
  };

  let state = loadToolState(STORAGE_KEY) || (structuredClone ? structuredClone(defaultState) : JSON.parse(JSON.stringify(defaultState)));

  function $(sel) { return document.querySelector(sel); }
  function $$$(sel) { return document.querySelectorAll(sel); }

  function init() {
    renderNav();
    initTheme();
    bindTheme();
    populateForm();
    renderPreview();

    $('#receipt-form').addEventListener('input', debounce(() => { syncState(); renderPreview(); }, 100));
    $('#btn-save').addEventListener('click', () => { saveToolState(STORAGE_KEY, state); toast(t('common.saved')); });
    $('#btn-reset').addEventListener('click', resetForm);
    $('#btn-copy').addEventListener('click', copySummary);
    $('#btn-share').addEventListener('click', () => window.PCTools.sharePage());
    $('#btn-print').addEventListener('click', () => window.print());
    $('#btn-pdf').addEventListener('click', () => exportPDF($('#receipt-preview'), `Receipt-${state.receiptNumber || 'draft'}.pdf`));
    $('#btn-png').addEventListener('click', () => exportPNG($('#receipt-preview'), `Receipt-${state.receiptNumber || 'draft'}.png`));

    handleLogoUpload($('#logo-input'), (base64) => { state.logo = base64; saveToolState(STORAGE_KEY, state); renderPreview(); }, 'receipt_logo');
    loadLogo('receipt_logo', (base64) => { state.logo = base64; renderPreview(); });

    window.addEventListener('pctool-lang-change', () => { renderNav(); translatePreviewLabels(); renderPreview(); });
  }

  function bindTheme() {
    const btn = document.getElementById('pctool-theme');
    if (btn) btn.addEventListener('click', toggleTheme);
  }

  function populateForm() {
    Object.entries(state).forEach(([k, v]) => {
      const el = $(`[name="${k}"]`);
      if (!el) return;
      if (el.type === 'radio') {
        const radio = $(`[name="${k}"][value="${v}"]`);
        if (radio) radio.checked = true;
      } else { el.value = v ?? ''; }
    });
  }

  function syncState() {
    const form = $('#receipt-form');
    const fd = new FormData(form);
    fd.forEach((v, k) => { state[k] = v; });
    state.amount = parseFloat(state.amount) || 0;
  }

  async function renderPreview() {
    syncState();
    const amount = parseFloat(state.amount) || 0;
    const logo = $('#preview-logo');
    if (state.logo) { logo.src = state.logo; logo.classList.remove('hidden'); }
    else { logo.classList.add('hidden'); }

    $('#preview-company-name').textContent = state.companyName;
    $('#preview-company-details').textContent = [state.companyAddress, state.companyPhone, state.companyVat ? 'VAT: ' + state.companyVat : ''].filter(Boolean).join(' · ');
    $('#preview-receipt-number').textContent = (currentLang === 'ar' ? 'رقم الإيصال: ' : 'Receipt No: ') + state.receiptNumber;
    $('#preview-date').textContent = state.receiptDate;
    $('#preview-received-from').textContent = state.receivedFrom;
    $('#preview-payment-method').textContent = state.paymentMethod;
    $('#preview-reference').textContent = state.referenceNumber;
    $('#preview-description').textContent = state.description;
    $('#preview-amount').textContent = formatMoney(amount, state.currency);
    $('#preview-words').textContent = amountInWords(amount, currentLang);
    $('#preview-received-by').textContent = state.receivedBy;
    $('#preview-approved-by').textContent = state.approvedBy;
    $('#preview-notes').textContent = state.notes;

    translatePreviewLabels();

    const text = [state.companyName, state.receiptNumber, formatMoney(amount, state.currency), state.receiptDate].join(' | ');
    $('#preview-qr').src = await generateQR(text, 120);
  }

  function translatePreviewLabels() {
    const ar = currentLang === 'ar';
    $$$(`[data-i18n-en]`).forEach(el => {
      const text = ar ? el.dataset.i18nAr : el.dataset.i18nEn;
      if (text) el.textContent = text;
    });
  }

  function resetForm() {
    if (confirm(t('common.deleteConfirm'))) {
      state = structuredClone ? structuredClone(defaultState) : JSON.parse(JSON.stringify(defaultState));
      clearToolState(STORAGE_KEY);
      clearToolState('receipt_logo');
      populateForm();
      renderPreview();
      toast(t('common.reset'));
    }
  }

  function copySummary() {
    const lines = [
      (currentLang === 'ar' ? 'إيصال: ' : 'Receipt: ') + state.receiptNumber,
      (currentLang === 'ar' ? 'المستلم من: ' : 'Received From: ') + state.receivedFrom,
      (currentLang === 'ar' ? 'المبلغ: ' : 'Amount: ') + formatMoney(state.amount, state.currency)
    ];
    window.PCTools.copyText(lines.join('\n'));
  }

  document.addEventListener('DOMContentLoaded', init);
})();
