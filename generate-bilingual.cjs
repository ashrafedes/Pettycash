const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const BASE_HOST = 'https://www.pettycash.site';
const SKIP_FILES = [
  'admin.html', 'admin-new.html', 'cleanup-articles.html',
  'import-articles.html', 'fix-missing-images.html',
  'article.html', 'status.html', 'roadmap.html', 'changelog.html',
  '404.html'
];
const SKIP_DIRS = [
  'node_modules', '.git', 'reports', 'en', 'ar',
  '.playwright-mcp', 'js', 'css', 'images', '.github',
  '__pycache__', '.windsurf'
];

// ─── Load translations.js ───
function loadTranslations() {
  let code = fs.readFileSync(path.join(__dirname, 'js', 'translations.js'), 'utf8');
  // Shim: replace const → var, strip window assignment, add module.exports
  code = code.replace('const TRANSLATIONS=', 'var TRANSLATIONS=');
  code = code.replace(/;window\.TRANSLATIONS=TRANSLATIONS;?\s*$/, '');
  code = 'var window={};\n' + code + '\n;module.exports=TRANSLATIONS;';
  const tmpFile = path.join(__dirname, '__tmp_trans.cjs');
  fs.writeFileSync(tmpFile, code);
  try {
    const T = require(tmpFile);
    fs.unlinkSync(tmpFile);
    // Assertion: ensure AR translations actually loaded
    if (!T.ar || Object.keys(T.ar).length === 0) {
      throw new Error('TRANSLATIONS.ar is empty — shim may have failed');
    }
    if (!T.en || Object.keys(T.en).length === 0) {
      throw new Error('TRANSLATIONS.en is empty — shim may have failed');
    }
    console.log(`Loaded translations: EN=${Object.keys(T.en).length} sections, AR=${Object.keys(T.ar).length} sections`);
    return T;
  } catch (e) {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    throw e;
  }
}

// ─── Lookup a dotted key in the translation object ───
function lookupTranslation(translations, key) {
  const parts = key.split('.');
  let obj = translations;
  for (const part of parts) {
    if (!obj || typeof obj !== 'object' || !(part in obj)) return null;
    obj = obj[part];
  }
  return obj != null ? obj : null;
}

// ─── Find all HTML files to process ───
function findHtmlFiles(dir, base = '') {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.includes(entry.name)) continue;
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    const relPath = base ? base + '/' + entry.name : entry.name;
    if (entry.isDirectory()) {
      results.push(...findHtmlFiles(fullPath, relPath));
    } else if (entry.name.endsWith('.html') && !SKIP_FILES.includes(entry.name)) {
      results.push(relPath.replace(/\\/g, '/'));
    }
  }
  return results;
}

// ─── Fix internal links for /lang/ prefix ───
function fixLinksForFile(html, lang, filePath) {
  const fileDir = path.dirname(filePath);
  const isInSubdir = fileDir !== '.';
  const dirPrefix = isInSubdir ? fileDir.replace(/\\/g, '/') + '/' : '';

  // Pattern 1: href="../..." (from subdir, go to root)
  if (isInSubdir) {
    html = html.replace(/href="\.\.\/([^"]*)"/g, (match, p1) => {
      if (p1.startsWith('http') || p1.startsWith('mailto') || p1.startsWith('tel') || p1.startsWith('#')) return match;
      return 'href="/' + lang + '/' + p1 + '"';
    });
    // ./ → /lang/dirPrefix
    html = html.replace(/href="\.\//g, 'href="/' + lang + '/' + dirPrefix);
  } else {
    // ./ → /lang/
    html = html.replace(/href="\.\//g, 'href="/' + lang + '/');
  }

  // Fix canonical URLs
  html = html.replace(/href="https:\/\/www\.pettycash\.site\/([^"]*)"/g, (match, p1) => {
    if (p1 === '' || p1 === '/') return 'href="https://www.pettycash.site/' + lang + '/"';
    return 'href="https://www.pettycash.site/' + lang + '/' + p1 + '"';
  });

  // Fix og:url
  html = html.replace(/content="https:\/\/www\.pettycash\.site\/([^"]*)"/g, (match, p1) => {
    if (p1 === '' || p1 === '/') return 'content="https://www.pettycash.site/' + lang + '/"';
    return 'content="https://www.pettycash.site/' + lang + '/' + p1 + '"';
  });

  return html;
}

