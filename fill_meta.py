import urllib.request, json, urllib.parse, re

API_KEY = 'AIzaSyDxnv8IXCDgAwP3acnnfNNFthOdCziOwfg'
PROJECT = 'pattycashsystem'
base_url = f'https://firestore.googleapis.com/v1/projects/{PROJECT}/databases/(default)/documents/blog_articles'

EN_STOP = {
    'the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','as','is','was','are','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','must','can','shall','this','that','these','those','i','you','he','she','it','we','they','me','him','her','us','them','my','your','his','her','its','our','their','what','which','who','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','not','only','own','same','so','than','too','very','just','now','then','also','get','use','make','go','come','take','see','know','want','need','like','way','new','first','last','long','great','little','own','other','old','right','big','high','different','small','large','next','early','young','important','few','public','bad','same','able'
}

AR_STOP = {
    'في','من','إلى','على','هذا','هذه','ذلك','التي','الذي','التي','و','أو','ب','ل','ك','هو','هي','نحن','أنت','أنا','هم','هنا','هناك','كان','يكون','أن','لا','ما','كل','عن','بعد','قبل','خلال','بين','فوق','تحت','أيضا','فقط','مجرد','الآن','ثم','جدا','كثيرا','لذلك','لكن','مع','بدون','ضد','خلال','بين','أثناء','حتى','إذا','عندما','حيث','لماذا','كيف','منذ','من','إلى','في','على','عن','ب','ل','ك','ما','لا','أن','هذا','هذه','ذلك','التي','الذي','اللذين','اللتان','اللواتي','أولئك'
}

def slugify_word(word):
    return re.sub(r"[^\w\s-]", "", word).strip().lower()

def extract_keywords(text, stop_words, max_kw=10):
    if not text:
        return []
    words = re.findall(r"[\w'-]+", text.lower())
    filtered = [w for w in words if len(w) > 2 and w not in stop_words]
    counts = {}
    for w in filtered:
        counts[w] = counts.get(w, 0) + 1
    sorted_words = sorted(counts.items(), key=lambda x: (-x[1], x[0]))
    return [w for w, c in sorted_words[:max_kw]]

def extract_arabic_keywords(text, stop_words, max_kw=10):
    if not text:
        return []
    words = re.findall(r"[\u0600-\u06FF]+", text)
    filtered = [w for w in words if len(w) > 2 and w not in stop_words]
    counts = {}
    for w in filtered:
        counts[w] = counts.get(w, 0) + 1
    sorted_words = sorted(counts.items(), key=lambda x: (-x[1], x[0]))
    return [w for w, c in sorted_words[:max_kw]]

def truncate(text, max_len):
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text).strip()
    if len(text) <= max_len:
        return text
    return text[:max_len].rsplit(' ', 1)[0] + '...'

def make_meta_title(title, suffix="Petty Cash"):
    if not title:
        return ""
    base = title.strip()
    # If already short, append suffix
    if len(base) <= 50:
        return f"{base} | {suffix}"
    return truncate(base, 58)

def build_value(val):
    if isinstance(val, list):
        return {"arrayValue": {"values": [{"stringValue": v} for v in val]}}
    return {"stringValue": val}

# Fetch all articles
params = {'key': API_KEY, 'pageSize': 100}
all_docs = []
while True:
    url = base_url + '?' + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=60) as resp:
        data = json.loads(resp.read().decode())
    all_docs.extend(data.get('documents', []))
    token = data.get('nextPageToken')
    if not token:
        break
    params['pageToken'] = token

print(f'Fetched {len(all_docs)} articles')

updated = 0
for doc in all_docs:
    name = doc['name']
    f = doc.get('fields', {})
    trans = f.get('translations', {}).get('mapValue', {}).get('fields', {})
    en = trans.get('en', {}).get('mapValue', {}).get('fields', {})
    ar = trans.get('ar', {}).get('mapValue', {}).get('fields', {})

    en_title = en.get('title', {}).get('stringValue', '')
    en_summary = en.get('summary', {}).get('stringValue', '')
    ar_title = ar.get('title', {}).get('stringValue', '')
    ar_summary = ar.get('summary', {}).get('stringValue', '')

    en_meta_title = en.get('metaTitle', {}).get('stringValue', '').strip()
    ar_meta_title = ar.get('metaTitle', {}).get('stringValue', '').strip()

    # Only update if missing
    if en_meta_title and ar_meta_title:
        continue

    new_en = {
        "title": en_title,
        "summary": en_summary,
        "content": en.get('content', {}).get('stringValue', ''),
    }
    new_ar = {
        "title": ar_title,
        "summary": ar_summary,
        "content": ar.get('content', {}).get('stringValue', ''),
    }

    if not en_meta_title:
        new_en["metaTitle"] = make_meta_title(en_title, "Petty Cash")
        new_en["metaDescription"] = truncate(en_summary, 160)
        new_en["keywords"] = extract_keywords(en_title + " " + en_summary, EN_STOP)

    if not ar_meta_title:
        new_ar["metaTitle"] = make_meta_title(ar_title, "صندوق العهدة")
        new_ar["metaDescription"] = truncate(ar_summary, 160)
        new_ar["keywords"] = extract_arabic_keywords(ar_title + " " + ar_summary, AR_STOP)

    # Build patch body preserving other fields
    patch_body = {
        "fields": {
            "translations": {
                "mapValue": {
                    "fields": {
                        "en": {"mapValue": {"fields": {k: build_value(v) for k, v in new_en.items()}}},
                        "ar": {"mapValue": {"fields": {k: build_value(v) for k, v in new_ar.items()}}}
                    }
                }
            }
        }
    }

    patch_url = f"https://firestore.googleapis.com/v1/{name}?key={API_KEY}&updateMask.fieldPaths=translations"
    req = urllib.request.Request(patch_url, method='PATCH', data=json.dumps(patch_body).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            pass
        updated += 1
        print(f'Updated {updated}: {f.get("slug", {}).get("stringValue", "")}')
    except Exception as e:
        print(f'Error updating {f.get("slug", {}).get("stringValue", "")}: {e}')

print(f'Done. Updated {updated} articles.')
