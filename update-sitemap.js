// Delegate to generate-sitemap.cjs, which builds the full sitemap:
// canonical EN/AR page URLs (never root-level redirect stubs) plus all
// articles from js/articles-data.js. Keeping a single generator avoids
// the sitemap being regenerated with redirecting URLs.
require('./generate-sitemap.cjs');
