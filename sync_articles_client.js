const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');

const firebaseConfig = {
  apiKey: "AIzaSyDxnv8IXCDgAwP3acnnfNNFthOdCziOwfg",
  authDomain: "pattycashsystem.firebaseapp.com",
  projectId: "pattycashsystem",
  storageBucket: "pattycashsystem.firebasestorage.app",
  messagingSenderId: "330921645187",
  appId: "1:330921645187:web:cc3a5699eb1799ef3577b6"
};

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  console.log('Fetching all articles from Firestore via client SDK...');

  const snapshot = await getDocs(collection(db, 'blog_articles'));
  console.log(`Fetched ${snapshot.size} articles`);

  const articles = [];
  for (const doc of snapshot.docs) {
    const f = doc.data();
    let date = f.date || '2026-01-01';
    // Handle Firestore Timestamp
    if (date && typeof date === 'object' && date.toDate) {
      date = date.toDate().toISOString().slice(0, 10);
    } else if (typeof date === 'string') {
      date = date.slice(0, 10);
    } else {
      date = '2026-01-01';
    }

    const article = {
      slug: f.slug || '',
      date: date,
      readTime: f.readTime || 3,
      image: f.image || '',
      published: f.published !== false,
      translations: {
        en: f.translations?.en || {},
        ar: f.translations?.ar || {},
        hi: f.translations?.hi || {},
        ur: f.translations?.ur || {},
      },
    };
    articles.push(article);
  }

  // Sort by date desc
  articles.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const jsContent = '// Auto-generated from Firestore blog_articles\nexport const articles = ' +
    JSON.stringify(articles, null, 2) + ';\n';

  fs.writeFileSync('js/articles-data.js', jsContent, 'utf-8');
  console.log(`Wrote ${articles.length} articles to articles-data.js`);
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
