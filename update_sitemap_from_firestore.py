import urllib.request, json, urllib.parse
import xml.etree.ElementTree as ET

base_url = 'https://firestore.googleapis.com/v1/projects/pattycashsystem/databases/(default)/documents/blog_articles'
params = {'key': 'AIzaSyDxnv8IXCDgAwP3acnnfNNFthOdCziOwfg', 'pageSize': 100}
all_docs = []

while True:
    url = base_url + '?' + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=60) as resp:
        data = json.loads(resp.read().decode())
    docs = data.get('documents', [])
    all_docs.extend(docs)
    token = data.get('nextPageToken')
    if not token:
        break
    params['pageToken'] = token

articles = []
for d in all_docs:
    f = d.get('fields', {})
    slug = f.get('slug', {}).get('stringValue', '')
    date = f.get('date', {}).get('stringValue', '')
    published = f.get('published', {}).get('booleanValue', True)
    if slug and published:
        articles.append((slug, date))

print(f'Found {len(articles)} published articles in Firestore')

SITEMAP_PATH = r'c:\My projects\PettyCash_Static_Web\sitemap.xml'

with open(SITEMAP_PATH, 'r', encoding='utf-8') as f:
    sitemap = f.read()

first_article_idx = sitemap.find('https://www.pettycash.site/article.html')
if first_article_idx == -1:
    insert_idx = sitemap.rfind('</urlset>')
else:
    insert_idx = sitemap.rfind('<url>', 0, first_article_idx)

before = sitemap[:insert_idx]
after = sitemap[sitemap.rfind('</urlset>'):]

article_urls = []
for slug, date in articles:
    article_urls.append(f"""  <url>
    <loc>https://www.pettycash.site/article.html?slug={slug}</loc>
    <lastmod>{date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>""")

new_sitemap = before + '\n'.join(article_urls) + '\n' + after

with open(SITEMAP_PATH, 'w', encoding='utf-8') as f:
    f.write(new_sitemap)

print(f'Updated sitemap with {len(articles)} article URLs')
