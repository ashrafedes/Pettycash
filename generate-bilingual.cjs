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

// ─── Build reverse map: English string → Arabic string ───
function buildReverseMap(translations) {
  const map = {};
  function walk(enObj, arObj) {
    if (typeof enObj === 'string' && typeof arObj === 'string') {
      map[enObj] = arObj;
    } else if (enObj && arObj && typeof enObj === 'object') {
      for (const key of Object.keys(enObj)) {
        if (key in arObj) walk(enObj[key], arObj[key]);
      }
    }
  }
  walk(translations.en, translations.ar);
  return map;
}

// ─── Cp437→Unicode reverse map for mojibake fix ───
const _cp437Map = {
  0xC7:0x80,0xFC:0x81,0xE9:0x82,0xE2:0x83,0xE4:0x84,0xE0:0x85,0xE5:0x86,0xE7:0x87,
  0xEA:0x88,0xEB:0x89,0xE8:0x8A,0xEF:0x8B,0xEE:0x8C,0xEC:0x8D,0xC4:0x8E,0xC5:0x8F,
  0xC9:0x90,0xE6:0x91,0xC6:0x92,0xF4:0x93,0xF6:0x94,0xF2:0x95,0xFB:0x96,0xF9:0x97,
  0xFF:0x98,0xD6:0x99,0xDC:0x9A,0xA2:0x9B,0xA3:0x9C,0xA5:0x9D,0x20AC:0x9E,0x192:0x9F,
  0xE1:0xA0,0xED:0xA1,0xF3:0xA2,0xFA:0xA3,0xF1:0xA4,0xD1:0xA5,0xAA:0xA6,0xBA:0xA7,
  0xBF:0xA8,0x2310:0xA9,0xAC:0xAA,0xBD:0xAB,0xBC:0xAC,0xA1:0xAD,0xAB:0xAE,0xBB:0xAF,
  0x2591:0xB0,0x2592:0xB1,0x2593:0xB2,0x2502:0xB3,0x2524:0xB4,0x2561:0xB5,0x2562:0xB6,
  0x2556:0xB7,0x2555:0xB8,0x2563:0xB9,0x2551:0xBA,0x2557:0xBB,0x255D:0xBC,0x255C:0xBD,
  0x255B:0xBE,0x2510:0xBF,0x2514:0xC0,0x2534:0xC1,0x252C:0xC2,0x251C:0xC3,0x2500:0xC4,
  0x253C:0xC5,0x255E:0xC6,0x255F:0xC7,0x255A:0xC8,0x2554:0xC9,0x2569:0xCA,0x2566:0xCB,
  0x2560:0xCC,0x2550:0xCD,0x256C:0xCE,0x2567:0xCF,0x2568:0xD0,0x2564:0xD1,0x2565:0xD2,
  0x2559:0xD3,0x2558:0xD4,0x2552:0xD5,0x2553:0xD6,0x256B:0xD7,0x256A:0xD8,0x2518:0xD9,
  0x250C:0xDA,0x2588:0xDB,0x2584:0xDC,0x258C:0xDD,0x2590:0xDE,0x2580:0xDF,
  0x03B1:0xE0,0x03B2:0xE1,0x0393:0xE2,0x03C0:0xE3,0x03A3:0xE4,0x03C3:0xE5,0x03BC:0xE6,
  0x03C4:0xE7,0x03A6:0xE8,0x0398:0xE9,0x03A9:0xEA,0x03B4:0xEB,0x221E:0xEC,0x03C6:0xED,
  0x03B5:0xEE,0x2229:0xEF,0x2261:0xF0,0x00B1:0xF1,0x2265:0xF2,0x2264:0xF3,0x2320:0xF4,
  0x2321:0xF5,0x00F7:0xF6,0x2248:0xF7,0x00B0:0xF8,0x2219:0xF9,0x00B7:0xFA,0x221A:0xFB,
  0x207F:0xFC,0x00B2:0xFD,0x25A0:0xFE,0x00A0:0xFF
};
const _unicodeToCp437 = {};
for (const [u, b] of Object.entries(_cp437Map)) {
  _unicodeToCp437[String.fromCharCode(parseInt(u))] = b;
}
for (let i = 0x20; i <= 0x7E; i++) _unicodeToCp437[String.fromCharCode(i)] = i;

// ─── Fix mojibake: Cp437-misinterpreted UTF-8 → proper text ───
function fixMojibake(str) {
  if (!str || !/[\u2500-\u257F]/.test(str)) return str;
  const bytes = [];
  for (const ch of str) {
    const b = _unicodeToCp437[ch];
    if (b !== undefined) bytes.push(b);
    else bytes.push(ch.charCodeAt(0));
  }
  try {
    const decoded = Buffer.from(bytes).toString('utf8');
    // Verify it's valid Arabic/text (not more garbage)
    if (/[\u0600-\u06FF]/.test(decoded)) return decoded;
    return str;
  } catch (e) {
    return str;
  }
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
      // Skip redirect stubs — they would generate self-redirecting pages in en/ar
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.length < 500 && /meta\s+http-equiv.*refresh.*url=/i.test(content)) {
        continue; // skip stub
      }
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
function applyTranslations(html, translations, lang, reverseMap) {
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

  // Handle data-i18n-en / data-i18n-ar (inline bilingual text)
  // Set textContent from the matching language attribute
  $('[data-i18n-en], [data-i18n-ar]').each(function () {
    let val = $(this).attr('data-i18n-' + lang);
    if (val && val.length > 0) {
      // Fix mojibake (Cp437-misinterpreted UTF-8) in Arabic attributes
      if (lang === 'ar' && /[\u2500-\u257F]/.test(val)) {
        const fixed = fixMojibake(val);
        if (fixed !== val) {
          $(this).attr('data-i18n-ar', fixed);
          val = fixed;
        }
      }
      $(this).text(val);
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
function processHtml(rawHtml, lang, filePath, translations, reverseMap) {
  let html = rawHtml;

  // For AR: apply build-time translation substitution
  if (lang === 'ar') {
    html = applyTranslations(html, translations.ar, lang, reverseMap);
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
  const reverseMap = buildReverseMap(translations);
  console.log('Reverse map: ' + Object.keys(reverseMap).length + ' EN→AR entries');

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
        const processed = processHtml(rawHtml, lang, file, translations, reverseMap);
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
