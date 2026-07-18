(function () {
  function getLang() {
    var lang = 'en';
    try {
      lang = localStorage.getItem('pctool_lang') || localStorage.getItem('pettycash-lang') || 'en';
    } catch (e) {}
    return lang;
  }

  function getText() {
    return getLang() === 'ar'
      ? 'تخلص من الورق! جرّب نظام Petty Cash لإدارة المصروفات والإيصالات.'
      : 'Go paperless! Try the Petty Cash System to manage expenses and receipts.';
  }

  function inject() {
    if (document.getElementById('marquee-banner')) return;

    var style = document.createElement('style');
    style.textContent = [
      '@keyframes marquee-scroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }',
      '@keyframes marquee-scroll-rtl { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }',
      '#marquee-banner { position: fixed; bottom: 0; left: 0; z-index: 50; background: #16a34a; color: #fff; overflow: hidden; padding: 6px 8px; font-size: 14px; font-weight: 600; box-shadow: 0 -2px 10px rgba(0,0,0,.15); border-top-right-radius: 12px; max-width: 90vw; }',
      '#marquee-banner .marquee-text { display: inline-block; white-space: nowrap; animation: marquee-scroll 18s linear infinite; }',
      '#marquee-banner .marquee-text a { color: #fff; text-decoration: none; }',
      '#marquee-banner .marquee-text a:hover { text-decoration: underline; }',
      '[dir="rtl"] #marquee-banner .marquee-text { animation: marquee-scroll-rtl 18s linear infinite; }'
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

  window.addEventListener('pctool-lang-change', function () {
    var el = document.querySelector('#marquee-banner .marquee-text a');
    if (el) el.textContent = getText();
  });
})();
