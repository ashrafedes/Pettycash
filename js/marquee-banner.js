(function () {
  function getLang() {
    var lang = 'en';
    try {
      lang = localStorage.getItem('pctool_lang')
        || localStorage.getItem('pettycash-lang')
        || localStorage.getItem('marketing_lang')
        || localStorage.getItem('i18nextLng')
        || 'en';
    } catch (e) {}
    if (!lang || lang === 'undefined' || lang === 'null') lang = 'en';
    // Also check document lang as fallback
    var docLang = document.documentElement.lang || '';
    if (docLang.indexOf('ar') === 0) lang = 'ar';
    return lang;
  }

  function getText() {
    return getLang() === 'ar'
      ? 'تخلص من الورق! جرّب نظام Petty Cash لإدارة المصروفات والإيصالات.'
      : 'Go paperless! Try the Petty Cash System to manage expenses and receipts.';
  }

  function updateText() {
    var el = document.querySelector('#marquee-banner .marquee-text a');
    if (el) el.textContent = getText();
    // Update dir attribute for animation direction
    var banner = document.getElementById('marquee-banner');
    if (banner) {
      var isAr = getLang() === 'ar';
      banner.parentElement?.setAttribute('dir', isAr ? 'rtl' : 'ltr');
      var marqueeText = banner.querySelector('.marquee-text');
      if (marqueeText) {
        marqueeText.style.animation = isAr ? 'marquee-scroll-rtl 18s linear infinite' : 'marquee-scroll 18s linear infinite';
      }
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  // Listen for language change events from different systems
  window.addEventListener('pctool-lang-change', updateText);
  window.addEventListener('pettycash-lang-change', updateText);
  window.addEventListener('marketing-lang-change', updateText);
  window.addEventListener('i18n:languageChanged', updateText);
})();
