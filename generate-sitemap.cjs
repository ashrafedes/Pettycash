const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://pettycash.site';
const OUTPUT_PATH = path.join(__dirname, 'sitemap.xml');
const today = new Date().toISOString().split('T')[0];

function page(loc, priority, changefreq = 'monthly') {
  return { loc, lastmod: today, changefreq, priority };
}

function htmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.html'));
}

const rootHtmlFiles = htmlFiles(__dirname).filter(f => f !== 'index.html');
const rootPages = rootHtmlFiles.map(f => page(`${BASE_URL}/${f}`, f === 'blog.html' ? '0.7' : '0.6'));

const businessToolFiles = htmlFiles(path.join(__dirname, 'tools'));
const businessToolPages = businessToolFiles.map(f =>
  page(`${BASE_URL}/tools/${f}`, f === 'index.html' ? '0.8' : '0.7')
);

const pdfToolFiles = htmlFiles(path.join(__dirname, 'pdf-tools'));
const pdfToolPages = pdfToolFiles.map(f =>
  page(`${BASE_URL}/pdf-tools/${f}`, f === 'index.html' ? '0.8' : '0.7')
);

const STATIC_PAGES = [
  page(`${BASE_URL}/`, '1.0', 'weekly'),
  ...rootPages,
  ...businessToolPages,
  ...pdfToolPages
];

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

function articleEntry(article) {
  return urlEntry({
    loc: `${BASE_URL}/article.html?slug=${article.slug}`,
    lastmod: article.date,
    changefreq: 'monthly',
    priority: '0.6'
  });
}

async function generate() {
  const articlesPath = path.join(__dirname, '..', 'PettyCash_Marketing', 'src', 'data', 'articles.js');
  const { articles } = await import('file://' + articlesPath.replace(/\\/g, '/'));
  console.log(`Found ${articles.length} articles`);

  const staticEntries = STATIC_PAGES.map(p => urlEntry(p)).join('\n');
  const articleEntries = articles.map(a => articleEntry(a)).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticEntries}\n${articleEntries}\n</urlset>\n`;

  fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');
  console.log(`sitemap.xml written with ${STATIC_PAGES.length + articles.length} URLs`);
}

generate().catch(err => {
  console.error('Failed to generate sitemap:', err);
  process.exit(1);
});
