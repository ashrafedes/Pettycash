// Admin panel for blog articles with built-in password
const ADMIN_PASSWORD = "PettyCash@Admin2026";
const ADMIN_AUTH_KEY = "pettycash-admin-auth";
const OPENROUTER_API_KEY_KEY = "pettycash-openrouter-key";
const OPENROUTER_MODEL = "google/gemini-2.0-flash-exp:free";

function getOpenRouterKey() {
  try {
    return localStorage.getItem(OPENROUTER_API_KEY_KEY) || "";
  } catch (e) { return ""; }
}

function setOpenRouterKey(key) {
  try {
    if (key) localStorage.setItem(OPENROUTER_API_KEY_KEY, key.trim());
    else localStorage.removeItem(OPENROUTER_API_KEY_KEY);
  } catch (e) {}
}

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
  const publishedInput = document.getElementById("article-published");
  const clearBtn = document.getElementById("clear-btn");
  const saveBtn = document.getElementById("save-btn");
  const translateBtn = document.getElementById("translate-ar-btn");
  const translateStatus = document.getElementById("translate-status");
  const settingsBtn = document.getElementById("settings-btn");
  const settingsPanel = document.getElementById("settings-panel");
  const openrouterInput = document.getElementById("openrouter-key");
  const saveSettingsBtn = document.getElementById("save-settings-btn");
  const closeSettingsBtn = document.getElementById("close-settings-btn");
  const settingsStatus = document.getElementById("settings-status");

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

  if (settingsBtn && settingsPanel && openrouterInput) {
    settingsBtn.addEventListener("click", () => {
      openrouterInput.value = getOpenRouterKey();
      settingsPanel.classList.remove("hidden");
      if (settingsStatus) {
        settingsStatus.className = "text-sm hidden";
        settingsStatus.textContent = "";
      }
    });

    closeSettingsBtn?.addEventListener("click", () => {
      settingsPanel.classList.add("hidden");
    });

    saveSettingsBtn?.addEventListener("click", () => {
      const key = openrouterInput.value.trim();
      setOpenRouterKey(key);
      if (settingsStatus) {
        settingsStatus.textContent = key ? "API key saved." : "API key removed.";
        settingsStatus.className = key ? "text-sm text-green-600" : "text-sm text-amber-600";
      }
      setTimeout(() => settingsPanel.classList.add("hidden"), 800);
    });
  }

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
      published: publishedInput ? publishedInput.checked : true,
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

  translateBtn.addEventListener("click", async () => {
    const title = document.getElementById("title-en").value.trim();
    const summary = document.getElementById("summary-en").value.trim();
    const content = document.getElementById("content-en").value.trim();

    if (!title && !summary && !content) {
      translateStatus.textContent = "Please enter English content first.";
      translateStatus.className = "mt-2 text-xs text-red-600";
      return;
    }

    translateBtn.disabled = true;
    translateStatus.textContent = "Translating...";
    translateStatus.className = "mt-2 text-xs text-blue-600";

    const result = await translateWithOpenRouter(title, summary, content);

    translateBtn.disabled = false;
    if (result.error) {
      translateStatus.textContent = "Translation failed: " + result.error;
      translateStatus.className = "mt-2 text-xs text-red-600";
      return;
    }

    document.getElementById("title-ar").value = result.title || "";
    document.getElementById("summary-ar").value = result.summary || "";
    document.getElementById("content-ar").value = result.content || "";
    translateStatus.textContent = "Translation completed.";
    translateStatus.className = "mt-2 text-xs text-green-600";
  });

  function clearForm() {
    articleForm.reset();
    document.getElementById("article-id").value = "";
    imageUrlInput.value = "";
    uploadStatus.textContent = "";
    formStatus.textContent = "";
    if (translateStatus) {
      translateStatus.textContent = "";
      translateStatus.className = "mt-2 text-xs text-slate-500";
    }
    document.getElementById("article-date").value = new Date().toISOString().split("T")[0];
  }

  async function fetchAdminArticles(retries = 2) {
    let lastError = null;
    for (let i = 0; i <= retries; i++) {
      try {
        const articles = await window.PettyCashFirebase.fetchLatestArticles(100);
        return { success: true, articles };
      } catch (err) {
        lastError = err;
        if (i < retries) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      }
    }
    return { success: false, error: lastError };
  }

  async function loadArticles() {
    if (!articlesList) return;
    articlesList.innerHTML = "<p class='text-slate-500'>Loading articles...</p>";
    const result = await fetchAdminArticles(2);
    if (!result.success) {
      articlesList.innerHTML = `
        <p class="text-red-600">Failed to load articles: ${escapeHtml(result.error?.message || "Connection error")}</p>
        <button id="retry-load-articles" class="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Retry</button>
      `;
      document.getElementById("retry-load-articles")?.addEventListener("click", loadArticles);
      return;
    }
    if (!result.articles.length) {
      articlesList.innerHTML = "<p class='text-slate-500'>No articles yet.</p>";
      return;
    }
    const articles = result.articles;
    articlesList.innerHTML = articles.map(a => {
      const en = a.translations?.en || {};
      const ar = a.translations?.ar || {};
      const isPublished = a.published !== false;
      const statusText = isPublished ? "Published" : "Draft";
      const statusClass = isPublished ? "text-green-600 bg-green-50" : "text-amber-600 bg-amber-50";
      return `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200 rounded-xl p-4 gap-3">
          <div>
            <p class="font-semibold text-slate-900">${escapeHtml(en.title || ar.title || a.slug)}</p>
            <p class="text-sm text-slate-500">Slug: ${escapeHtml(a.slug || "")} · ${window.PettyCashFirebase.formatDate(a.date, "en")} · <span class="inline-block px-2 py-0.5 rounded text-xs font-medium ${statusClass}">${statusText}</span></p>
          </div>
          <div class="flex items-center gap-2">
            <button data-id="${escapeHtml(a.id)}" data-published="${isPublished ? "1" : "0"}" class="toggle-btn px-3 py-1.5 text-sm font-medium border rounded-lg hover:bg-slate-50 transition-colors ${isPublished ? "text-amber-600 border-amber-200" : "text-green-600 border-green-200"}">${isPublished ? "Unpublish" : "Publish"}</button>
            <button data-id="${escapeHtml(a.id)}" class="edit-btn px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">Edit</button>
            <button data-id="${escapeHtml(a.id)}" class="delete-btn px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
          </div>
        </div>
      `;
    }).join("");

    articlesList.querySelectorAll(".toggle-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const makePublished = btn.dataset.published !== "1";
        const article = await window.PettyCashFirebase.fetchArticleById(id);
        if (!article) return;
        article.published = makePublished;
        article.id = id;
        const result = await window.PettyCashFirebase.saveArticle(article);
        if (result.error) {
          alert("Update failed: " + result.error);
        } else {
          loadArticles();
        }
      });
    });

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
    if (publishedInput) publishedInput.checked = article.published !== false;
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

