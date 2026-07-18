const fs = require('fs');
const path = require('path');

const root = __dirname;
const baseUrl = 'https://www.pettycash.site';
const today = new Date().toISOString().split('T')[0];

// Static pages to always include
const staticPages = [
  { loc: `${baseUrl}/tools/`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
  { loc: `${baseUrl}/tools/saudi-invoice-generator.html`, lastmod: today, changefreq: 'monthly', priority: '0.7' },
  { loc: `${baseUrl}/tools/receipt-generator.html`, lastmod: today, changefreq: 'monthly', priority: '0.7' },
  { loc: `${baseUrl}/tools/petty-cash-voucher-generator.html`, lastmod: today, changefreq: 'monthly', priority: '0.7' },
  { loc: `${baseUrl}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
  { loc: `${baseUrl}/features.html`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
  { loc: `${baseUrl}/pricing.html`, lastmod: today, changefreq: 'monthly', priority: '0.8' },
  { loc: `${baseUrl}/blog.html`, lastmod: today, changefreq: 'weekly', priority: '0.7' },
  { loc: `${baseUrl}/help.html`, lastmod: today, changefreq: 'monthly', priority: '0.7' },
  { loc: `${baseUrl}/about.html`, lastmod: today, changefreq: 'monthly', priority: '0.7' },
  { loc: `${baseUrl}/contact.html`, lastmod: today, changefreq: 'monthly', priority: '0.7' },
];

// Extract articles from articles-data.js
const articlesFile = fs.readFileSync(path.join(root, 'js/articles-data.js'), 'utf8');
const articles = [];
let currentArticle = null;

for (const line of articlesFile.split('\n')) {
  const slugMatch = line.match(/"slug"\s*:\s*"([^"]+)"/);
  if (slugMatch) {
    if (currentArticle) articles.push(currentArticle);
    currentArticle = { slug: slugMatch[1], date: today };
  }
  const dateMatch = line.match(/"date"\s*:\s*"([^"]+)"/);
  if (dateMatch && currentArticle) {
    currentArticle.date = dateMatch[1];
  }
}
if (currentArticle) articles.push(currentArticle);

// Remove duplicates by slug
const seen = new Set();
const uniqueArticles = [];
for (const a of articles) {
  if (!seen.has(a.slug)) {
    seen.add(a.slug);
    uniqueArticles.push(a);
  }
}

const articleUrls = uniqueArticles.map(a => ({
  loc: `${baseUrl}/article.html?slug=${a.slug}`,
  lastmod: a.date,
  changefreq: 'monthly',
  priority: '0.6'
}));

const urls = [...staticPages, ...articleUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log(`Updated sitemap.xml with ${staticPages.length} static pages and ${articleUrls.length} articles.`);
console.log(`Total URLs: ${urls.length}`);
