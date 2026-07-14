// Firebase integration for the static Petty Cash marketing site
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDxnv8IXCDgAwP3acnnfNNFthOdCziOwfg",
  authDomain: "pattycashsystem.firebaseapp.com",
  projectId: "pattycashsystem",
  storageBucket: "pattycashsystem.firebasestorage.app",
  messagingSenderId: "330921645187",
  appId: "1:330921645187:web:cc3a5699eb1799ef3577b6"
};

let firebaseApp = null;
let firebaseDb = null;

function initFirebase() {
  if (typeof firebase === "undefined") {
    console.warn("Firebase SDK not loaded");
    return null;
  }
  if (!firebaseApp) {
    firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
    firebaseDb = firebase.firestore();
  }
  return firebaseDb;
}

function initStorage() {
  if (typeof firebase === "undefined" || !firebase.storage) {
    console.warn("Firebase Storage SDK not loaded");
    return null;
  }
  return firebase.storage();
}

async function trackVisitor() {
  const db = initFirebase();
  if (!db) return null;
  try {
    const counterRef = db.collection("analytics").doc("visitor_count");
    await counterRef.set({ count: firebase.firestore.FieldValue.increment(1) }, { merge: true });
    const snap = await counterRef.get();
    return snap.exists ? snap.data().count : null;
  } catch (err) {
    console.error("Visitor counter error:", err);
    return null;
  }
}

async function getStaticArticles() {
  if (typeof window !== "undefined" && window.PettyCashArticlesData) {
    return window.PettyCashArticlesData;
  }
  try {
    const m = await import('./articles-data.js');
    return m.articles || [];
  } catch (err) {
    console.error("Failed to load static articles:", err);
    return [];
  }
}

function sortArticlesByDate(articles) {
  return [...articles].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Firestore timeout")), ms))
  ]);
}

async function fetchLatestArticles(limitCount = 3) {
  const staticArticles = sortArticlesByDate(await getStaticArticles());
  const db = initFirebase();
  if (!db) return staticArticles.slice(0, limitCount);
  try {
    const snap = await withTimeout(
      db.collection("blog_articles").orderBy("date", "desc").limit(limitCount).get(),
      3000
    );
    const articles = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (articles.length) return articles;
  } catch (err) {
    console.error("Blog fetch error:", err);
  }
  return staticArticles.slice(0, limitCount);
}

async function fetchArticleBySlug(slug) {
  const staticArticles = await getStaticArticles();
  const fallback = () => staticArticles.find(a => a.slug === slug) || null;
  const db = initFirebase();
  if (!db || !slug) return fallback();
  try {
    const snap = await withTimeout(
      db.collection("blog_articles").where("slug", "==", slug).limit(1).get(),
      3000
    );
    if (!snap.empty) {
      const doc = snap.docs[0];
      return { id: doc.id, ...doc.data() };
    }
  } catch (err) {
    console.error("Article fetch error:", err);
  }
  return fallback();
}

async function fetchArticleById(id) {
  const staticArticles = await getStaticArticles();
  const staticMatch = staticArticles.find(a => a.id === id);
  const db = initFirebase();
  if (!db || !id) return staticMatch || null;
  try {
    const snap = await withTimeout(db.collection("blog_articles").doc(id).get(), 3000);
    if (snap.exists) return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error("Article fetch error:", err);
  }
  return staticMatch || null;
}

function formatDate(dateValue, lang = "en") {
  let date;
  if (dateValue && dateValue.toDate) {
    date = dateValue.toDate();
  } else if (dateValue) {
    date = new Date(dateValue);
  } else {
    return "";
  }
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(lang, { dateStyle: "medium" }).format(date);
}

async function uploadImage(file, path = "blog_images") {
  const storage = initStorage();
  if (!storage) return { error: "Storage SDK not loaded" };
  if (!file) return { error: "No file selected" };
  try {
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const ref = storage.ref(`${path}/${filename}`);
    const snap = await ref.put(file);
    const url = await snap.ref.getDownloadURL();
    return { url };
  } catch (err) {
    return { error: err.message };
  }
}

async function saveArticle(article) {
  const db = initFirebase();
  if (!db) return { error: "Firestore SDK not loaded" };
  try {
    const data = {
      slug: article.slug,
      image: article.image || "",
      readTime: article.readTime || "",
      published: article.published !== false,
      date: article.date || new Date().toISOString(),
      translations: article.translations || {},
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    if (article.id) {
      await db.collection("blog_articles").doc(article.id).update(data);
      return { id: article.id };
    }
    const docRef = await db.collection("blog_articles").add(data);
    return { id: docRef.id };
  } catch (err) {
    return { error: err.message };
  }
}

async function deleteArticle(id) {
  const db = initFirebase();
  if (!db) return { error: "Firestore SDK not loaded" };
  try {
    await db.collection("blog_articles").doc(id).delete();
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

window.PettyCashFirebase = { trackVisitor, fetchLatestArticles, fetchArticleBySlug, fetchArticleById, formatDate, uploadImage, saveArticle, deleteArticle };
