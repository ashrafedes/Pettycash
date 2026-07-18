(function () {
  'use strict';

  var REGISTER_URL = 'https://pattycashsystem.web.app/register';
  var WIDGET_KEY = 'pc_widget_state';
  var TRACK_KEY = 'pc_widget_tracking';

  var I18N = {
    en: {
      title: 'Stop Managing Company Expenses with Excel',
      desc: 'Upgrade to a professional Petty Cash Management System.',
      features: ['Expense Tracking', 'Receipt Management', 'Approval Workflow', 'Real-Time Dashboard', 'Reports & Analytics', 'Multi-user Access'],
      cta: '\uD83D\uDE80 Start Free',
      learnMore: 'Learn More',
      close: 'Close',
      ariaLabel: 'Petty Cash System recommendation'
    },
    ar: {
      title: '\u062A\u0648\u0642\u0641 \u0639\u0646 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0639\u0647\u062F\u0629 \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645 Excel',
      desc: '\u0627\u0646\u062A\u0642\u0644 \u0625\u0644\u0649 \u0646\u0638\u0627\u0645 \u0627\u062D\u062A\u0631\u0627\u0641\u064A \u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0639\u0647\u062F\u0629 \u0648\u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A.',
      features: ['\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A', '\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0625\u064A\u0635\u0627\u0644\u0627\u062A', '\u062F\u0648\u0631\u0629 \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0627\u062A', '\u0644\u0648\u062D\u0629 \u0645\u062A\u0627\u0628\u0639\u0629 \u0645\u0628\u0627\u0634\u0631\u0629', '\u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u062D\u062A\u0631\u0627\u0641\u064A\u0629', '\u062F\u0639\u0645 \u0639\u062F\u0629 \u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646'],
      cta: '\uD83D\uDE80 \u0627\u0628\u062F\u0623 \u0645\u062C\u0627\u0646\u064B\u0627',
      learnMore: '\u0627\u0639\u0631\u0641 \u0627\u0644\u0645\u0632\u064A\u062F',
      close: '\u0625\u063A\u0644\u0627\u0642',
      ariaLabel: '\u062A\u0648\u0635\u064A\u0629 \u0646\u0638\u0627\u0645 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0639\u0647\u062F\u0629'
    }
  };

  function getLang() {
    var lang = (document.documentElement.lang || 'en').substring(0, 2).toLowerCase();
    return I18N[lang] ? lang : 'en';
  }

  function getState() {
    try { return JSON.parse(localStorage.getItem(WIDGET_KEY)) || {}; } catch (e) { return {}; }
  }

  function saveState(s) {
    try { localStorage.setItem(WIDGET_KEY, JSON.stringify(s)); } catch (e) {}
  }

  function trackEvent(name) {
    try {
      var t = JSON.parse(localStorage.getItem(TRACK_KEY)) || {};
      t[name] = Date.now();
      localStorage.setItem(TRACK_KEY, JSON.stringify(t));
    } catch (e) {}
    if (typeof gtag === 'function') { gtag('event', name); }
    if (typeof clarity === 'function') { clarity('event', name); }
  }

  function shouldShow() {
    var s = getState();
    var now = Date.now();
    if (s.clickedAt && (now - s.clickedAt) < 30 * 86400000) return false;
    if (s.closedAt && (now - s.closedAt) < 7 * 86400000) return false;
    if (s.shownThisVisit) return false;
    return true;
  }

  function injectCSS(lang, isRTL) {
    var pos = isRTL ? 'left' : 'right';
    var css = '' +
      '.pc-widget-overlay{position:fixed;' + pos + ':16px;bottom:16px;z-index:99998;width:360px;max-width:calc(100vw - 32px);' +
      'opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease;pointer-events:none;}' +
      '.pc-widget-overlay.pc-show{opacity:1;transform:translateY(0);pointer-events:auto;}' +
      '.pc-widget-card{background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.14);' +
      'border:1px solid #e2e8f0;overflow:hidden;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;}' +
      '.pc-widget-header{background:linear-gradient(135deg,#2563eb,#1e40af);color:#fff;padding:18px 20px 14px;position:relative;}' +
      '.pc-widget-header h3{margin:0;font-size:16px;font-weight:700;line-height:1.4}' +
      '.pc-widget-close{position:absolute;top:12px;' + (isRTL ? 'left' : 'right') + ':12px;background:rgba(255,255,255,.2);' +
      'border:none;color:#fff;width:28px;height:28px;border-radius:8px;cursor:pointer;font-size:18px;line-height:1;' +
      'display:flex;align-items:center;justify-content:center;transition:background .2s}' +
      '.pc-widget-close:hover{background:rgba(255,255,255,.35)}' +
      '.pc-widget-body{padding:16px 20px 18px;}' +
      '.pc-widget-desc{color:#475569;font-size:13px;line-height:1.5;margin:0 0 12px;}' +
      '.pc-widget-features{list-style:none;margin:0 0 16px;padding:0;}' +
      '.pc-widget-features li{color:#334155;font-size:12.5px;line-height:1.8;padding-' + (isRTL ? 'right' : 'left') + ':22px;position:relative;}' +
      '.pc-widget-features li::before{content:\'\u2713\';position:absolute;' + (isRTL ? 'right:0' : 'left:0') + ';color:#16a34a;font-weight:700;}' +
      '.pc-widget-actions{display:flex;align-items:center;gap:12px;}' +
      '.pc-widget-btn{display:inline-flex;align-items:center;gap:6px;background:#2563eb;color:#fff;border:none;' +
      'padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;transition:background .2s;white-space:nowrap;}' +
      '.pc-widget-btn:hover{background:#1d4ed8}' +
      '.pc-widget-link{color:#2563eb;font-size:13px;font-weight:500;text-decoration:none;cursor:pointer;}' +
      '.pc-widget-link:hover{text-decoration:underline}' +
      '@media(max-width:480px){.pc-widget-overlay{width:calc(100vw - 24px);' + pos + ':12px;bottom:12px;}' +
      '.pc-widget-actions{flex-direction:column;align-items:stretch}.pc-widget-link{text-align:center}}' +
      '@media(prefers-color-scheme:dark){.pc-widget-card{background:#1e293b;border-color:#334155}' +
      '.pc-widget-desc{color:#94a3b8}.pc-widget-features li{color:#cbd5e1}' +
      '.pc-widget-link{color:#60a5fa}.pc-widget-btn{background:#2563eb}.pc-widget-btn:hover{background:#3b82f6}}' +
      '@media(prefers-reduced-motion:reduce){.pc-widget-overlay{transition:opacity .2s}}';
    var style = document.createElement('style');
    style.setAttribute('data-pc-widget', '');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createWidget(lang) {
    var isRTL = lang === 'ar';
    var t = I18N[lang];
    injectCSS(lang, isRTL);

    var overlay = document.createElement('div');
    overlay.className = 'pc-widget-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', t.ariaLabel);
    overlay.setAttribute('aria-modal', 'false');

    var featuresHTML = t.features.map(function (f) {
      return '<li>' + f + '</li>';
    }).join('');

    overlay.innerHTML =
      '<div class="pc-widget-card">' +
      '<div class="pc-widget-header">' +
      '<h3>' + t.title + '</h3>' +
      '<button class="pc-widget-close" aria-label="' + t.close + '" type="button">&times;</button>' +
      '</div>' +
      '<div class="pc-widget-body">' +
      '<p class="pc-widget-desc">' + t.desc + '</p>' +
      '<ul class="pc-widget-features">' + featuresHTML + '</ul>' +
      '<div class="pc-widget-actions">' +
      '<a class="pc-widget-btn" href="' + REGISTER_URL + '" target="_blank" rel="noopener noreferrer">' + t.cta + '</a>' +
      '<a class="pc-widget-link" href="' + REGISTER_URL + '" target="_blank" rel="noopener noreferrer">' + t.learnMore + '</a>' +
      '</div>' +
      '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    var closeBtn = overlay.querySelector('.pc-widget-close');
    closeBtn.addEventListener('click', function () {
      hideWidget();
      var s = getState();
      s.closedAt = Date.now();
      saveState(s);
      trackEvent('pettycash_widget_closed');
    });

    var ctaBtns = overlay.querySelectorAll('.pc-widget-btn, .pc-widget-link');
    ctaBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var s = getState();
        s.clickedAt = Date.now();
        saveState(s);
        trackEvent('pettycash_widget_clicked');
        hideWidget();
      });
    });

    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeBtn.click(); }
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add('pc-show');
        trackEvent('pettycash_widget_shown');
        var s = getState();
        s.shownThisVisit = true;
        saveState(s);
      });
    });
  }

  function hideWidget() {
    var overlay = document.querySelector('.pc-widget-overlay');
    if (overlay) {
      overlay.classList.remove('pc-show');
      setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 600);
    }
  }

  function init() {
    if (!shouldShow()) return;
    var lang = getLang();
    createWidget(lang);
  }

  function onToolComplete() {
    if (!shouldShow()) return;
    var existing = document.querySelector('.pc-widget-overlay');
    if (existing) return;
    var lang = getLang();
    createWidget(lang);
  }

  window.addEventListener('tool:complete', onToolComplete);

  window.addEventListener('pctool-lang-change', function () {
    var existing = document.querySelector('.pc-widget-overlay');
    if (!existing) return;
    hideWidget();
    setTimeout(function () {
      var lang = getLang();
      createWidget(lang);
    }, 650);
  });

  if (document.readyState === 'complete') {
    setTimeout(init, 20000);
  } else {
    window.addEventListener('load', function () {
      setTimeout(init, 20000);
    });
  }

  window.PettyCashWidget = {
    show: init,
    showOnToolComplete: onToolComplete,
    hide: hideWidget
  };
})();
