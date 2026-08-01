const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const BASE_URL = 'https://www.pettycash.site';
const OUTPUT_PATH = path.join(__dirname, 'sitemap.xml');
const today = new Date().toISOString().split('T')[0];

function page(loc, priority, changefreq, lastmod) {
  return { loc, lastmod: lastmod || today, changefreq: changefreq || 'monthly', priority };
}

function htmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.html'));
}

const SUBDIRS = ['tools', 'pdf-tools', 'ai', 'templates', 'industries', 'compare'];

const STATIC_PAGES = [
  page(`${BASE_URL}/`, '1.0', 'weekly'),
  page(`${BASE_URL}/en/`, '1.0', 'weekly'),
  page(`${BASE_URL}/ar/`, '1.0', 'weekly'),
];

const SKIP_ROOT = new Set(['index.html', '404.html', 'article.html', 'admin.html', 'admin-new.html', 'changelog.html', 'cleanup-articles.html', 'fix-missing-images.html', 'import-articles.html', 'roadmap.html', 'status.html']);

for (const f of htmlFiles(__dirname)) {
  if (SKIP_ROOT.has(f)) continue;
  const isBlog = f === 'blog.html';
  STATIC_PAGES.push(page(`${BASE_URL}/en/${f}`, isBlog ? '0.8' : '0.7', isBlog ? 'weekly' : 'monthly'));
  STATIC_PAGES.push(page(`${BASE_URL}/ar/${f}`, isBlog ? '0.8' : '0.7', isBlog ? 'weekly' : 'monthly'));
}

for (const sub of SUBDIRS) {
  const dir = path.join(__dirname, sub);
  for (const f of htmlFiles(dir)) {
    const isIndex = f === 'index.html';
    const p = isIndex ? '0.8' : '0.7';
    STATIC_PAGES.push(page(`${BASE_URL}/en/${sub}/${f}`, p));
    STATIC_PAGES.push(page(`${BASE_URL}/ar/${sub}/${f}`, p));
  }
}

function urlEntry(p) {
  return `  <url>\n    <loc>${p.loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`;
}

function articleEntry(article, lang) {
  return urlEntry({
    loc: `${BASE_URL}/${lang}/article.html?slug=${article.slug}`,
    lastmod: article.date || today,
    changefreq: 'monthly',
    priority: '0.6'
  });
}

async function generate() {
  const articlesPath = path.join(__dirname, "js", "articles-data.js");
  const { articles } = await import(pathToFileURL(articlesPath).href);
  console.log(`Found ${articles.length} articles`);

  const staticEntries = STATIC_PAGES.map(p => urlEntry(p)).join('\n');
  const articleEntries = articles.flatMap(a => [articleEntry(a, 'en'), articleEntry(a, 'ar')]).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticEntries}\n${articleEntries}\n</urlset>\n`;

  fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');
  console.log(`sitemap.xml written with ${STATIC_PAGES.length + articles.length * 2} URLs`);
}

generate().catch(err => {
  console.error('Failed to generate sitemap:', err);
  process.exit(1);
});
