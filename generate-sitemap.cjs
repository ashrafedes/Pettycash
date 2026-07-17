const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://pettycash.site';
const OUTPUT_PATH = path.join(__dirname, 'sitemap.xml');

const STATIC_PAGES = [
  { loc: `${BASE_URL}/tools/`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: '0.8' },
  { loc: `${BASE_URL}/tools/saudi-invoice-generator.html`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE_URL}/tools/receipt-generator.html`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE_URL}/tools/petty-cash-voucher-generator.html`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE_URL}/`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: '1.0' },
  { loc: `${BASE_URL}/features.html`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.8' },
  { loc: `${BASE_URL}/pricing.html`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.8' },
  { loc: `${BASE_URL}/blog.html`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: '0.7' },
  { loc: `${BASE_URL}/help.html`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE_URL}/about.html`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.7' },
  { loc: `${BASE_URL}/contact.html`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.7' }
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