// ─── Apply translations to HTML using cheerio ───
function applyTranslations(html, translations, lang) {
  const $ = cheerio.load(html, { decodeEntities: false });

  // Handle data-i18n (text content / placeholder / attribute)
  $('[data-i18n]').each(function () {
    const key = $(this).attr('data-i18n');
    const i18nAttr = $(this).attr('data-i18n-attr');
    const translated = lookupTranslation(translations, key);
    if (translated == null) return;

    if (i18nAttr) {
      // data-i18n-attr: set the specified attribute
      $(this).attr(i18nAttr, translated);
    } else if (this.tagName === 'input' || this.tagName === 'textarea') {
      // For inputs/textareas: set placeholder if it exists, otherwise value
      if ($(this).attr('placeholder') !== undefined) {
        $(this).attr('placeholder', translated);
      } else {
        $(this).attr('value', translated);
      }
    } else {
      // Default: set text content
      $(this).text(translated);
    }
  });

  // Handle data-i18n-html (innerHTML)
  $('[data-i18n-html]').each(function () {
    const key = $(this).attr('data-i18n-html');
    const translated = lookupTranslation(translations, key);
    if (translated != null) {
      $(this).html(translated);
    }
  });

  return $.html();
}

// ─── Process a single HTML file for a given language ───
function processHtml(rawHtml, lang, filePath, translations) {
  let html = rawHtml;

  // For AR: apply build-time translation substitution
  if (lang === 'ar') {
    html = applyTranslations(html, translations.ar, lang);
  }

  // Set lang and dir on <html> tag
  html = html.replace(/<html\s+lang="[^"]*"\s+dir="[^"]*"/, '<html lang="' + lang + '" dir="' + (lang === 'ar' ? 'rtl' : 'ltr') + '"');
  // Also handle single-quote variant
  html = html.replace(/<html\s+lang='[^']*'\s+dir='[^']*'/, '<html lang="' + lang + '" dir="' + (lang === 'ar' ? 'rtl' : 'ltr') + '"');

  // Fix internal links
  html = fixLinksForFile(html, lang, filePath);

  // Add hreflang tags (before </head>)
  const otherLang = lang === 'en' ? 'ar' : 'en';
  const filePathForUrl = filePath === 'index.html' ? '' : filePath;
  const hreflangTags = '\n  <link rel="alternate" hreflang="en" href="' + BASE_HOST + '/en/' + filePathForUrl + '" />\n  <link rel="alternate" hreflang="ar" href="' + BASE_HOST + '/ar/' + filePathForUrl + '" />\n  <link rel="alternate" hreflang="x-default" href="' + BASE_HOST + '/" />';

  // Only add hreflang if not already present
  if (!html.includes('hreflang="en"')) {
    html = html.replace('</head>', hreflangTags + '\n</head>');
  }

  // Add localStorage preset script at start of <head>
  const langScript = '<script>window.localStorage&&localStorage.setItem(\'pettycash-lang\',\'' + lang + '\');</script>';
  if (!html.includes('pettycash-lang')) {
    html = html.replace('<head>', '<head>' + langScript);
  }

  return html;
}

// ─── Main ───
function main() {
  console.log('=== Bilingual Page Generator (build-time translation) ===\n');

  // Load translations
  const translations = loadTranslations();

  // Find all HTML files
  const files = findHtmlFiles('.');
  console.log('Found ' + files.length + ' HTML pages to process');
  console.log('Generating ' + (files.length * 2) + ' files (EN + AR)...\n');

  let success = 0, fail = 0;

  for (const file of files) {
    const srcPath = path.join(__dirname, file);
    const rawHtml = fs.readFileSync(srcPath, 'utf8');

    for (const lang of ['en', 'ar']) {
      try {
        const processed = processHtml(rawHtml, lang, file, translations);
        const outDir = lang; // 'en' or 'ar'
        const outFile = path.join(__dirname, outDir, file);
        fs.mkdirSync(path.dirname(outFile), { recursive: true });
        fs.writeFileSync(outFile, processed);
        console.log('  ✓ ' + lang.toUpperCase() + ': ' + file);
        success++;
      } catch (e) {
        console.error('  ✗ ' + lang.toUpperCase() + ': ' + file + ' - ' + e.message);
        fail++;
      }
    }
  }

  console.log('\nDone: ' + success + ' files generated, ' + fail + ' failed');
}

main();
