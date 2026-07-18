(function () {
  var AR_TEXT = 'تخلص من الورق! جرّب نظام Petty Cash لإدارة المصروفات والإيصالات.';
  var EN_TEXT = 'Go paperless! Try the Petty Cash System to manage expenses and receipts.';

  // Determine language from the most reliable source: document.documentElement.lang
  // Falls back to localStorage only if doc lang is not set
  function getLang() {
    var docLang = (document.documentElement.lang || '').toLowerCase();
    if (docLang.indexOf('ar') === 0) return 'ar';
    if (docLang.indexOf('en') === 0) return 'en';

    // Check dir attribute as secondary signal
    var dir = document.documentElement.dir || '';
    if (dir === 'rtl') return 'ar';

    // Last resort: localStorage
    try {
      var stored = localStorage.getItem('pctool_lang')
        || localStorage.getItem('pettycash-lang')
        || localStorage.getItem('marketing_lang')
        || localStorage.getItem('i18nextLng')
        || '';
      if (stored.indexOf('ar') === 0) return 'ar';
    } catch (e) {}
    return 'en';
  }

  function getText() {
    return getLang() === 'ar' ? AR_TEXT : EN_TEXT;
  }

  function update() {
    var linkEl = document.querySelector('#marquee-banner .marquee-text a');
    var marqueeEl = document.querySelector('#marquee-banner .marquee-text');
    if (!linkEl || !marqueeEl) return;

    var isAr = getLang() === 'ar';
    var newText = isAr ? AR_TEXT : EN_TEXT;

    // Only update if changed (avoids restarting animation unnecessarily)
    if (linkEl.textContent !== newText) {
      linkEl.textContent = newText;
    }

    // Always sync animation direction with text language
    var currentAnim = marqueeEl.style.animation || '';
    var expectedAnim = isAr
      ? 'marquee-scroll-rtl 18s linear infinite'
      : 'marquee-scroll 18s linear infinite';
    if (currentAnim.indexOf(isAr ? 'marquee-scroll-rtl' : 'marquee-scroll') !== 0 || currentAnim.indexOf('marquee-scroll-rtl') >= 0 !== isAr) {
      marqueeEl.style.animation = expectedAnim;
    }
  }

  function inject() {
    if (document.getElementById('marquee-banner')) return;

    var isAr = getLang() === 'ar';

    var style = document.createElement('style');
    style.textContent = [
      '@keyframes marquee-scroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }',
      '@keyframes marquee-scroll-rtl { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }',
      '#marquee-banner { position: fixed; bottom: 0; left: 0; z-index: 50; background: #16a34a; color: #fff; overflow: hidden; padding: 6px 8px; font-size: 14px; font-weight: 600; box-shadow: 0 -2px 10px rgba(0,0,0,.15); border-top-right-radius: 12px; max-width: 90vw; }',
      '#marquee-banner .marquee-text { display: inline-block; white-space: nowrap; animation: ' + (isAr ? 'marquee-scroll-rtl' : 'marquee-scroll') + ' 18s linear infinite; }',
      '#marquee-banner .marquee-text a { color: #fff; text-decoration: none; }',
      '#marquee-banner .marquee-text a:hover { text-decoration: underline; }'
    ].join('\n');
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'marquee-banner';
    banner.innerHTML = '<div class="marquee-text"><a href="https://pattycashsystem.web.app/register" target="_blank" rel="noopener noreferrer">' + getText() + '</a></div>';
    document.body.appendChild(banner);

    // Watch <html> lang and dir attributes for changes
    if (typeof MutationObserver !== 'undefined') {
      var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          if (mutations[i].attributeName === 'lang' || mutations[i].attributeName === 'dir') {
            update();
            return;
          }
        }
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
    }

    // Also listen for custom language change events as backup
    window.addEventListener('pctool-lang-change', update);
    window.addEventListener('pettycash-lang-change', update);
    window.addEventListener('marketing-lang-change', update);
    window.addEventListener('i18n:languageChanged', update);

    // Re-check after a delay in case language is set late by page scripts
    setTimeout(update, 500);
    setTimeout(update, 1500);
    setTimeout(update, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
