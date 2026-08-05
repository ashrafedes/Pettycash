// PettyCash Tools Shared Library
(function (global) {
  'use strict';

  const STORAGE_PREFIX = 'pctool_';

  // ===================== Translations =====================
  const TRANSLATIONS = {
    en: {
      common: {
        appName: 'PettyCash.site Tools',
        tools: 'Free Tools',
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
        voucher: 'Petty Cash Voucher',
        calculators: 'Calculators',
        savingsCalc: 'Expense Savings Calculator',
        limitCalc: 'Petty Cash Limit Calculator',
        vatCalc: 'VAT Calculator',
        policyGen: 'Expense Policy Generator',
        workflowBuilder: 'Approval Workflow Builder',
        controlQuiz: 'Internal Control Score Quiz',
        expenseReport: 'Expense Report Generator',
        cashCountSheet: 'Cash Count Sheet',
        budgetReport: 'Budget vs Actual Report',
        presentationGen: 'AI Presentation Generator'
      },
      invoice: {
        title: 'Saudi Invoice Generator',
        metaTitle: 'Saudi Invoice Generator | Free VAT Invoice & PDF Generator',
        metaDescription: 'Create professional Saudi invoice templates with VAT, QR Code, and PDF export. Free, fast, bilingual, and easy to use.',
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
        issueTime: 'Issue Time',
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
        metaDescription: 'Generate professional receipts with automatic amount in words and PDF or PNG export. Free online receipt generator.',
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
        metaDescription: 'Create professional petty cash vouchers with automatic totals, VAT, approvals, and PDF/PNG export. Free online voucher generator.',
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
        heroSubtitle: 'Generate professional invoices, receipts, and petty cash vouchers. Invoice QR codes, PDF/PNG export, and bilingual English & Arabic support.',
        invoiceCardDesc: 'QR codes, VAT calculations, PDF/PNG export.',
        receiptCardDesc: 'Automatic amount in words, printable receipts, PDF/PNG export.',
        voucherCardDesc: 'Expense tracking, approvals, automatic totals.',
        savingsCalcCardDesc: 'Calculate how much your business saves by automating expense tracking.',
        limitCalcCardDesc: 'Determine the optimal petty cash float for your business size.',
        vatCalcCardDesc: 'Calculate Saudi VAT (15%) on any amount — inclusive or exclusive.',
        policyGenCardDesc: 'Generate a professional expense policy in minutes.',
        workflowCardDesc: 'Design approval workflows with custom thresholds and levels.',
        controlQuizCardDesc: 'Assess your internal controls and get a score with recommendations.',
        expenseReportCardDesc: 'Generate a professional expense report with multiple line items and download as PDF.',
        cashCountSheetCardDesc: 'Create a petty cash count sheet with denomination breakdown and reconciliation.',
        budgetReportCardDesc: 'Compare budgeted vs actual expenses and generate a variance report as PDF.',
        presentationGenCardDesc: 'Create professional PowerPoint presentations with AI. Enter your topic and download as PPTX.',
        footer: '© 2026 PettyCash.site — Free business tools.'
      }
    },
    ar: {
      common: {
        appName: 'أدوات PettyCash.site',
        tools: 'الأدوات المجانية',
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
        voucher: 'قسيمة الصندوق الصغير',
        calculators: 'الحاسبات',
        savingsCalc: 'حاسبة توفير المصروفات',
        limitCalc: 'حاسبة حد الصندوق الصغير',
        vatCalc: 'حاسبة ضريبة القيمة المضافة',
        policyGen: 'مولد سياسة المصروفات',
        workflowBuilder: 'منشئ سير عمل الموافقات',
        controlQuiz: 'اختبار نقاط الرقابة الداخلية',
        expenseReport: 'مولد تقرير المصروفات',
        cashCountSheet: 'ورقة جرد النقدية',
        budgetReport: 'تقرير الموازنة مقابل الفعلي',
        presentationGen: 'مولد العروض التقديمية بالذكاء الاصطناعي'
      },
      invoice: {
        title: 'منشئ الفواتير السعودية',
        metaTitle: 'منشئ فواتير سعودية | QR و PDF | مجاني',
        metaDescription: 'أنشئ فواتير سعودية احترافية مع رمز QR والضريبة وتصدير PDF. مجاني وسريع ويدعم العربية والإنجليزية.',
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
        issueTime: 'وقت الإصدار',
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
        heroSubtitle: 'أنشئ فواتير وإيصالات وقسائم صندوق صغير احترافية. رموز QR للفواتير، تصدير PDF/PNG، ودعم اللغتين الإنجليزية والعربية.',
        invoiceCardDesc: 'رموز QR، حسابات VAT، تصدير PDF/PNG.',
        receiptCardDesc: 'المبلغ تلقائياً بالحروف، QR، إيصالات قابلة للطباعة.',
        voucherCardDesc: 'تتبع المصروفات، موافقات، إجماليات تلقائية.',
        savingsCalcCardDesc: 'احسب كم توفر شركتك بأتمتة تتبع المصروفات.',
        limitCalcCardDesc: 'حدد الحد الأمثل للصندوق الصغير حسب حجم شركتك.',
        vatCalcCardDesc: 'احسب ضريبة القيمة المضافة السعودية (15%) على أي مبلغ.',
        policyGenCardDesc: 'أنشئ سياسة مصروفات احترافية في دقائق.',
        workflowCardDesc: 'صمم سير عمل الموافقات بحدود ومستويات مخصصة.',
        controlQuizCardDesc: 'قيّم نقاط الرقابة الداخلية واحصل على درجة وتوصيات.',
        expenseReportCardDesc: 'أنشئ تقرير مصروفات احترافي متعدد البنود وحمله كملف PDF.',
        cashCountSheetCardDesc: 'أنشئ ورقة جرد صندوق صغير مع تفصيل الفئات والمطابقة.',
        budgetReportCardDesc: 'قارن الموازنة بالمصروفات الفعلية وأنشئ تقرير الانحرافات كملف PDF.',
        presentationGenCardDesc: 'أنشئ عروضًا تقديمية احترافية بالذكاء الاصطناعي. أدخل موضوعك وحمله كملف PPTX.',
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
    renderNav();
    translatePage();
    window.dispatchEvent(new CustomEvent('pctool-lang-change', { detail: { lang } }));
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
    document.querySelectorAll('[data-i18n-en], [data-i18n-ar]').forEach(el => {
      let val = el.getAttribute('data-i18n-' + currentLang);
      if (val) {
        // Fix mojibake: Cp437-misinterpreted UTF-8 Arabic
        if (currentLang === 'ar' && /[\u2500-\u257F]/.test(val)) {
          try {
            const bytes = new Uint8Array(val.length);
            let valid = true;
            for (let i = 0; i < val.length; i++) {
              const cp = val.charCodeAt(i);
              // Cp437 reverse mapping for box-drawing chars
              const cp437Map = {0x2562:0xD8,0x00D1:0xA5,0x00BB:0xAF,0x00BA:0xA7,0x00BF:0xA8,0x2502:0xB3,0x2524:0xB4,0x2561:0xB5,0x2556:0xB7,0x2555:0xB8,0x2563:0xB9,0x2551:0xBA,0x2557:0xBB,0x255D:0xBC,0x255C:0xBD,0x255B:0xBE,0x2510:0xBF,0x2514:0xC0,0x2534:0xC1,0x252C:0xC2,0x251C:0xC3,0x2500:0xC4,0x253C:0xC5,0x255E:0xC6,0x255F:0xC7,0x255A:0xC8,0x2554:0xC9,0x2569:0xCA,0x2566:0xCB,0x2560:0xCC,0x2550:0xCD,0x256C:0xCE,0x2567:0xCF,0x2568:0xD0,0x2564:0xD1,0x2565:0xD2,0x2559:0xD3,0x2558:0xD4,0x2552:0xD5,0x2553:0xD6,0x256B:0xD7,0x256A:0xD8,0x2518:0xD9,0x250C:0xDA,0x2588:0xDB,0x2584:0xDC,0x258C:0xDD,0x2590:0xDE,0x2580:0xDF,0x2591:0xB0,0x2592:0xB1,0x2593:0xB2,0x00F1:0xA4,0x00ED:0xA1,0x00F3:0xA2,0x00FA:0xA3,0x00E1:0xA0,0x00D6:0x99,0x00DC:0x9A,0x00FC:0x81,0x00E9:0x82,0x00E2:0x83,0x00E4:0x84,0x00E0:0x85,0x00E5:0x86,0x00E7:0x87,0x00EA:0x88,0x00EB:0x89,0x00E8:0x8A,0x00EF:0x8B,0x00EE:0x8C,0x00EC:0x8D,0x00C4:0x8E,0x00C5:0x8F,0x00C9:0x90,0x00E6:0x91,0x00C6:0x92,0x00F4:0x93,0x00F6:0x94,0x00F2:0x95,0x00FB:0x96,0x00F9:0x97,0x00FF:0x98,0x00A2:0x9B,0x00A3:0x9C,0x00A5:0x9D,0x00E1:0xA0};
              const mapped = cp437Map[cp];
              if (mapped !== undefined) bytes[i] = mapped;
              else if (cp < 128) bytes[i] = cp;
              else { valid = false; break; }
            }
            if (valid) {
              const decoded = new TextDecoder('utf-8').decode(bytes);
              if (/[\u0600-\u06FF]/.test(decoded)) {
                el.setAttribute('data-i18n-ar', decoded);
                el.textContent = decoded;
                return;
              }
            }
          } catch(e) {}
          // Fallback to data-i18n key or English
          if (el.dataset.i18n) el.textContent = t(el.dataset.i18n);
          else el.textContent = el.getAttribute('data-i18n-en') || val;
        } else {
          el.textContent = val;
        }
      }
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
    const code = (currency || 'SAR').toLowerCase();
    return n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + ' ' + code;
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

  // TLV Base64 encoding for invoice QR codes
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
    window.dispatchEvent(new CustomEvent('tool:complete'));
  }

  async function exportPNG(element, filename) {
    await ensureLibs();
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
    window.dispatchEvent(new CustomEvent('tool:complete'));
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
            <div class="relative group">
              <button class="hover:text-blue-600 flex items-center gap-1" data-i18n="nav.calculators">Calculators</button>
              <div class="absolute top-full start-0 mt-1 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 hidden group-hover:block z-50">
                <a href="${base}tools/expense-savings-calculator.html" class="block px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-700" data-i18n="nav.savingsCalc">Expense Savings Calculator</a>
                <a href="${base}tools/petty-cash-limit-calculator.html" class="block px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-700" data-i18n="nav.limitCalc">Petty Cash Limit Calculator</a>
                <a href="${base}tools/vat-calculator.html" class="block px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-700" data-i18n="nav.vatCalc">VAT Calculator</a>
                <a href="${base}tools/expense-policy-generator.html" class="block px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-700" data-i18n="nav.policyGen">Expense Policy Generator</a>
                <a href="${base}tools/approval-workflow-builder.html" class="block px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-700" data-i18n="nav.workflowBuilder">Approval Workflow Builder</a>
                <a href="${base}tools/internal-control-score-quiz.html" class="block px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-700" data-i18n="nav.controlQuiz">Internal Control Score Quiz</a>
                <div class="border-t border-slate-100 dark:border-slate-600 my-1"></div>
                <a href="${base}tools/expense-report-generator.html" class="block px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-700" data-i18n="nav.expenseReport">Expense Report Generator</a>
                <a href="${base}tools/cash-count-sheet.html" class="block px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-700" data-i18n="nav.cashCountSheet">Cash Count Sheet</a>
                <a href="${base}tools/budget-vs-actual-report.html" class="block px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-700" data-i18n="nav.budgetReport">Budget vs Actual Report</a>
                <a href="${base}tools/ai-presentation-generator.html" class="block px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-700" data-i18n="nav.presentationGen">AI Presentation Generator</a>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button id="pctool-theme" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" aria-label="Toggle theme">🌙</button>
            <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1" role="group" aria-label="Language switch">
              <button data-pctool-lang="en" class="pctool-lang-btn px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${currentLang === 'en' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'}">EN</button>
              <button data-pctool-lang="ar" class="pctool-lang-btn px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${currentLang === 'ar' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'}">AR</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('pctool-theme').addEventListener('click', toggleTheme);
    document.querySelectorAll('[data-pctool-lang]').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.dataset.pctoolLang));
    });
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
    t, setLang, get currentLang() { return currentLang; }, translatePage,
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
