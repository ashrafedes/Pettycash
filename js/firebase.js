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

function initAuth() {
  if (typeof firebase === "undefined" || !firebase.auth) {
    console.warn("Firebase Auth SDK not loaded");
    return null;
  }
  return firebase.auth();
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

async function fetchLatestArticles(limitCount = 3) {
  const db = initFirebase();
  if (!db) return [];
  try {
    const snap = await db.collection("blog_articles")
      .orderBy("date", "desc")
      .limit(limitCount)
      .get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Blog fetch error:", err);
    return [];
  }
}

async function fetchArticleBySlug(slug) {
  const db = initFirebase();
  if (!db || !slug) return null;
  try {
    const snap = await db.collection("blog_articles")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (err) {
    console.error("Article fetch error:", err);
    return null;
  }
}

async function fetchArticleById(id) {
  const db = initFirebase();
  if (!db || !id) return null;
  try {
    const snap = await db.collection("blog_articles").doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() };
  } catch (err) {
    console.error("Article fetch error:", err);
    return null;
  }
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

function onAuthChanged(callback) {
  const auth = initAuth();
  if (!auth) return () => {};
  return auth.onAuthStateChanged(callback);
}

async function signIn(email, password) {
  const auth = initAuth();
  if (!auth) return { error: "Auth SDK not loaded" };
  try {
    await auth.signInWithEmailAndPassword(email, password);
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

async function signOut() {
  const auth = initAuth();
  if (!auth) return { error: "Auth SDK not loaded" };
  try {
    await auth.signOut();
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
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

window.PettyCashFirebase = { trackVisitor, fetchLatestArticles, fetchArticleBySlug, fetchArticleById, formatDate, onAuthChanged, signIn, signOut, uploadImage, saveArticle, deleteArticle };
