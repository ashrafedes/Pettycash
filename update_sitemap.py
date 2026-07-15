import json

ARTICLES_PATH = r"c:\My projects\PettyCash_Static_Web\js\articles-data.js"
SITEMAP_PATH = r"c:\My projects\PettyCash_Static_Web\sitemap.xml"

with open(ARTICLES_PATH, "r", encoding="utf-8") as f:
    articles_text = f.read()

# Extract JSON array from JS file
start = articles_text.find("[")
end = articles_text.rfind("]")
articles_data = json.loads(articles_text[start:end+1])

articles = [(a["slug"], a["date"]) for a in articles_data]
print(f"Found {len(articles)} articles in data file")

with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
    sitemap = f.read()

# Find the position of the first article URL
first_article_idx = sitemap.find("https://www.pettycash.site/article.html")
if first_article_idx == -1:
    # Insert before closing urlset
    insert_idx = sitemap.rfind("</urlset>")
else:
    # Find the start of that <url> block
    insert_idx = sitemap.rfind("<url>", 0, first_article_idx)

before = sitemap[:insert_idx]
after = sitemap[sitemap.rfind("</urlset>"):]

article_urls = []
for slug, date in articles:
    article_urls.append(f"""  <url>
    <loc>https://www.pettycash.site/article.html?slug={slug}</loc>
    <lastmod>{date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>""")

new_sitemap = before + "\n".join(article_urls) + "\n" + after

with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
    f.write(new_sitemap)

print(f"Updated sitemap with {len(articles)} article URLs")