async function translateWithOpenRouter(title, summary, content) {
  const apiKey = getOpenRouterKey();
  if (!apiKey) {
    return { error: "OpenRouter API key not set. Click Settings and save your key." };
  }
  const prompt = buildTranslationPrompt(title, summary, content);
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
        "HTTP-Referer": location.origin,
        "X-Title": "Petty Cash Admin"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: "You are a professional translator. Translate English blog content to Modern Standard Arabic. Preserve meaning and tone." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      })
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data?.error?.message || `HTTP ${response.status}` };
    }
    const text = data?.choices?.[0]?.message?.content || "";
    const parsed = parseTranslation(text);
    if (!parsed.title && !parsed.summary && !parsed.content) {
      return { error: "Could not parse translation." };
    }
    return parsed;
  } catch (err) {
    return { error: err.message };
  }
}

function buildTranslationPrompt(title, summary, content) {
  return `Translate the following English blog article to Arabic.
Return the result using exactly these markers and no other text outside them:

===TITLE===
[Arabic title]

===SUMMARY===
[Arabic summary]

===CONTENT===
[Arabic content]

Original English:
===TITLE===
${title}

===SUMMARY===
${summary}

===CONTENT===
${content}`;
}

function parseTranslation(text) {
  const result = { title: "", summary: "", content: "" };
  const markers = {
    title: /===TITLE===\s*\n?([\s\S]*?)(?=\n===[A-Z]+===|$)/i,
    summary: /===SUMMARY===\s*\n?([\s\S]*?)(?=\n===[A-Z]+===|$)/i,
    content: /===CONTENT===\s*\n?([\s\S]*?)(?=\n===[A-Z]+===|$)/i
  };
  for (const key of Object.keys(markers)) {
    const match = text.match(markers[key]);
    if (match) result[key] = match[1].trim();
  }
  return result;
}
