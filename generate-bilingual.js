const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:9091';
const OUT_DIRS = { en: 'en', ar: 'ar' };

// Skip internal/admin pages
const skipFiles = ['admin.html', 'admin-new.html', 'cleanup-articles.html', 'import-articles.html', 'fix-missing-images.html', 'article.html', 'status.html', 'roadmap.html', 'changelog.html'];

function findHtmlFiles(dir, base = '') {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', '.git', 'reports', 'en', 'ar', '.playwright-mcp', 'js'].includes(entry.name)) continue;
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results.push(...findHtmlFiles(fullPath, relPath));
    } else if (entry.name.endsWith('.html') && !skipFiles.includes(entry.name)) {
      results.push(relPath.replace(/\\/g, '/'));
    }
  }
  return results;
}

// Fix internal links to include /en/ or /ar/ prefix
function fixLinks(html, lang) {
  // Fix relative links to other HTML pages
  // Patterns: href="./page.html", href="../page.html", href="./dir/", href="../dir/"
  // Also: href="./", href="../"
  
  // Don't touch external links (http, https, mailto, tel, #)
  // Don't touch links to the SaaS app (pattycashsystem.web.app)
  
  // Strategy: replace relative paths with /lang/ prefixed absolute paths
  // ./page.html -> /en/page.html
  // ../page.html -> /en/page.html (from subdirectory)
  // ./dir/ -> /en/dir/
  // ./ -> /en/ (for index)
  // ../ -> /en/ (from subdirectory to root)
  
  // For files in subdirectories like industries/construction.html:
  // ../ becomes /lang/ (go up to root, then into lang)
  // ./ becomes /lang/industries/ (current directory)
  
  // We need to know the depth of the current file to resolve relative paths
  // This is handled per-file by passing the file path
  
  return html;
}

function fixLinksForFile(html, lang, filePath) {
  const fileDir = path.dirname(filePath);
  const isInSubdir = fileDir !== '.';
  const dirPrefix = isInSubdir ? `${fileDir}/` : '';
  
  // Replace href="./..." and href="../..." patterns
  // We need to be careful not to break external links or anchor links
  
  // Pattern 1: href="../page.html" or href="../dir/" (from subdir, go to root)
  if (isInSubdir) {
    // ../ -> /lang/ (root level)
    html = html.replace(/href="\.\.\/([^"]*)"/g, (match, p1) => {
      if (p1.startsWith('http') || p1.startsWith('mailto') || p1.startsWith('tel') || p1.startsWith('#')) return match;
      return `href="/${lang}/${p1}"`;
    });
    // ./ -> /lang/dirPrefix (current directory)
    html = html.replace(/href="\.\//g, (match) => {
      return `href="/${lang}/${dirPrefix}`;
    });
  } else {
    // ./ -> /lang/ (root level)
    html = html.replace(/href="\.\//g, () => `href="/${lang}/`);
  }
  
  // Fix canonical URLs
  html = html.replace(/href="https:\/\/www\.pettycash\.site\/([^"]*)"/g, (match, p1) => {
    if (p1 === '' || p1 === '/') return `href="https://www.pettycash.site/${lang}/"`;
    return `href="https://www.pettycash.site/${lang}/${p1}"`;
  });
  
  // Fix og:url
  html = html.replace(/content="https:\/\/www\.pettycash\.site\/([^"]*)"/g, (match, p1) => {
    if (p1 === '' || p1 === '/') return `content="https://www.pettycash.site/${lang}/"`;
    return `content="https://www.pettycash.site/${lang}/${p1}"`;
  });
  
  return html;
}

// Remove translation JS scripts and add lang-setting inline script
function processHtml(html, lang, filePath) {
  // Set lang and dir on <html> tag
  html = html.replace(/<html\s+lang="[^"]*"\s+dir="[^"]*"/, `<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}"`);
  
  // Fix internal links
  html = fixLinksForFile(html, lang, filePath);
  
  // Add hreflang tags (before </head>)
  const otherLang = lang === 'en' ? 'ar' : 'en';
  const hreflangTags = `
  <link rel="alternate" hreflang="en" href="https://www.pettycash.site/en/${filePath === 'index.html' ? '' : filePath}" />
  <link rel="alternate" hreflang="ar" href="https://www.pettycash.site/ar/${filePath === 'index.html' ? '' : filePath}" />
  <link rel="alternate" hreflang="x-default" href="https://www.pettycash.site/" />`;
  html = html.replace('</head>', `${hreflangTags}\n</head>`);
  
  // Add a small inline script to set localStorage lang before other scripts
  // This ensures any remaining JS (analytics, widget) uses the correct language
  const langScript = `<script>window.localStorage&&localStorage.setItem('pettycash-lang','${lang}');</script>`;
  html = html.replace('<head>', `<head>${langScript}`);
  
  return html;
}

async function generatePage(browser, pagePath, lang) {
  const url = `${BASE_URL}/${pagePath}?lang=${lang}`;
  const page = await browser.newPage();
  
  try {
    // Set localStorage before navigating
    await page.addInitScript((l) => {
      localStorage.setItem('pettycash-lang', l);
    }, lang);
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    // Wait for JS to render content
    await page.waitForTimeout(3000);
    
    // Get the full HTML
    const html = await page.content();
    
    // Process the HTML
    const processed = processHtml(html, lang, pagePath);
    
    // Determine output path
    const outDir = OUT_DIRS[lang];
    const outFile = path.join(outDir, pagePath);
    
    // Create directory structure
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, processed);
    
    console.log(`  ✓ ${lang.toUpperCase()}: ${pagePath}`);
    return true;
  } catch(e) {
    console.error(`  ✗ ${lang.toUpperCase()}: ${pagePath} - ${e.message}`);
    return false;
  } finally {
    await page.close();
  }
}

async function main() {
  const files = findHtmlFiles('.');
  console.log(`Found ${files.length} HTML pages to process`);
  console.log(`Generating ${files.length * 2} files (EN + AR)...\n`);
    
  const browser = await chromium.launch({ headless: true });
  
  let success = 0, fail = 0;
  
  for (const file of files) {
    for (const lang of ['en', 'ar']) {
      const ok = await generatePage(browser, file, lang);
      if (ok) success++; else fail++;
    }
  }
  
  await browser.close();
  
  console.log(`\nDone: ${success} files generated, ${fail} failed`);
}

main().catch(console.error);
