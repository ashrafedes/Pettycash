import urllib.request, json, urllib.parse, re, time

API_KEY = 'AIzaSyDxnv8IXCDgAwP3acnnfNNFthOdCziOwfg'
PROJECT = 'pattycashsystem'
base_url = f'https://firestore.googleapis.com/v1/projects/{PROJECT}/databases/(default)/documents/blog_articles'

def fetch_with_retry(url, max_retries=5):
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(url, timeout=60) as resp:
                return json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = min(30, 5 * (2 ** attempt))
                print(f'  Rate limited, waiting {wait}s (attempt {attempt+1}/{max_retries})...')
                time.sleep(wait)
            else:
                raise
    raise Exception('Max retries exceeded')

params = {'key': API_KEY, 'pageSize': 100}
all_docs = []
while True:
    url = base_url + '?' + urllib.parse.urlencode(params)
    data = fetch_with_retry(url)
    all_docs.extend(data.get('documents', []))
    token = data.get('nextPageToken')
    if not token:
        break
    params['pageToken'] = token
    time.sleep(1)

print(f'Fetched {len(all_docs)} articles')

def get_field(map_fields, key, default=''):
    val = map_fields.get(key, {})
    if 'stringValue' in val:
        return val['stringValue']
    if 'integerValue' in val:
        return int(val['integerValue'])
    if 'booleanValue' in val:
        return val['booleanValue']
    if 'timestampValue' in val:
        return val['timestampValue']
    return default

def get_array(map_fields, key):
    val = map_fields.get(key, {})
    if 'arrayValue' in val and val['arrayValue']:
        return [v.get('stringValue', '') for v in val['arrayValue'].get('values', [])]
    return []

def get_map(map_fields, key):
    val = map_fields.get(key, {})
    if 'mapValue' in val:
        return val['mapValue'].get('fields', {})
    return {}

articles = []
for doc in all_docs:
    f = doc.get('fields', {})
    slug = get_field(f, 'slug')
    date = get_field(f, 'date')
    if not date:
        date = '2026-01-01'
    readTime = get_field(f, 'readTime', '')
    image = get_field(f, 'image', '')
    published = get_field(f, 'published', True)

    trans = get_map(f, 'translations')
    en = get_map(trans, 'en')
    ar = get_map(trans, 'ar')
    hi = get_map(trans, 'hi')
    ur = get_map(trans, 'ur')

    def make_lang_obj(m):
        return {
            'title': get_field(m, 'title'),
            'summary': get_field(m, 'summary'),
            'content': get_field(m, 'content'),
            'metaTitle': get_field(m, 'metaTitle', ''),
            'metaDescription': get_field(m, 'metaDescription', ''),
            'keywords': get_array(m, 'keywords')
        }

    article = {
        'slug': slug,
        'date': date[:10] if isinstance(date, str) else '2026-01-01',
        'readTime': readTime or 3,
        'image': image,
        'published': published,
        'translations': {
            'en': make_lang_obj(en),
            'ar': make_lang_obj(ar),
            'hi': make_lang_obj(hi),
            'ur': make_lang_obj(ur)
        }
    }
    articles.append(article)

# Sort by date desc
articles.sort(key=lambda a: a['date'], reverse=True)

# Write as JS module with single quotes as originally used (but file was auto-generated with double quotes)
# Actually current file uses double quotes. Keep double quotes for consistency.
js_content = "// Auto-generated from Firestore blog_articles\nexport const articles = " + json.dumps(articles, ensure_ascii=False, indent=2) + ";\n"

with open(r'c:\My projects\PettyCash_Static_Web\js\articles-data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f'Wrote {len(articles)} articles to articles-data.js')
