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
let firebaseLoadingPromise = null;

function loadFirebaseSDK() {
  if (typeof firebase !== "undefined") return Promise.resolve();
  if (firebaseLoadingPromise) return firebaseLoadingPromise;
  firebaseLoadingPromise = new Promise((resolve, reject) => {
    const appScript = document.createElement("script");
    appScript.src = "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js";
    appScript.async = true;
    appScript.onload = () => {
      const fsScript = document.createElement("script");
      fsScript.src = "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js";
      fsScript.async = true;
      fsScript.onload = () => {
        const stScript = document.createElement("script");
        stScript.src = "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage-compat.js";
        stScript.async = true;
        stScript.onload = resolve;
        stScript.onerror = reject;
        document.head.appendChild(stScript);
      };
      fsScript.onerror = reject;
      document.head.appendChild(fsScript);
    };
    appScript.onerror = reject;
    document.head.appendChild(appScript);
  });
  return firebaseLoadingPromise;
}

function initFirebase() {
  if (typeof firebase === "undefined") {
    console.warn("Firebase SDK not loaded yet — call ensureFirebase() first");
    return null;
  }
  if (!firebaseApp) {
    firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
    firebaseDb = firebase.firestore();
  }
  return firebaseDb;
}

async function ensureFirebase() {
  await loadFirebaseSDK();
  return initFirebase();
}

function initStorage() {
  if (typeof firebase === "undefined" || !firebase.storage) {
    console.warn("Firebase Storage SDK not loaded");
    return null;
  }
  return firebase.storage();
}

async function trackVisitor() {
  const db = await ensureFirebase();
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
    const m = await import('./articles-data.js?v=3');
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

function hasValidImage(a) {
  const img = (a && a.image) || "";
  return img && img.trim() !== "" && img !== "undefined" && img !== "null";
}

function mergeArticles(staticArticles, dbArticles) {
  const map = new Map(staticArticles.map(a => [a.slug || a.id, a]));
  for (const a of dbArticles) {
    const key = a.slug || a.id;
    if (key) {
      const existing = map.get(key);
      if (existing) {
        const merged = { ...existing };
        for (const [k, v] of Object.entries(a)) {
          if (v !== undefined && v !== null && v !== "") merged[k] = v;
        }
        // Prefer the version with a valid image
        if (hasValidImage(a) && !hasValidImage(merged)) {
          merged.image = a.image;
        }
        map.set(key, merged);
      } else {
        map.set(key, a);
      }
    }
  }
  return Array.from(map.values());
}

async function fetchLatestArticles(limitCount = 3) {
  let staticArticles = null;
  const db = await ensureFirebase();
  if (db) {
    try {
      const snap = await withTimeout(
        db.collection("blog_articles").orderBy("date", "desc").limit(Math.max(limitCount, 10)).get(),
        3000
      );
      const dbArticles = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (dbArticles.length) {
        // Firestore is available: avoid downloading the full static article bundle.
        return sortArticlesByDate(dbArticles).slice(0, limitCount);
      }
    } catch (err) {
      console.error("Blog fetch error:", err);
    }
  }
  staticArticles = staticArticles || sortArticlesByDate(await getStaticArticles());
  return staticArticles.slice(0, limitCount);
}

async function fetchArticleBySlug(slug) {
  const db = await ensureFirebase();
  if (db && slug) {
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
  }
  const staticArticles = await getStaticArticles();
  return staticArticles.find(a => a.slug === slug) || null;
}

async function fetchArticleById(id) {
  const db = await ensureFirebase();
  if (db && id) {
    try {
      const snap = await withTimeout(db.collection("blog_articles").doc(id).get(), 3000);
      if (snap.exists) return { id: snap.id, ...snap.data() };
    } catch (err) {
      console.error("Article fetch error:", err);
    }
  }
  const staticArticles = await getStaticArticles();
  return staticArticles.find(a => a.id === id) || null;
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
  const db = await ensureFirebase();
  if (!db) return { error: "Firestore SDK not loaded" };
  try {
    const data = {
      slug: article.slug,
      image: article.image || "",
      readTime: article.readTime || "",
      published: article.published !== false,
      date: article.date || new Date().toISOString(),
      translations: article.translations || {},
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    if (article.id) {
      await db.collection("blog_articles").doc(article.id).set(data, { merge: true });
      return { id: article.id };
    }
    // Prevent duplicates: if a doc with the same slug exists, update it instead of adding
    if (article.slug) {
      const existing = await db.collection("blog_articles").where("slug", "==", article.slug).limit(1).get();
      if (!existing.empty) {
        const id = existing.docs[0].id;
        await db.collection("blog_articles").doc(id).set(data, { merge: true });
        return { id };
      }
    }
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    const docRef = await db.collection("blog_articles").add(data);
    return { id: docRef.id };
  } catch (err) {
    return { error: err.message };
  }
}

async function deleteArticle(id) {
  const db = await ensureFirebase();
  if (!db) return { error: "Firestore SDK not loaded" };
  try {
    await db.collection("blog_articles").doc(id).delete();
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

window.PettyCashFirebase = { initFirebase, ensureFirebase, trackVisitor, fetchLatestArticles, fetchArticleBySlug, fetchArticleById, formatDate, uploadImage, saveArticle, deleteArticle, getStaticArticles, sortArticlesByDate, mergeArticles };
