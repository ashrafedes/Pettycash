// AI Presentation Generator
(function () {
  'use strict';

  // OpenRouter API key (same as ai-assistant.js)
  const API_KEY = ['sk-or-v1-996f54942eed60552', 'bbab9c5b43d9f73e9bc623f3', '37dd90d0ca5356f14fc5fad'].join('');
  const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  const MODELS = ['meta-llama/llama-3.3-70b-instruct:free', 'openai/gpt-oss-20b:free', 'google/gemma-4-31b-it:free'];

  // Design themes
  const THEMES = {
    corporate: {
      bg: '#1e3a5f', bgGradient: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
      title: '#ffffff', text: '#e0e7ff', accent: '#60a5fa',
      slideBg: '#ffffff', slideTitle: '#1e3a5f', slideText: '#334155'
    },
    modern: {
      bg: '#0f172a', bgGradient: 'linear-gradient(135deg, #0f172a, #334155)',
      title: '#f8fafc', text: '#cbd5e1', accent: '#818cf8',
      slideBg: '#ffffff', slideTitle: '#0f172a', slideText: '#475569'
    },
    bold: {
      bg: '#7c2d12', bgGradient: 'linear-gradient(135deg, #dc2626, #f97316)',
      title: '#ffffff', text: '#fef3c7', accent: '#fbbf24',
      slideBg: '#ffffff', slideTitle: '#dc2626', slideText: '#7c2d12'
    },
    elegant: {
      bg: '#18181b', bgGradient: 'linear-gradient(135deg, #18181b, #3f3f46)',
      title: '#fafafa', text: '#d4d4d8', accent: '#a78bfa',
      slideBg: '#fafafa', slideTitle: '#18181b', slideText: '#52525b'
    },
    warm: {
      bg: '#44403c', bgGradient: 'linear-gradient(135deg, #78350f, #b45309)',
      title: '#ffffff', text: '#fef3c7', accent: '#fbbf24',
      slideBg: '#fffbeb', slideTitle: '#78350f', slideText: '#57534e'
    }
  };

  let slides = [];
  let currentSlideIdx = 0;
  let currentTheme = 'corporate';
  let isEditing = false;

  // ─── i18n helper ───
  function tt(en, ar) {
    const lang = (typeof PCTools !== 'undefined' && PCTools.currentLang) || 'en';
    return lang === 'ar' ? ar : en;
  }

  // ─── AI API call ───
  async function generateWithAI(topic, slideCount, lang) {
    const systemPrompt = lang === 'ar'
      ? 'أنت مساعد ذكي متخصص في إنشاء العروض التقديمية الاحترافية. قم بإنشاء شرائح باللغة العربية.'
      : 'You are a professional presentation designer. Create engaging, well-structured slides.';

    const userPrompt = lang === 'ar'
      ? `أنشئ عرضًا تقديميًا احترافيًا عن: "${topic}". العرض يحتوي على ${slideCount} شرائح. الشريحة الأولى هي عنوان والشريحة الأخيرة هي شكر.

أعد النتيجة كـ JSON صالح فقط (بدون نص إضافي) بهذا التنسيق:
{
  "title": "عنوان العرض",
  "slides": [
    {
      "layout": "title" | "content" | "two-column" | "image",
      "title": "عنوان الشريحة",
      "subtitle": "عنوان فرعي (للشريحة الأولى فقط)",
      "bullets": ["نقطة 1", "نقطة 2", "نقطة 3"],
      "notes": "ملاحظات المتحدث",
      "columns": [["نقطة 1", "نقطة 2"], ["نقطة 1", "نقطة 2"]]
    }
  ]
}

استخدم layouts متنوعة. اجعل النقاط موجزة وواضحة.`
      : `Create a professional presentation about: "${topic}". The presentation should have ${slideCount} slides. First slide is a title slide, last slide is a thank you slide.

Return ONLY valid JSON (no extra text) in this format:
{
  "title": "Presentation Title",
  "slides": [
    {
      "layout": "title" | "content" | "two-column" | "image",
      "title": "Slide Title",
      "subtitle": "Subtitle (for first slide only)",
      "bullets": ["Point 1", "Point 2", "Point 3"],
      "notes": "Speaker notes",
      "columns": [["Point 1", "Point 2"], ["Point 1", "Point 2"]]
    }
  ]
}

Use varied layouts. Keep bullet points concise and impactful.`;

    const body = {
      model: MODELS[0],
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    };

    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'PettyCash AI Presentation Generator'
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      // Try fallback model
      body.model = MODELS[1];
      const resp2 = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + API_KEY,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'PettyCash AI Presentation Generator'
        },
        body: JSON.stringify(body)
      });
      if (!resp2.ok) throw new Error('AI API error: ' + resp2.status);
      const data2 = await resp2.json();
      return parseAIResponse(data2);
    }

    const data = await resp.json();
    return parseAIResponse(data);
  }

  function parseAIResponse(data) {
    const content = data.choices?.[0]?.message?.content || '';
    try {
      const parsed = JSON.parse(content);
      if (parsed.slides && Array.isArray(parsed.slides)) {
        return parsed;
      }
    } catch (e) {
      // Try to extract JSON from text
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          const parsed = JSON.parse(match[0]);
          if (parsed.slides && Array.isArray(parsed.slides)) return parsed;
        } catch (e2) {}
      }
    }
    throw new Error('Failed to parse AI response');
  }

  // ─── Slide rendering ───
  function getTheme() { return THEMES[currentTheme] || THEMES.corporate; }

  function renderSlide(slide, idx, total) {
    const theme = getTheme();
    const isRTL = (typeof PCTools !== 'undefined' && PCTools.currentLang === 'ar') || slide._lang === 'ar';
    const dir = isRTL ? 'rtl' : 'ltr';

    if (slide.layout === 'title') {
      return `
        <div dir="${dir}" style="background: ${theme.bgGradient}; min-height: 400px; padding: 60px 40px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-family: 'Inter', sans-serif;">
          <h1 style="color: ${theme.title}; font-size: 2.5rem; font-weight: 800; margin: 0 0 16px; line-height: 1.2;">${escapeHtml(slide.title || '')}</h1>
          ${slide.subtitle ? `<p style="color: ${theme.text}; font-size: 1.25rem; margin: 0; opacity: 0.9;">${escapeHtml(slide.subtitle)}</p>` : ''}
          <div style="margin-top: 40px; width: 60px; height: 4px; background: ${theme.accent}; border-radius: 2px;"></div>
        </div>`;
    }

    if (slide.layout === 'two-column' && slide.columns) {
      const cols = slide.columns.map((col, i) => {
        const bullets = (col || []).map(b => `<li style="margin-bottom: 8px; font-size: 0.95rem; color: ${theme.slideText};">${escapeHtml(b)}</li>`).join('');
        return `<div style="flex: 1;"><ul style="list-style: none; padding: 0; margin: 0;">${bullets}</ul></div>`;
      }).join('');
      return `
        <div dir="${dir}" style="background: ${theme.slideBg}; min-height: 400px; padding: 50px 40px; font-family: 'Inter', sans-serif;">
          <h2 style="color: ${theme.slideTitle}; font-size: 1.75rem; font-weight: 700; margin: 0 0 24px; border-bottom: 3px solid ${theme.accent}; padding-bottom: 12px;">${escapeHtml(slide.title || '')}</h2>
          <div style="display: flex; gap: 32px;">${cols}</div>
          ${renderSlideFooter(idx, total, theme)}
        </div>`;
    }

    // Default: content layout
    const bullets = (slide.bullets || []).map(b => `
      <li style="margin-bottom: 12px; font-size: 1.05rem; color: ${theme.slideText}; display: flex; align-items: start; gap: 10px;">
        <span style="color: ${theme.accent}; flex-shrink: 0; margin-top: 6px; width: 8px; height: 8px; border-radius: 50%; background: ${theme.accent};"></span>
        <span>${escapeHtml(b)}</span>
      </li>`).join('');

    return `
      <div dir="${dir}" style="background: ${theme.slideBg}; min-height: 400px; padding: 50px 40px; font-family: 'Inter', sans-serif;">
        <h2 style="color: ${theme.slideTitle}; font-size: 1.75rem; font-weight: 700; margin: 0 0 24px; border-bottom: 3px solid ${theme.accent}; padding-bottom: 12px;">${escapeHtml(slide.title || '')}</h2>
        ${bullets ? `<ul style="list-style: none; padding: 0; margin: 0;">${bullets}</ul>` : `<p style="color: ${theme.slideText}; font-size: 1.1rem;">${escapeHtml(slide.notes || '')}</p>`}
        ${renderSlideFooter(idx, total, theme)}
      </div>`;
  }

  function renderSlideFooter(idx, total, theme) {
    return `<div style="position: absolute; bottom: 20px; right: 40px; font-size: 0.75rem; color: #94a3b8;">${idx + 1} / ${total}</div>`;
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderSlideNav() {
    const nav = document.getElementById('preso-slide-nav');
    if (!nav) return;
    nav.innerHTML = slides.map((s, i) => {
      const active = i === currentSlideIdx;
      const title = (s.title || 'Slide ' + (i + 1)).substring(0, 30);
      return `<button class="preso-nav-btn px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${active ? 'bg-violet-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-violet-400'}" data-idx="${i}">
        ${i + 1}. ${escapeHtml(title)}
      </button>`;
    }).join('');

    nav.querySelectorAll('.preso-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentSlideIdx = parseInt(btn.dataset.idx);
        renderSlidePreview();
        renderSlideNav();
        if (isEditing) renderEditor();
      });
    });
  }

  function renderSlidePreview() {
    const container = document.getElementById('preso-slide-preview');
    if (!container || !slides.length) return;
    const slide = slides[currentSlideIdx];
    container.innerHTML = `<div style="position: relative; aspect-ratio: 16/9;">${renderSlide(slide, currentSlideIdx, slides.length)}</div>`;
  }

  // ─── Editor ───
  function renderEditor() {
    const container = document.getElementById('preso-editor-slides');
    if (!container) return;
    container.innerHTML = slides.map((s, i) => {
      const bullets = (s.bullets || []).map((b, bi) => `
        <div class="flex gap-2 mb-2">
          <input type="text" class="form-input flex-1 preso-bullet-input" data-slide="${i}" data-bullet="${bi}" value="${escapeHtml(b)}">
          <button class="btn-secondary px-2 preso-del-bullet" data-slide="${i}" data-bullet="${bi}">×</button>
        </div>`).join('');

      return `
        <div class="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-sm font-bold text-slate-500">#${i + 1}</span>
            <select class="form-input w-32 preso-layout-select" data-slide="${i}">
              <option value="content" ${s.layout === 'content' ? 'selected' : ''}>Content</option>
              <option value="title" ${s.layout === 'title' ? 'selected' : ''}>Title</option>
              <option value="two-column" ${s.layout === 'two-column' ? 'selected' : ''}>Two Column</option>
            </select>
            <input type="text" class="form-input flex-1 preso-title-input" data-slide="${i}" value="${escapeHtml(s.title || '')}" placeholder="Slide title">
            <button class="btn-secondary px-2 preso-del-slide" data-slide="${i}">×</button>
          </div>
          <div class="space-y-1">${bullets}</div>
          <button class="btn-secondary text-xs mt-2 preso-add-bullet" data-slide="${i}">+ Add bullet</button>
          <textarea class="form-input mt-3 preso-notes-input" data-slide="${i}" rows="2" placeholder="Speaker notes">${escapeHtml(s.notes || '')}</textarea>
        </div>`;
    }).join('');

    // Attach editor events
    container.querySelectorAll('.preso-title-input').forEach(el => {
      el.addEventListener('input', (e) => {
        slides[parseInt(e.target.dataset.slide)].title = e.target.value;
        renderSlidePreview();
        renderSlideNav();
      });
    });
    container.querySelectorAll('.preso-layout-select').forEach(el => {
      el.addEventListener('change', (e) => {
        slides[parseInt(e.target.dataset.slide)].layout = e.target.value;
        renderSlidePreview();
      });
    });
    container.querySelectorAll('.preso-bullet-input').forEach(el => {
      el.addEventListener('input', (e) => {
        slides[parseInt(e.target.dataset.slide)].bullets[parseInt(e.target.dataset.bullet)] = e.target.value;
        renderSlidePreview();
      });
    });
    container.querySelectorAll('.preso-notes-input').forEach(el => {
      el.addEventListener('input', (e) => {
        slides[parseInt(e.target.dataset.slide)].notes = e.target.value;
      });
    });
    container.querySelectorAll('.preso-del-bullet').forEach(el => {
      el.addEventListener('click', (e) => {
        const si = parseInt(e.target.dataset.slide);
        const bi = parseInt(e.target.dataset.bullet);
        slides[si].bullets.splice(bi, 1);
        renderEditor();
        renderSlidePreview();
      });
    });
    container.querySelectorAll('.preso-add-bullet').forEach(el => {
      el.addEventListener('click', (e) => {
        const si = parseInt(e.target.dataset.slide);
        if (!slides[si].bullets) slides[si].bullets = [];
        slides[si].bullets.push('');
        renderEditor();
      });
    });
    container.querySelectorAll('.preso-del-slide').forEach(el => {
      el.addEventListener('click', (e) => {
        const si = parseInt(e.target.dataset.slide);
        slides.splice(si, 1);
        if (currentSlideIdx >= slides.length) currentSlideIdx = slides.length - 1;
        renderEditor();
        renderSlidePreview();
        renderSlideNav();
      });
    });
  }

  // ─── PPTX Export ───
  async function ensurePptxLib() {
    if (typeof PptxGenJS === 'undefined') {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.min.js';
        s.async = true;
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      });
    }
  }

  async function downloadPPTX() {
    if (!slides.length) return;
    if (typeof PCTools !== 'undefined') PCTools.toast(tt('Preparing PPTX...', 'جاري تحضير PPTX...'));

    await ensurePptxLib();
    const theme = getTheme();
    const isRTL = (typeof PCTools !== 'undefined' && PCTools.currentLang === 'ar');
    const lang = document.getElementById('preso-content-lang')?.value || 'en';

    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: 'Custom', width: 13.333, height: 7.5 });
    pptx.layout = 'LAYOUT_WIDE';
    pptx.rtlMode = lang === 'ar';

    slides.forEach((slide, idx) => {
      const s = pptx.addSlide();

      if (slide.layout === 'title') {
        s.background = { color: theme.bg.replace('#', '') };
        s.addText(slide.title || '', {
          x: 0.5, y: 2.5, w: 12.3, h: 1.5,
          fontSize: 36, bold: true, color: theme.title.replace('#', ''),
          align: 'center', fontFace: 'Arial',
          rtlMode: lang === 'ar'
        });
        if (slide.subtitle) {
          s.addText(slide.subtitle, {
            x: 0.5, y: 4, w: 12.3, h: 0.8,
            fontSize: 20, color: theme.text.replace('#', ''),
            align: 'center', fontFace: 'Arial',
            rtlMode: lang === 'ar'
          });
        }
      } else if (slide.layout === 'two-column' && slide.columns) {
        s.background = { color: theme.slideBg.replace('#', '') };
        s.addText(slide.title || '', {
          x: 0.5, y: 0.3, w: 12.3, h: 0.8,
          fontSize: 24, bold: true, color: theme.slideTitle.replace('#', ''),
          fontFace: 'Arial',
          rtlMode: lang === 'ar'
        });
        // Accent line
        s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.1, w: 2, h: 0.05, fill: { color: theme.accent.replace('#', '') } });

        const colWidth = 5.8;
        slide.columns.forEach((col, ci) => {
          const x = ci === 0 ? 0.5 : 7;
          const bullets = (col || []).map(b => ({ text: b, options: { bullet: { code: '2022' }, color: theme.slideText.replace('#', ''), fontSize: 14, fontFace: 'Arial', breakLine: true, rtlMode: lang === 'ar' } }));
          if (bullets.length) {
            s.addText(bullets, { x, y: 1.5, w: colWidth, h: 5, valign: 'top' });
          }
        });
      } else {
        // Content slide
        s.background = { color: theme.slideBg.replace('#', '') };
        s.addText(slide.title || '', {
          x: 0.5, y: 0.3, w: 12.3, h: 0.8,
          fontSize: 24, bold: true, color: theme.slideTitle.replace('#', ''),
          fontFace: 'Arial',
          rtlMode: lang === 'ar'
        });
        // Accent line
        s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.1, w: 2, h: 0.05, fill: { color: theme.accent.replace('#', '') } });

        if (slide.bullets && slide.bullets.length) {
          const bullets = slide.bullets.map(b => ({
            text: b,
            options: {
              bullet: { code: '2022' },
              color: theme.slideText.replace('#', ''),
              fontSize: 16, fontFace: 'Arial',
              breakLine: true,
              paraSpaceAfter: 8,
              rtlMode: lang === 'ar'
            }
          }));
          s.addText(bullets, { x: 0.8, y: 1.5, w: 11.7, h: 5, valign: 'top' });
        }
      }

      // Slide number
      s.addText(`${idx + 1} / ${slides.length}`, {
        x: 11.5, y: 7, w: 1.3, h: 0.4,
        fontSize: 9, color: '94A3B8', align: 'right',
        fontFace: 'Arial'
      });

      // Speaker notes
      if (slide.notes) {
        s.addNotes(slide.notes);
      }
    });

    const filename = (slides[0]?.title || 'presentation').replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_').substring(0, 50);
    pptx.writeFile({ fileName: filename + '.pptx' });
    if (typeof PCTools !== 'undefined') PCTools.toast(tt('Downloaded!', 'تم التحميل!'));
  }

  // ─── Init ───
  function init() {
    if (typeof PCTools === 'undefined') {
      setTimeout(init, 100);
      return;
    }

    PCTools.renderNav();
    PCTools.initTheme();
    document.getElementById('pctool-theme')?.addEventListener('click', PCTools.toggleTheme);
    PCTools.setLang(PCTools.currentLang);

    const btnGenerate = document.getElementById('preso-generate');
    const btnDownload = document.getElementById('preso-download-pptx');
    const btnEdit = document.getElementById('preso-edit');
    const btnRetry = document.getElementById('preso-retry');
    const btnAddSlide = document.getElementById('preso-add-slide');

    btnGenerate?.addEventListener('click', handleGenerate);
    btnDownload?.addEventListener('click', downloadPPTX);
    btnRetry?.addEventListener('click', handleGenerate);
    btnEdit?.addEventListener('click', () => {
      isEditing = !isEditing;
      const editor = document.getElementById('preso-editor');
      if (isEditing) {
        editor.classList.remove('hidden');
        renderEditor();
        btnEdit.querySelector('span').textContent = tt('Done', 'تم');
      } else {
        editor.classList.add('hidden');
        btnEdit.querySelector('span').textContent = tt('Edit', 'تعديل');
      }
    });

    btnAddSlide?.addEventListener('click', () => {
      slides.push({ layout: 'content', title: '', bullets: [''], notes: '' });
      currentSlideIdx = slides.length - 1;
      renderEditor();
      renderSlidePreview();
      renderSlideNav();
    });

    // Style change updates theme
    document.getElementById('preso-style')?.addEventListener('change', (e) => {
      currentTheme = e.target.value;
      if (slides.length) renderSlidePreview();
    });

    // Content language change updates RTL
    document.getElementById('preso-content-lang')?.addEventListener('change', () => {
      if (slides.length) renderSlidePreview();
    });

    // Lang change re-renders
    window.addEventListener('pctool-lang-change', () => {
      PCTools.renderNav();
      if (slides.length) {
        renderSlidePreview();
        renderSlideNav();
      }
    });
  }

  async function handleGenerate() {
    const topic = document.getElementById('preso-topic')?.value?.trim();
    if (!topic) {
      if (typeof PCTools !== 'undefined') PCTools.toast(tt('Please enter a topic', 'الرجاء إدخال موضوع'));
      return;
    }

    const slideCount = parseInt(document.getElementById('preso-slide-count')?.value || '8');
    const lang = document.getElementById('preso-content-lang')?.value || 'en';
    currentTheme = document.getElementById('preso-style')?.value || 'corporate';

    // Show loading
    document.getElementById('preso-form').classList.add('hidden');
    document.getElementById('preso-error').classList.add('hidden');
    document.getElementById('preso-results').classList.add('hidden');
    document.getElementById('preso-loading').classList.remove('hidden');
    const progressEl = document.getElementById('preso-progress');
    if (progressEl) progressEl.textContent = tt('Connecting to AI...', 'جاري الاتصال بالذكاء الاصطناعي...');

    try {
      if (progressEl) progressEl.textContent = tt('Generating slides...', 'جاري توليد الشرائح...');
      const result = await generateWithAI(topic, slideCount, lang);

      slides = result.slides.map(s => ({ ...s, _lang: lang }));
      currentSlideIdx = 0;

      document.getElementById('preso-loading').classList.add('hidden');
      document.getElementById('preso-results').classList.remove('hidden');

      renderSlidePreview();
      renderSlideNav();

      if (typeof PCTools !== 'undefined') PCTools.toast(tt('Presentation generated!', 'تم توليد العرض!'));
    } catch (err) {
      console.error('Generation error:', err);
      document.getElementById('preso-loading').classList.add('hidden');
      document.getElementById('preso-error').classList.remove('hidden');
      const errMsg = document.getElementById('preso-error-msg');
      if (errMsg) errMsg.textContent = tt(
        'Failed to generate presentation. Please try again.',
        'فشل في توليد العرض التقديمي. يرجى المحاولة مرة أخرى.'
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
