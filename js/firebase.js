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

window.PettyCashFirebase = { trackVisitor, fetchLatestArticles, formatDate };
