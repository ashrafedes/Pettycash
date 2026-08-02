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

// ─── Asset extensions that should resolve to root / ───
const ASSET_EXTS = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
  '.webp', '.woff', '.woff2', '.ttf', '.eot', '.otf', '.mp4', '.webm',
  '.ogg', '.mp3', '.wav', '.json', '.xml', '.txt', '.webmanifest', '.pdf'];

function isAssetPath(p) {
  // Strip query string and hash
  const clean = p.split('?')[0].split('#')[0];
  const lower = clean.toLowerCase();
  // Check if it ends with an asset extension
  for (const ext of ASSET_EXTS) {
    if (lower.endsWith(ext)) return true;
  }
  // No extension and not ending in / → could be a directory or a page
  // If it has no dot at all in the last segment, treat as page (directory index)
  return false;
}

function isExternalUrl(p) {
  return p.startsWith('http') || p.startsWith('https') || p.startsWith('//') ||
    p.startsWith('mailto:') || p.startsWith('tel:') || p.startsWith('#') ||
    p.startsWith('data:') || p.startsWith('blob:');
}

// ─── Resolve a relative path against a file path to an absolute path ───
function resolveRelative(relPath, filePath) {
  const fileDir = path.dirname(filePath);
  const resolved = path.normalize(path.join(fileDir, relPath)).replace(/\\/g, '/');
  return resolved;
}

// ─── Fix internal links and asset paths for /lang/ prefix ───
function fixLinksForFile(html, lang, filePath) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const fileDir = path.dirname(filePath);
  const isInSubdir = fileDir !== '.';

  // Fix href attributes on link, a tags
  $('[href]').each(function () {
    const href = $(this).attr('href');
    if (!href || isExternalUrl(href)) return;

    // Handle relative paths (./ or ../)
    if (href.startsWith('./') || href.startsWith('../')) {
      const resolved = resolveRelative(href, filePath);

      if (isAssetPath(resolved)) {
        // Asset → resolve to root /
        $(this).attr('href', '/' + resolved);
      } else {
        // Page link → prefix with /lang/
        $(this).attr('href', '/' + lang + '/' + resolved);
      }
    } else if (href.startsWith('/') && !href.startsWith('//')) {
      // Already absolute path starting with / — check if it's an asset or page
      // Leave absolute paths as-is (they should already be correct)
      // But fix any that were previously mangled to /en/ or /ar/ for assets
      const cleanPath = href.split('?')[0].split('#')[0];
      if (isAssetPath(cleanPath)) {
        // Strip /en/ or /ar/ prefix from asset paths
        const stripped = cleanPath.replace(/^\/(en|ar)\//, '/');
        if (stripped !== cleanPath) {
          // Re-add query/hash
          const queryHash = href.substring(cleanPath.length);
          $(this).attr('href', stripped + queryHash);
        }
      }
    }
  });

  // Fix src attributes on script, img, etc.
  $('[src]').each(function () {
    const src = $(this).attr('src');
    if (!src || isExternalUrl(src)) return;

    if (src.startsWith('./') || src.startsWith('../')) {
      const resolved = resolveRelative(src, filePath);

      if (isAssetPath(resolved)) {
        // Asset → resolve to root /
        $(this).attr('src', '/' + resolved);
      } else {
        // Page link → prefix with /lang/
        $(this).attr('src', '/' + lang + '/' + resolved);
      }
    } else if (src.startsWith('/') && !src.startsWith('//')) {
      // Strip /en/ or /ar/ prefix from asset paths
      const cleanPath = src.split('?')[0].split('#')[0];
      if (isAssetPath(cleanPath)) {
        const stripped = cleanPath.replace(/^\/(en|ar)\//, '/');
        if (stripped !== cleanPath) {
          const queryHash = src.substring(cleanPath.length);
          $(this).attr('src', stripped + queryHash);
        }
      }
    }
  });

  // Fix content attributes (og:url, og:image, twitter:image, etc.)
  $('[content]').each(function () {
    const content = $(this).attr('content');
    if (!content || !content.includes('pettycash.site')) return;

    $(this).attr('content', content.replace(
      /https:\/\/www\.pettycash\.site\/([^"\s]*)/g,
      (match, p1) => {
        if (p1 === '' || p1 === '/') return 'https://www.pettycash.site/' + lang + '/';
        // If it's an asset path (images/, css/, js/), don't add /lang/ prefix
        if (isAssetPath(p1) || /^(images|css|js)\//.test(p1)) {
          return 'https://www.pettycash.site/' + p1;
        }
        return 'https://www.pettycash.site/' + lang + '/' + p1;
      }
    ));
  });

  // Fix canonical link href
  $('link[rel="canonical"]').each(function () {
    const href = $(this).attr('href');
    if (!href || !href.includes('pettycash.site')) return;
    $(this).attr('href', href.replace(
      /https:\/\/www\.pettycash\.site\/([^"\s]*)/g,
      (match, p1) => {
        if (p1 === '' || p1 === '/') return 'https://www.pettycash.site/' + lang + '/';
        return 'https://www.pettycash.site/' + lang + '/' + p1;
      }
    ));
  });

  return $.html();
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

// ─── Fix ./ paths inside inline <script> tags (e.g. ES module imports) ───
function fixInlineScriptPaths(html, lang, filePath) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const fileDir = path.dirname(filePath);

  $('script:not([src])').each(function () {
    let code = $(this).html();
    if (!code) return;

    // Fix import ... from './...' and import ... from "../..."
    code = code.replace(/from\s+['"](\.\.?\/[^'"]+)['"]/g, (match, relPath) => {
      const resolved = resolveRelative(relPath, filePath);
      if (isAssetPath(resolved)) {
        return match.replace(relPath, '/' + resolved);
      } else {
        return match.replace(relPath, '/' + lang + '/' + resolved);
      }
    });

    // Fix any remaining string literals with ./ that look like paths
    // e.g. "./images/foo.png" or "./js/bar.js"
    code = code.replace(/['"](\.\/[^'"]+)['"]/g, (match, relPath) => {
      // Skip if it's already been handled or doesn't look like a file path
      if (!relPath.includes('.')) return match;
      const resolved = resolveRelative(relPath, filePath);
      if (isAssetPath(resolved)) {
        return match.replace(relPath, '/' + resolved);
      }
      return match;
    });

    $(this).html(code);
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

  // Fix internal links and asset paths
  html = fixLinksForFile(html, lang, filePath);

  // Fix ./ paths inside inline <script> tags (e.g. ES module imports)
  html = fixInlineScriptPaths(html, lang, filePath);

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
