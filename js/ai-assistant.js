(function () {
  'use strict';

  var OPENROUTER_API_KEY_PARTS = [
    'sk-or-v1-996f54942eed60552',
    'bbab9c5b43d9f73e9bc623f3',
    '37dd90d0ca5356f14fc5fad'
  ];
  var OPENROUTER_API_KEY = OPENROUTER_API_KEY_PARTS.join('');
  var OPENROUTER_MODELS = [
    'meta-llama/llama-3.3-70b-instruct:free',
    'openai/gpt-oss-20b:free',
    'google/gemma-4-31b-it:free',
    'nousresearch/hermes-3-llama-3.1-405b:free'
  ];
  var REGISTER_URL = 'https://pattycashsystem.web.app/register';

  var I18N = {
    en: {
      title: 'AI Assistant',
      placeholder: 'Ask me anything about petty cash, invoices, or our tools...',
      welcome: 'Hi! I\'m your AI assistant. I can help you with petty cash management, invoices, receipts, and more. How can I help you today?',
      send: 'Send',
      thinking: 'Thinking...',
      ariaLabel: 'AI Assistant chat',
      openChat: 'Open AI Assistant',
      suggestions: [
        'What is petty cash management?',
        'How to create an invoice?',
        'Tell me about Petty Cash System'
      ]
    },
    ar: {
      title: 'المساعد الذكي',
      placeholder: 'اسألني أي شيء عن العهدة أو الفواتير أو أدواتنا...',
      welcome: 'مرحباً! أنا مساعدك الذكي. يمكنني مساعدتك في إدارة العهدة والمصروفات والفواتير والمزيد. كيف يمكنني مساعدتك اليوم؟',
      send: 'إرسال',
      thinking: 'جاري التفكير...',
      ariaLabel: 'دردشة المساعد الذكي',
      openChat: 'افتح المساعد الذكي',
      suggestions: [
        'ما هي إدارة العهدة؟',
        'كيف أنشئ فاتورة؟',
        'أخبرني عن نظام إدارة العهدة'
      ]
    }
  };

  function getLang() {
    var stored = null;
    try {
      stored = localStorage.getItem('pettycash-lang') || localStorage.getItem('marketing_lang');
    } catch (e) {}
    var lang = (stored || document.documentElement.lang || 'en').substring(0, 2).toLowerCase();
    return I18N[lang] ? lang : 'en';
  }

  function injectCSS(isRTL) {
    var pos = isRTL ? 'left' : 'right';
    var css = '' +
      '.ai-fab{position:fixed;' + pos + ':20px;bottom:20px;z-index:99999;width:56px;height:56px;border-radius:50%;' +
      'background:linear-gradient(135deg,#2563eb,#7c3aed);border:none;color:#fff;cursor:pointer;' +
      'box-shadow:0 4px 16px rgba(37,99,235,.4);display:flex;align-items:center;justify-content:center;' +
      'transition:transform .3s ease,box-shadow .3s ease;}' +
      '.ai-fab:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(37,99,235,.5)}' +
      '.ai-fab svg{width:28px;height:28px}' +
      '.ai-fab-badge{position:absolute;top:-2px;' + (isRTL ? 'left:-2px' : 'right:-2px') + ';width:14px;height:14px;' +
      'background:#22c55e;border-radius:50%;border:2px solid #fff;}' +
      '.ai-panel{position:fixed;' + pos + ':20px;bottom:86px;z-index:99999;width:380px;max-width:calc(100vw - 32px);' +
      'height:520px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;' +
      'box-shadow:0 8px 32px rgba(0,0,0,.18);border:1px solid #e2e8f0;display:none;flex-direction:column;' +
      'opacity:0;transform:translateY(20px) scale(.95);transition:opacity .3s ease,transform .3s ease;' +
      'font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;overflow:hidden;}' +
      '.ai-panel.ai-open{display:flex;opacity:1;transform:translateY(0) scale(1)}' +
      '.ai-header{background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;padding:14px 18px;display:flex;' +
      'align-items:center;gap:10px;flex-shrink:0;}' +
      '.ai-header-icon{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.2);' +
      'display:flex;align-items:center;justify-content:center;flex-shrink:0}' +
      '.ai-header-icon svg{width:22px;height:22px}' +
      '.ai-header-text{flex:1;min-width:0}' +
      '.ai-header-text h3{margin:0;font-size:15px;font-weight:700}' +
      '.ai-header-text p{margin:0;font-size:11px;opacity:.85}' +
      '.ai-close{background:rgba(255,255,255,.2);border:none;color:#fff;width:30px;height:30px;border-radius:8px;' +
      'cursor:pointer;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center;' +
      'transition:background .2s;flex-shrink:0}' +
      '.ai-close:hover{background:rgba(255,255,255,.35)}' +
      '.ai-messages{flex:1;overflow-y:auto;padding:16px 18px;display:flex;flex-direction:column;gap:12px;' +
      'scrollbar-width:thin;scrollbar-color:#cbd5e1 transparent}' +
      '.ai-messages::-webkit-scrollbar{width:6px}' +
      '.ai-messages::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}' +
      '.ai-msg{max-width:85%;padding:10px 14px;border-radius:12px;font-size:13.5px;line-height:1.6;word-wrap:break-word;' +
      'white-space:pre-wrap}' +
      '.ai-msg-user{background:#2563eb;color:#fff;align-self:flex-end;border-bottom-' + (isRTL ? 'left' : 'right') + '-radius:4px}' +
      '.ai-msg-bot{background:#f1f5f9;color:#1e293b;align-self:flex-start;border-bottom-' + (isRTL ? 'right' : 'left') + '-radius:4px}' +
      '.ai-msg-bot a{color:#2563eb;text-decoration:underline}' +
      '.ai-typing{display:flex;gap:4px;padding:10px 14px;background:#f1f5f9;border-radius:12px;align-self:flex-start;' +
      'border-bottom-' + (isRTL ? 'right' : 'left') + '-radius:4px}' +
      '.ai-typing span{width:8px;height:8px;border-radius:50%;background:#94a3b8;animation:ai-bounce 1.4s infinite}' +
      '.ai-typing span:nth-child(2){animation-delay:.2s}.ai-typing span:nth-child(3){animation-delay:.4s}' +
      '@keyframes ai-bounce{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-8px);opacity:1}}' +
      '.ai-suggestions{padding:0 18px 8px;display:flex;flex-wrap:wrap;gap:6px;flex-shrink:0}' +
      '.ai-suggestion{background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;padding:6px 12px;border-radius:20px;' +
      'font-size:12px;cursor:pointer;transition:background .2s}' +
      '.ai-suggestion:hover{background:#dbeafe}' +
      '.ai-input-area{padding:12px 18px 16px;border-top:1px solid #e2e8f0;flex-shrink:0;display:flex;gap:8px;align-items:flex-end}' +
      '.ai-input{flex:1;border:1px solid #e2e8f0;border-radius:10px;padding:10px 12px;font-size:13.5px;resize:none;' +
      'font-family:inherit;max-height:80px;outline:none;transition:border-color .2s;line-height:1.5}' +
      '.ai-input:focus{border-color:#2563eb;box-shadow:0 0 0 2px rgba(37,99,235,.15)}' +
      '.ai-send{width:40px;height:40px;border-radius:10px;background:#2563eb;border:none;color:#fff;cursor:pointer;' +
      'display:flex;align-items:center;justify-content:center;transition:background .2s;flex-shrink:0}' +
      '.ai-send:hover{background:#1d4ed8}.ai-send:disabled{background:#94a3b8;cursor:not-allowed}' +
      '.ai-send svg{width:20px;height:20px}' +
      '@media(max-width:480px){.ai-panel{width:calc(100vw - 24px);' + pos + ':12px;bottom:80px;height:calc(100vh - 100px)}' +
      '.ai-fab{' + pos + ':16px;bottom:16px}}' +
      '@media(prefers-color-scheme:dark){.ai-panel{background:#1e293b;border-color:#334155}' +
      '.ai-msg-bot{background:#334155;color:#e2e8f0}.ai-typing{background:#334155}' +
      '.ai-input{background:#0f172a;border-color:#475569;color:#e2e8f0}.ai-input:focus{border-color:#3b82f6}' +
      '.ai-suggestion{background:#1e3a5f;color:#60a5fa;border-color:#1e40af}.ai-suggestion:hover{background:#1e40af}' +
      '.ai-messages::-webkit-scrollbar-thumb{background:#475569}}' +
      '@media(prefers-reduced-motion:reduce){.ai-fab{transition:none}.ai-panel{transition:opacity .2s}}';

    var style = document.createElement('style');
    style.setAttribute('data-ai-assistant', '');
    style.textContent = css;
    document.head.appendChild(style);
  }

  var messages = [];
  var isSending = false;

  function createAssistant() {
    var lang = getLang();
    var isRTL = lang === 'ar';
    var t = I18N[lang];
    injectCSS(isRTL);

    // FAB button
    var fab = document.createElement('button');
    fab.className = 'ai-fab';
    fab.setAttribute('aria-label', t.openChat);
    fab.setAttribute('type', 'button');
    fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10 10 10 0 0 0-10-10z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg><span class="ai-fab-badge"></span>';
    document.body.appendChild(fab);

    // Panel
    var panel = document.createElement('div');
    panel.className = 'ai-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', t.ariaLabel);

    panel.innerHTML =
      '<div class="ai-header">' +
      '<div class="ai-header-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10 10 10 0 0 0-10-10z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg></div>' +
      '<div class="ai-header-text"><h3>' + t.title + '</h3><p>PettyCash.site</p></div>' +
      '<button class="ai-close" aria-label="Close" type="button">&times;</button>' +
      '</div>' +
      '<div class="ai-messages" id="ai-messages"></div>' +
      '<div class="ai-suggestions" id="ai-suggestions"></div>' +
      '<div class="ai-input-area">' +
      '<textarea class="ai-input" id="ai-input" rows="1" placeholder="' + t.placeholder + '" aria-label="' + t.placeholder + '"></textarea>' +
      '<button class="ai-send" id="ai-send" type="button" aria-label="' + t.send + '" disabled><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>' +
      '</div>';

    document.body.appendChild(panel);

    var msgContainer = panel.querySelector('#ai-messages');
    var input = panel.querySelector('#ai-input');
    var sendBtn = panel.querySelector('#ai-send');
    var closeBtn = panel.querySelector('.ai-close');
    var suggContainer = panel.querySelector('#ai-suggestions');
    var header = panel.querySelector('.ai-header');
    var langSelect = document.createElement('select');
    langSelect.className = 'ai-lang-select';
    langSelect.title = 'Language / اللغة';
    langSelect.setAttribute('aria-label', 'Language');
    langSelect.innerHTML = '<option value="en">EN</option><option value="ar">AR</option>';
    langSelect.value = lang;
    langSelect.style.cssText = 'background:rgba(255,255,255,0.2);color:#fff;border:none;border-radius:6px;padding:2px 6px;font-size:12px;cursor:pointer;outline:none;flex-shrink:0;';
    langSelect.addEventListener('change', function(e){
      var code = e.target.value;
      if(code === getLang()) return;
      try {
        localStorage.setItem('pettycash-lang', code);
        localStorage.setItem('marketing_lang', code);
      } catch(err){}
      if(window.PettyCash && window.PettyCash.setLang){ window.PettyCash.setLang(code); }
      else { document.documentElement.lang = code; document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'; }
      window.location.reload();
    });
    if(header) header.appendChild(langSelect);

    // Welcome message
    addMessage(msgContainer, 'bot', t.welcome);
    messages.push({ role: 'assistant', content: t.welcome });

    // Suggestions
    t.suggestions.forEach(function (s) {
      var btn = document.createElement('button');
      btn.className = 'ai-suggestion';
      btn.type = 'button';
      btn.textContent = s;
      btn.addEventListener('click', function () {
        input.value = s;
        input.dispatchEvent(new Event('input'));
        sendMessage();
      });
      suggContainer.appendChild(btn);
    });

    function togglePanel() {
      var isOpen = panel.classList.contains('ai-open');
      if (isOpen) {
        panel.classList.remove('ai-open');
        fab.style.display = 'flex';
      } else {
        panel.classList.add('ai-open');
        fab.style.display = 'none';
        setTimeout(function () { input.focus(); }, 300);
      }
    }

    fab.addEventListener('click', togglePanel);
    closeBtn.addEventListener('click', togglePanel);

    // Auto-resize textarea
    input.addEventListener('input', function () {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 80) + 'px';
      sendBtn.disabled = !input.value.trim() || isSending;
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) sendMessage();
      }
    });

    sendBtn.addEventListener('click', sendMessage);

    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeBtn.click();
    });

    function sendMessage() {
      var text = input.value.trim();
      if (!text || isSending) return;

      addMessage(msgContainer, 'user', text);
      messages.push({ role: 'user', content: text });
      input.value = '';
      input.style.height = 'auto';
      sendBtn.disabled = true;
      suggContainer.style.display = 'none';

      // Typing indicator
      var typing = document.createElement('div');
      typing.className = 'ai-typing';
      typing.id = 'ai-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      msgContainer.appendChild(typing);
      msgContainer.scrollTop = msgContainer.scrollHeight;

      isSending = true;
      sendBtn.disabled = true;

      var systemPrompt = getLang() === 'ar'
        ? 'أنت مساعد ذكي لموقع PettyCash.site، وهو موقع يوفر أدوات مجانية للأعمال (منشئ فواتير، منشئ إيصالات، قسيمة عهدة، أدوات PDF). ' +
          'نظام إدارة العهدة (Petty Cash System) هو تطبيق ويب منفصل على ' + REGISTER_URL + ' ' +
          'يساعد الشركات على إدارة المصروفات والإيصالات والموافقات والتقارير. ' +
          'أجب بإيجاز ووضوح بالعربية. عند ذكر نظام إدارة العهدة، أضف رابط ' + REGISTER_URL
        : 'You are an AI assistant for PettyCash.site, a website offering free business tools (invoice generator, receipt generator, petty cash voucher, PDF tools). ' +
          'The Petty Cash System is a separate web app at ' + REGISTER_URL + ' ' +
          'that helps companies manage expenses, receipts, approvals, and reports. ' +
          'Answer concisely and clearly in English. When mentioning the Petty Cash System, include the link ' + REGISTER_URL;

      var apiMessages = [{ role: 'system', content: systemPrompt }].concat(messages.slice(-10));

      function tryModel(modelIdx) {
        if (modelIdx >= OPENROUTER_MODELS.length) {
          var typingEl = document.getElementById('ai-typing');
          if (typingEl) typingEl.remove();
          isSending = false;
          sendBtn.disabled = !input.value.trim();
          addMessage(msgContainer, 'bot', getLang() === 'ar'
            ? 'عذراً، الخدمة مشغولة حالياً. يرجى المحاولة مرة أخرى بعد قليل.'
            : 'Sorry, the service is busy right now. Please try again in a moment.');
          return;
        }

        var body = {
          model: OPENROUTER_MODELS[modelIdx],
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 600
        };

        fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + OPENROUTER_API_KEY,
            'HTTP-Referer': 'https://www.pettycash.site',
            'X-Title': 'PettyCash.site AI Assistant'
          },
          body: JSON.stringify(body)
        })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            if (data.choices && data.choices[0] && data.choices[0].message) {
              var typingEl = document.getElementById('ai-typing');
              if (typingEl) typingEl.remove();
              isSending = false;
              sendBtn.disabled = !input.value.trim();

              var reply = data.choices[0].message.content;
              reply = reply.replace(/(https?:\/\/[^\s]+)/g, function (url) {
                return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + '</a>';
              });
              addMessage(msgContainer, 'bot', reply, true);
              messages.push({ role: 'assistant', content: reply.replace(/<[^>]*>/g, '') });
            } else if (data.error) {
              tryModel(modelIdx + 1);
            } else {
              var typingEl2 = document.getElementById('ai-typing');
              if (typingEl2) typingEl2.remove();
              isSending = false;
              sendBtn.disabled = !input.value.trim();
              addMessage(msgContainer, 'bot', getLang() === 'ar'
                ? 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.'
                : 'Sorry, I encountered an error. Please try again.');
            }
          })
          .catch(function (err) {
            tryModel(modelIdx + 1);
          });
      }

      tryModel(0);
    }

    function addMessage(container, type, text, isHTML) {
      var msg = document.createElement('div');
      msg.className = 'ai-msg ai-msg-' + type;
      if (isHTML) msg.innerHTML = text;
      else msg.textContent = text;
      container.appendChild(msg);
      container.scrollTop = container.scrollHeight;
    }
  }

  function init() {
    if (document.querySelector('.ai-fab')) return;
    createAssistant();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Rebuild on language change
  window.addEventListener('pctool-lang-change', function () {
    var fab = document.querySelector('.ai-fab');
    var panel = document.querySelector('.ai-panel');
    if (fab) fab.remove();
    if (panel) panel.remove();
    var style = document.querySelector('[data-ai-assistant]');
    if (style) style.remove();
    messages = [];
    isSending = false;
    setTimeout(init, 100);
  });

  window.PettyCashAI = { show: init };
})();
