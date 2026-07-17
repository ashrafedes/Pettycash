// PettyCash Tools Shared Library
(function (global) {
  'use strict';

  const STORAGE_PREFIX = 'pctool_';

  // ===================== Translations =====================
  const TRANSLATIONS = {
    en: {
      common: {
        appName: 'PettyCash.site Tools',
        tools: 'Tools',
        langLabel: 'Language',
        lightMode: 'Light',
        darkMode: 'Dark',
        save: 'Save',
        reset: 'Reset',
        print: 'Print',
        downloadPDF: 'Download PDF',
        downloadPNG: 'Download PNG',
        copy: 'Copy',
        share: 'Share',
        preview: 'Preview',
        add: 'Add',
        delete: 'Delete',
        duplicate: 'Duplicate',
        total: 'Total',
        subtotal: 'Subtotal',
        discount: 'Discount',
        vat: 'VAT',
        grandTotal: 'Grand Total',
        paid: 'Paid',
        remaining: 'Remaining',
        amount: 'Amount',
        amountInWords: 'Amount in Words',
        description: 'Description',
        quantity: 'Quantity',
        unit: 'Unit',
        unitPrice: 'Unit Price',
        tax: 'Tax',
        notes: 'Notes',
        terms: 'Terms & Conditions',
        authorizedSignature: 'Authorized Signature',
        companyStamp: 'Company Stamp',
        companyLogo: 'Company Logo',
        phone: 'Phone',
        email: 'Email',
        address: 'Address',
        website: 'Website',
        required: 'This field is required',
        invalid: 'Invalid value',
        saved: 'Saved locally',
        copied: 'Copied to clipboard',
        shared: 'Link copied',
        deleteConfirm: 'Delete this item?'
      },
      nav: {
        home: 'Home',
        invoice: 'Invoice Generator',
        receipt: 'Receipt Generator',
        voucher: 'Petty Cash Voucher'
      },
      invoice: {
        title: 'Saudi Invoice Generator (ZATCA Ready)',
        metaTitle: 'Saudi Invoice Generator | ZATCA QR | Free Online',
        metaDescription: 'Create professional ZATCA-ready Saudi invoices with QR code, VAT, and PDF export. Free online invoice generator.',
        companyInfo: 'Company Information',
        customerInfo: 'Customer Information',
        invoiceInfo: 'Invoice Information',
        items: 'Invoice Items',
        calculations: 'Calculations',
        qr: 'QR Code',
        footer: 'Footer',
        companyName: 'Company Name',
        vatReg: 'VAT Registration Number',
        cr: 'Commercial Registration',
        address: 'Address',
        phone: 'Phone',
        email: 'Email',
        website: 'Website',
        bankName: 'Bank Name',
        iban: 'IBAN',
        customerName: 'Customer Name',
        customerVat: 'Customer VAT Number',
        invoiceNumber: 'Invoice Number',
        invoiceTitleEn: 'Invoice Title (English)',
        invoiceTitleAr: 'Invoice Title (Arabic)',
        issueDate: 'Issue Date',
        dueDate: 'Due Date',
        currency: 'Currency',
        paymentTerms: 'Payment Terms',
        poNumber: 'Purchase Order Number',
        reference: 'Reference Number',
        discount: 'Discount',
        vatPercent: 'VAT %',
        addItem: 'Add Item',
        duplicateItem: 'Duplicate',
        deleteItem: 'Delete',
        paidAmount: 'Paid Amount'
      },
      receipt: {
        title: 'Receipt Generator',
        metaTitle: 'Free Receipt Generator | PDF & PNG Download',
        metaDescription: 'Generate professional receipts with QR code, amount in words, and PDF or PNG export.',
        receiptNumber: 'Receipt Number',
        receiptDate: 'Receipt Date',
        receivedFrom: 'Received From',
        paymentMethod: 'Payment Method',
        cash: 'Cash',
        bankTransfer: 'Bank Transfer',
        card: 'Card',
        cheque: 'Cheque',
        referenceNumber: 'Reference Number',
        receivedBy: 'Received By',
        approvedBy: 'Approved By'
      },
      voucher: {
        title: 'Petty Cash Voucher Generator',
        metaTitle: 'Petty Cash Voucher Generator | Free PDF & PNG',
        metaDescription: 'Create professional petty cash vouchers with automatic totals, VAT, QR code, approvals, and PDF/PNG export.',
        voucherInfo: 'Voucher Information',
        voucherNumber: 'Voucher Number',
        date: 'Date',
        employee: 'Employee',
        department: 'Department',
        costCenter: 'Cost Center',
        project: 'Project',
        vendor: 'Vendor',
        expenseCategory: 'Expense Category',
        expenseTable: 'Expense Items',
        unitCost: 'Unit Cost',
        approval: 'Approval Section',
        preparedBy: 'Prepared By',
        checkedBy: 'Checked By',
        approvedBy: 'Approved By',
        receivedBy: 'Received By'
      },
      tools: {
        heroTitle: 'Free Business Tools',
        heroSubtitle: 'Generate professional invoices, receipts, and petty cash vouchers. ZATCA-ready QR codes, PDF/PNG export, and bilingual English & Arabic support.',
        invoiceCardDesc: 'ZATCA Phase 1 QR, VAT calculations, PDF/PNG export.',
        receiptCardDesc: 'Automatic amount in words, QR code, printable receipts.',
        voucherCardDesc: 'Expense tracking, approvals, automatic totals.',
        footer: '© 2026 PettyCash.site — Free business tools.'
      }
    },
    ar: {
      common: {
        appName: 'أدوات PettyCash.site',
        tools: 'الأدوات',
        langLabel: 'اللغة',
        lightMode: 'فاتح',
        darkMode: 'داكن',
        save: 'حفظ',
        reset: 'إعادة تعيين',
        print: 'طباعة',
        downloadPDF: 'تحميل PDF',
        downloadPNG: 'تحميل PNG',
        copy: 'نسخ',
        share: 'مشاركة',
        preview: 'معاينة',
        add: 'إضافة',
        delete: 'حذف',
        duplicate: 'نسخ',
        total: 'الإجمالي',
        subtotal: 'المجموع الفرعي',
        discount: 'الخصم',
        vat: 'ضريبة القيمة المضافة',
        grandTotal: 'الإجمالي الكلي',
        paid: 'المدفوع',
        remaining: 'المتبقي',
        amount: 'المبلغ',
        amountInWords: 'المبلغ بالحروف',
        description: 'الوصف',
        quantity: 'الكمية',
        unit: 'الوحدة',
        unitPrice: 'سعر الوحدة',
        tax: 'الضريبة',
        notes: 'ملاحظات',
        terms: 'الشروط والأحكام',
        authorizedSignature: 'توقيع المفوض',
        companyStamp: 'ختم الشركة',
        companyLogo: 'شعار الشركة',
        phone: 'الهاتف',
        email: 'البريد الإلكتروني',
        address: 'العنوان',
        website: 'الموقع الإلكتروني',
        required: 'هذا الحقل مطلوب',
        invalid: 'قيمة غير صالحة',
        saved: 'تم الحفظ محلياً',
        copied: 'تم النسخ إلى الحافظة',
        shared: 'تم نسخ الرابط',
        deleteConfirm: 'حذف هذا البند؟'
      },
      nav: {
        home: 'الرئيسية',
        invoice: 'منشئ الفواتير',
        receipt: 'منشئ الإيصالات',
        voucher: 'قسيمة الصندوق الصغير'
      },
      invoice: {
        title: 'منشئ الفواتير السعودية (متوافق مع ZATCA)',
        metaTitle: 'منشئ فواتير سعودية | QR ZATCA | مجاني',
        metaDescription: 'أنشئ فواتير سعودية احترافية متوافقة مع ZATCA مع رمز QR والضريبة وتصدير PDF.',
        companyInfo: 'معلومات الشركة',
        customerInfo: 'معلومات العميل',
        invoiceInfo: 'معلومات الفاتورة',
        items: 'بنود الفاتورة',
        calculations: 'الحسابات',
        qr: 'رمز الاستجابة السريعة',
        footer: 'تذييل الفاتورة',
        companyName: 'اسم الشركة',
        vatReg: 'رقم التسجيل الضريبي',
        cr: 'السجل التجاري',
        address: 'العنوان',
        phone: 'الهاتف',
        email: 'البريد الإلكتروني',
        website: 'الموقع الإلكتروني',
        bankName: 'اسم البنك',
        iban: 'IBAN',
        customerName: 'اسم العميل',
        customerVat: 'الرقم الضريبي للعميل',
        invoiceNumber: 'رقم الفاتورة',
        invoiceTitleEn: 'عنوان الفاتورة (إنجليزي)',
        invoiceTitleAr: 'عنوان الفاتورة (عربي)',
        issueDate: 'تاريخ الإصدار',
        dueDate: 'تاريخ الاستحقاق',
        currency: 'العملة',
        paymentTerms: 'شروط الدفع',
        poNumber: 'رقم أمر الشراء',
        reference: 'رقم المرجع',
        discount: 'الخصم',
        vatPercent: 'نسبة الضريبة %',
        addItem: 'إضافة بند',
        duplicateItem: 'نسخ',
        deleteItem: 'حذف',
        paidAmount: 'المبلغ المدفوع'
      },
      receipt: {
        title: 'منشئ الإيصالات',
        metaTitle: 'منشئ إيصالات مجاني | PDF و PNG',
        metaDescription: 'أنشئ إيصالات احترافية مع QR والمبلغ بالحروف وتصدير PDF أو PNG.',
        receiptNumber: 'رقم الإيصال',
        receiptDate: 'تاريخ الإيصال',
        receivedFrom: 'المستلم من',
        paymentMethod: 'طريقة الدفع',
        cash: 'نقداً',
        bankTransfer: 'تحويل بنكي',
        card: 'بطاقة',
        cheque: 'شيك',
        referenceNumber: 'رقم المرجع',
        receivedBy: 'المستلم',
        approvedBy: 'معتمد من'
      },
      voucher: {
        title: 'منشئ قسائم الصندوق الصغير',
        metaTitle: 'منشئ قسيمة الصندوق الصغير | PDF مجاني',
        metaDescription: 'أنشئ قسائم صندوق صغير احترافية مع إجماليات تلقائية وضريبة وQR وموافقات.',
        voucherInfo: 'معلومات القسيمة',
        voucherNumber: 'رقم القسيمة',
        date: 'التاريخ',
        employee: 'الموظف',
        department: 'القسم',
        costCenter: 'مركز التكلفة',
        project: 'المشروع',
        vendor: 'المورد',
        expenseCategory: 'فئة المصروف',
        expenseTable: 'بنود المصروف',
        unitCost: 'تكلفة الوحدة',
        approval: 'قسم الموافقات',
        preparedBy: 'أعده',
        checkedBy: 'راجعه',
        approvedBy: 'وافق عليه',
        receivedBy: 'استلمه'
      },
      tools: {
        heroTitle: 'أدوات الأعمال المجانية',
        heroSubtitle: 'أنشئ فواتير وإيصالات وقسائم صندوق صغير احترافية. رموز QR جاهزة لـ ZATCA، تصدير PDF/PNG، ودعم اللغتين الإنجليزية والعربية.',
        invoiceCardDesc: 'QR للمرحلة الأولى من ZATCA، حسابات VAT، تصدير PDF/PNG.',
        receiptCardDesc: 'المبلغ تلقائياً بالحروف، QR، إيصالات قابلة للطباعة.',
        voucherCardDesc: 'تتبع المصروفات، موافقات، إجماليات تلقائية.',
        footer: '© 2026 PettyCash.site — أدوات الأعمال المجانية.'
      }
    }
  };

  let currentLang = new URLSearchParams(window.location.search).get('lang') || localStorage.getItem('pctool_lang') || localStorage.getItem('lang') || (document.documentElement.lang || 'en');
  if (!TRANSLATIONS[currentLang]) currentLang = 'en';

  function t(key, fallback = '') {
    const parts = key.split('.');
    let val = TRANSLATIONS[currentLang];
    for (const p of parts) {
      if (val == null) break;
      val = val[p];
    }
    if (val === undefined || val === null) return fallback || key;
    return val;
  }

  function setLang(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    localStorage.setItem('pctool_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    window.dispatchEvent(new CustomEvent('pctool-lang-change', { detail: { lang } }));
    translatePage();
  }

  function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const text = t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.placeholder) el.placeholder = text;
      } else if (el.hasAttribute('title')) {
        el.title = text;
      } else {
        el.textContent = text;
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = t(el.dataset.i18nTitle);
    });
  }

  // ===================== Theme =====================
  function updateThemeIcon(dark) {
    const btn = document.getElementById('pctool-theme');
    if (btn) btn.textContent = dark ? '☀️' : '🌙';
  }

  function applyTheme(dark) {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    updateThemeIcon(dark);
  }

  function initTheme() {
    const saved = localStorage.getItem('pctool_theme');
    let dark = false;
    if (saved) { dark = saved === 'dark'; }
    else { dark = window.matchMedia('(prefers-color-scheme: dark)').matches; }
    applyTheme(dark);
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(!isDark);
    localStorage.setItem('pctool_theme', !isDark ? 'dark' : 'light');
  }

  // ===================== Storage =====================
  function saveToolState(toolKey, data) {
    try { localStorage.setItem(STORAGE_PREFIX + toolKey, JSON.stringify(data)); }
    catch (e) { console.warn('Storage error', e); }
  }

  function loadToolState(toolKey) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + toolKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function clearToolState(toolKey) {
    localStorage.removeItem(STORAGE_PREFIX + toolKey);
  }

  // ===================== Number formatting =====================
  function formatMoney(amount, currency) {
    const n = parseFloat(amount) || 0;
    if (currency === 'SAR') return n.toFixed(2) + ' ر.س';
    if (currency === 'USD') return '$' + n.toFixed(2);
    if (currency === 'EUR') return '€' + n.toFixed(2);
    if (currency === 'GBP') return '£' + n.toFixed(2);
    return n.toFixed(2);
  }

  function todayStr() { return new Date().toISOString().split('T')[0]; }

  // ===================== Number to words =====================
  function numberToEnglish(n) {
    const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const big = ['', 'Thousand', 'Million', 'Billion'];

    if (n === 0) return 'Zero';
    const neg = n < 0;
    n = Math.abs(n);
    const whole = Math.floor(n);
    const decimal = Math.round((n - whole) * 100);

    function chunkToWords(num) {
      if (num === 0) return '';
      if (num < 20) return single[num];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + single[num % 10] : '');
      return single[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + chunkToWords(num % 100) : '');
    }

    let parts = [];
    let i = 0;
    let rem = whole;
    while (rem > 0) {
      const chunk = rem % 1000;
      if (chunk) parts.unshift(chunkToWords(chunk) + (big[i] ? ' ' + big[i] : ''));
      rem = Math.floor(rem / 1000);
      i++;
    }
    let result = (neg ? 'Negative ' : '') + parts.join(', ');
    if (decimal) result += ' and ' + decimal + '/100';
    return result.trim();
  }

  function numberToArabic(n) {
    const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
    const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
    const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
    const big = ['', 'ألف', 'مليون', 'مليار'];

    if (n === 0) return 'صفر';
    const neg = n < 0;
    n = Math.abs(n);
    const whole = Math.floor(n);
    const decimal = Math.round((n - whole) * 100);

    function chunkToWords(num) {
      if (num === 0) return '';
      if (num < 20) return ones[num];
      if (num < 100) {
        const u = num % 10;
        const t = Math.floor(num / 10);
        return (u ? ones[u] + ' و' : '') + tens[t];
      }
      const h = Math.floor(num / 100);
      const rest = num % 100;
      return hundreds[h] + (rest ? ' و' + chunkToWords(rest) : '');
    }

    let parts = [];
    let i = 0;
    let rem = whole;
    while (rem > 0) {
      const chunk = rem % 1000;
      if (chunk) {
        let word = chunkToWords(chunk) + ' ' + big[i];
        if (i === 1 && chunk === 1) word = 'ألف';
        if (i === 1 && chunk === 2) word = 'ألفان';
        if (i === 2 && chunk === 1) word = 'مليون';
        if (i === 2 && chunk === 2) word = 'مليونان';
        parts.unshift(word.trim());
      }
      rem = Math.floor(rem / 1000);
      i++;
    }
    let result = (neg ? 'سالب ' : '') + parts.join(' و');
    if (decimal) result += ' و' + decimal + ' /100';
    return result.trim();
  }

  function amountInWords(amount, lang) {
    if (lang === 'ar') return numberToArabic(amount);
    return numberToEnglish(amount);
  }

  // ===================== QR Code =====================
  function utf8ToBytes(str) {
    return new TextEncoder().encode(str);
  }

  function bytesToBase64(bytes) {
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);
  }

  // ZATCA Phase 1 TLV
  function zatcaTlvBase64(data) {
    const tags = [];
    function push(tag, value) {
      const valueBytes = utf8ToBytes(value);
      const len = valueBytes.length;
      const chunk = new Uint8Array(2 + len);
      chunk[0] = tag;
      chunk[1] = len;
      chunk.set(valueBytes, 2);
      tags.push(chunk);
    }
    push(1, data.sellerName || '');
    push(2, data.vatNumber || '');
    push(3, data.invoiceTimestamp || '');
    push(4, parseFloat(data.totalAmount || 0).toFixed(2));
    push(5, parseFloat(data.vatAmount || 0).toFixed(2));

    let totalLen = 0;
    tags.forEach(t => totalLen += t.length);
    const combined = new Uint8Array(totalLen);
    let offset = 0;
    tags.forEach(t => { combined.set(t, offset); offset += t.length; });
    return bytesToBase64(combined);
  }

  async function generateQR(text, size = 128) {
    return new Promise((resolve, reject) => {
      function doGenerate() {
        QRCode.toDataURL(text, { width: size, margin: 2, color: { dark: '#0f172a', light: '#ffffff' } }, (err, url) => {
          if (err) reject(err);
          else resolve(url);
        });
      }
      if (typeof QRCode === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
        script.onload = doGenerate;
        script.onerror = () => reject(new Error('QRCode library failed to load'));
        document.body.appendChild(script);
      } else {
        doGenerate();
      }
    });
  }

  // ===================== PDF / PNG / Print =====================
  async function ensureLibs() {
    const promises = [];
    if (typeof html2canvas === 'undefined') promises.push(loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'));
    if (typeof jspdf === 'undefined' || typeof jspdf.jsPDF === 'undefined') promises.push(loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'));
    await Promise.all(promises);
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  async function exportPDF(element, filename) {
    await ensureLibs();
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = jspdf;
    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save(filename);
  }

  async function exportPNG(element, filename) {
    await ensureLibs();
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function printElement(elementId) {
    const original = document.body.innerHTML;
    const el = document.getElementById(elementId);
    document.body.innerHTML = el ? el.outerHTML : original;
    window.print();
    document.body.innerHTML = original;
    window.location.reload();
  }

  // ===================== UI Helpers =====================
  function toast(message, duration = 2500) {
    let el = document.getElementById('pctool-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'pctool-toast';
      el.className = 'fixed bottom-6 end-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3';
      el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span id="pctool-toast-msg" class="font-medium text-sm"></span>';
      document.body.appendChild(el);
    }
    document.getElementById('pctool-toast-msg').textContent = message;
    el.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => el.classList.add('translate-y-20', 'opacity-0'), duration);
  }

  function debounce(fn, ms = 300) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

  function renderNav() {
    const current = window.location.pathname.split('/').pop();
    const nav = document.getElementById('pctool-nav');
    if (!nav) return;
    const base = nav.dataset.base || '../';
    nav.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <a href="${base}" class="flex items-center gap-2 font-bold text-lg text-blue-700 dark:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
            <span data-i18n="common.appName">PettyCash.site Tools</span>
          </a>
          <div class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="${base}tools/saudi-invoice-generator.html" class="hover:text-blue-600 ${current === 'saudi-invoice-generator.html' ? 'text-blue-600' : ''}" data-i18n="nav.invoice">Invoice Generator</a>
            <a href="${base}tools/receipt-generator.html" class="hover:text-blue-600 ${current === 'receipt-generator.html' ? 'text-blue-600' : ''}" data-i18n="nav.receipt">Receipt Generator</a>
            <a href="${base}tools/petty-cash-voucher-generator.html" class="hover:text-blue-600 ${current === 'petty-cash-voucher-generator.html' ? 'text-blue-600' : ''}" data-i18n="nav.voucher">Voucher</a>
          </div>
          <div class="flex items-center gap-3">
            <button id="pctool-theme" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" aria-label="Toggle theme">🌙</button>
            <select id="pctool-lang" class="bg-slate-100 dark:bg-slate-800 border-0 rounded-lg text-sm px-2 py-1.5 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500">
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </div>
    `;
    document.getElementById('pctool-theme').addEventListener('click', toggleTheme);
    const langSelect = document.getElementById('pctool-lang');
    langSelect.value = currentLang;
    langSelect.addEventListener('change', (e) => setLang(e.target.value));
    translatePage();
  }

  function initHeadMeta(meta) {
    const set = (sel, val) => { const el = document.querySelector(sel); if (el && val) el.setAttribute('content', val); };
    set('title', meta.title);
    set('meta[name="description"]', meta.description);
    set('meta[property="og:title"]', meta.title);
    set('meta[property="og:description"]', meta.description);
    set('meta[name="twitter:title"]', meta.title);
    set('meta[name="twitter:description"]', meta.description);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  // ===================== Validation =====================
  function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    let valid = true;
    form.querySelectorAll('[required], [data-validate]').forEach(el => {
      const val = el.value.trim();
      let err = '';
      if (el.required && !val) err = t('common.required');
      else if (el.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) err = t('common.invalid');
      else if (el.dataset.validate === 'number' && val && isNaN(val)) err = t('common.invalid');
      const next = el.nextElementSibling;
      if (next && next.classList.contains('field-error')) next.remove();
      if (err) {
        valid = false;
        const span = document.createElement('span');
        span.className = 'field-error text-xs text-red-500 mt-1 block';
        span.textContent = err;
        el.after(span);
        el.classList.add('border-red-500');
      } else { el.classList.remove('border-red-500'); }
    });
    return valid;
  }

  // ===================== Logo upload =====================
  function handleLogoUpload(input, callback, storageKey) {
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        try { localStorage.setItem(STORAGE_PREFIX + storageKey, base64); } catch (err) {}
        callback(base64);
      };
      reader.readAsDataURL(file);
    });
  }

  function loadLogo(storageKey, callback) {
    try {
      const base64 = localStorage.getItem(STORAGE_PREFIX + storageKey);
      if (base64) callback(base64);
    } catch (e) {}
  }

  // ===================== Share / Copy =====================
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast(t('common.copied'));
    } catch (e) { toast('Copy failed'); }
  }

  async function sharePage() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: document.title, url }); return; } catch (e) {}
    }
    copyText(url);
  }

  // ===================== Export public API =====================
  const PCTools = {
    t, setLang, currentLang, translatePage,
    initTheme, toggleTheme,
    saveToolState, loadToolState, clearToolState,
    formatMoney, todayStr, amountInWords,
    zatcaTlvBase64, generateQR,
    ensureLibs, exportPDF, exportPNG, printElement,
    toast, debounce, clone,
    renderNav, initHeadMeta, validateForm,
    handleLogoUpload, loadLogo,
    copyText, sharePage,
    STORAGE_PREFIX
  };

  global.PCTools = PCTools;
  if (typeof module !== 'undefined') module.exports = PCTools;
})(this);
