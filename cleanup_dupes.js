const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

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
  console.log('Fetching all articles...');

  const snapshot = await getDocs(collection(db, 'blog_articles'));
  console.log(`Total docs: ${snapshot.size}`);

  // Group by slug
  const bySlug = {};
  for (const d of snapshot.docs) {
    const f = d.data();
    const slug = f.slug || '';
    if (!bySlug[slug]) bySlug[slug] = [];
    bySlug[slug].push({ id: d.id, data: f });
  }

  // Find duplicates and delete the shorter/older one
  let deleted = 0;
  for (const [slug, docs] of Object.entries(bySlug)) {
    if (docs.length > 1) {
      console.log(`\nDuplicate slug: ${slug} (${docs.length} copies)`);
      // Sort by content length desc — keep the longest, delete the rest
      docs.sort((a, b) => {
        const aContent = (a.data.translations?.en?.content || '').split(' ').length;
        const bContent = (b.data.translations?.en?.content || '').split(' ').length;
        return bContent - aContent;
      });
      
      console.log(`  Keeping: ${docs[0].id} (${docs[0].data.translations?.en?.content?.split(' ').length || 0} words)`);
      
      // Delete the rest
      for (let i = 1; i < docs.length; i++) {
        const wc = (docs[i].data.translations?.en?.content || '').split(' ').length;
        const img = docs[i].data.image || '';
        console.log(`  Deleting: ${docs[i].id} (${wc} words, img=${img.substring(0, 40)})`);
        await deleteDoc(doc(db, 'blog_articles', docs[i].id));
        deleted++;
      }
    }
  }

  console.log(`\nDone! Deleted ${deleted} duplicate articles.`);
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
