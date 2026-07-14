// Admin panel for blog articles with built-in password
const ADMIN_PASSWORD = "PettyCash@Admin2026";
const ADMIN_AUTH_KEY = "pettycash-admin-auth";

document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login-section");
  const adminSection = document.getElementById("admin-section");
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const logoutBtn = document.getElementById("logout-btn");
  const articleForm = document.getElementById("article-form");
  const articlesList = document.getElementById("articles-list");
  const formStatus = document.getElementById("form-status");
  const uploadStatus = document.getElementById("upload-status");
  const imageFileInput = document.getElementById("article-image-file");
  const imageUrlInput = document.getElementById("article-image-url");
  const clearBtn = document.getElementById("clear-btn");
  const saveBtn = document.getElementById("save-btn");

  if (!window.PettyCashFirebase) {
    if (loginError) {
      loginError.textContent = "Firebase not loaded. Check your connection.";
      loginError.classList.remove("hidden");
    }
    return;
  }

  function updateAuthView() {
    const authed = sessionStorage.getItem(ADMIN_AUTH_KEY) === "1";
    if (authed) {
      loginSection.classList.add("hidden");
      adminSection.classList.remove("hidden");
      loadArticles();
    } else {
      loginSection.classList.remove("hidden");
      adminSection.classList.add("hidden");
    }
  }

  updateAuthView();

  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const password = document.getElementById("login-password").value;
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, "1");
      loginError.classList.add("hidden");
      updateAuthView();
    } else {
      loginError.textContent = "Wrong password.";
      loginError.classList.remove("hidden");
    }
  });

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    updateAuthView();
  });

  imageFileInput.addEventListener("change", async () => {
    const file = imageFileInput.files[0];
    if (!file) return;
    uploadStatus.textContent = "Uploading...";
    uploadStatus.className = "mt-1 text-xs text-blue-600";
    const result = await window.PettyCashFirebase.uploadImage(file);
    if (result.error) {
      uploadStatus.textContent = "Upload failed: " + result.error;
      uploadStatus.className = "mt-1 text-xs text-red-600";
    } else {
      imageUrlInput.value = result.url;
      uploadStatus.textContent = "Image uploaded successfully.";
      uploadStatus.className = "mt-1 text-xs text-green-600";
    }
  });

  articleForm.addEventListener("submit", async e => {
    e.preventDefault();
    formStatus.textContent = "Saving...";
    formStatus.className = "text-sm text-blue-600";
    saveBtn.disabled = true;

    const article = {
      id: document.getElementById("article-id").value || null,
      slug: document.getElementById("article-slug").value.trim(),
      date: new Date(document.getElementById("article-date").value).toISOString(),
      readTime: document.getElementById("article-readtime").value.trim(),
      image: imageUrlInput.value.trim(),
      translations: {
        en: {
          title: document.getElementById("title-en").value.trim(),
          summary: document.getElementById("summary-en").value.trim(),
          content: document.getElementById("content-en").value.trim()
        },
        ar: {
          title: document.getElementById("title-ar").value.trim(),
          summary: document.getElementById("summary-ar").value.trim(),
          content: document.getElementById("content-ar").value.trim()
        }
      }
    };

    const result = await window.PettyCashFirebase.saveArticle(article);
    saveBtn.disabled = false;
    if (result.error) {
      formStatus.textContent = "Error: " + result.error;
      formStatus.className = "text-sm text-red-600";
    } else {
      formStatus.textContent = "Article saved successfully.";
      formStatus.className = "text-sm text-green-600";
      clearForm();
      loadArticles();
    }
  });

  clearBtn.addEventListener("click", () => {
    clearForm();
  });

  function clearForm() {
    articleForm.reset();
    document.getElementById("article-id").value = "";
    imageUrlInput.value = "";
    uploadStatus.textContent = "";
    formStatus.textContent = "";
    document.getElementById("article-date").value = new Date().toISOString().split("T")[0];
  }

  async function loadArticles() {
    if (!articlesList) return;
    articlesList.innerHTML = "<p class='text-slate-500'>Loading articles...</p>";
    const articles = await window.PettyCashFirebase.fetchLatestArticles(100);
    if (!articles.length) {
      articlesList.innerHTML = "<p class='text-slate-500'>No articles yet.</p>";
      return;
    }
    articlesList.innerHTML = articles.map(a => {
      const en = a.translations?.en || {};
      const ar = a.translations?.ar || {};
      return `
        <div class="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4">
          <div>
            <p class="font-semibold text-slate-900">${escapeHtml(en.title || ar.title || a.slug)}</p>
            <p class="text-sm text-slate-500">Slug: ${escapeHtml(a.slug || "")} · ${window.PettyCashFirebase.formatDate(a.date, "en")}</p>
          </div>
          <div class="flex items-center gap-2">
            <button data-id="${escapeHtml(a.id)}" class="edit-btn px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">Edit</button>
            <button data-id="${escapeHtml(a.id)}" class="delete-btn px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
          </div>
        </div>
      `;
    }).join("");

    articlesList.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const article = await window.PettyCashFirebase.fetchArticleById(btn.dataset.id);
        if (article) fillForm(article);
      });
    });

    articlesList.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("Delete this article?")) return;
        const result = await window.PettyCashFirebase.deleteArticle(btn.dataset.id);
        if (result.error) {
          alert("Delete failed: " + result.error);
        } else {
          loadArticles();
        }
      });
    });
  }

  function fillForm(article) {
    document.getElementById("article-id").value = article.id || "";
    document.getElementById("article-slug").value = article.slug || "";
    document.getElementById("article-date").value = article.date ? new Date(article.date).toISOString().split("T")[0] : "";
    document.getElementById("article-readtime").value = article.readTime || "";
    imageUrlInput.value = article.image || "";
    uploadStatus.textContent = article.image ? "Image already uploaded." : "";
    const en = article.translations?.en || {};
    const ar = article.translations?.ar || {};
    document.getElementById("title-en").value = en.title || "";
    document.getElementById("summary-en").value = en.summary || "";
    document.getElementById("content-en").value = en.content || "";
    document.getElementById("title-ar").value = ar.title || "";
    document.getElementById("summary-ar").value = ar.summary || "";
    document.getElementById("content-ar").value = ar.content || "";
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  clearForm();
});
