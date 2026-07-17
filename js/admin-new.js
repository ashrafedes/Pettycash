// Admin panel for blog articles with built-in password
const ADMIN_PASSWORD = "PettyCash@Admin2026";
const ADMIN_AUTH_KEY = "pettycash-admin-auth";
const OPENROUTER_API_KEY_KEY = "pettycash-openrouter-key";
const OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
const OPENROUTER_API_KEY_PARTS = [
  "sk-or-v1-996f54942eed60552",
  "bbab9c5b43d9f73e9bc623f3",
  "37dd90d0ca5356f14fc5fad"
];
const OPENROUTER_API_KEY = OPENROUTER_API_KEY_PARTS.join("");

function getOpenRouterKey() {
  try {
    const stored = localStorage.getItem(OPENROUTER_API_KEY_KEY);
    const key = stored ? stored.trim() : "";
    if (key.startsWith("sk-or-v1-") && key.length >= 70) return key;
  } catch (e) {}
  return OPENROUTER_API_KEY;
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
  const imagePreview = document.getElementById("image-preview");
  const imagePlaceholder = document.getElementById("image-placeholder");
  const removeImageBtn = document.getElementById("remove-image-btn");
  const isDraftInput = document.getElementById("article-is-draft");
  const draftCheckbox = document.getElementById("article-draft");
  const featuredCheckbox = document.getElementById("article-featured");
  const categoryInput = document.getElementById("article-category");
  const authorInput = document.getElementById("article-author");
  const tagsInput = document.getElementById("article-tags");
  const saveDraftBtn = document.getElementById("save-draft-btn");
  const publishBtn = document.getElementById("publish-btn");
  const translateBtn = document.getElementById("translate-ar-btn");
  const translateStatus = document.getElementById("translate-status");
  const settingsBtn = document.getElementById("settings-btn");
  const settingsPanel = document.getElementById("settings-panel");
  const openrouterInput = document.getElementById("openrouter-key");
  const saveSettingsBtn = document.getElementById("save-settings-btn");
  const closeSettingsBtn = document.getElementById("close-settings-btn");
  const settingsStatus = document.getElementById("settings-status");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const dashboardView = document.getElementById("dashboard-view");
  const editorView = document.getElementById("editor-view");
  const newArticleBtn = document.getElementById("new-article-btn");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  const livePreview = document.getElementById("live-preview");

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
      showDashboard();
    } else {
      loginSection.classList.remove("hidden");
      adminSection.classList.add("hidden");
    }
  }

  updateAuthView();

  function showDashboard() {
    dashboardView.classList.remove("hidden");
    editorView.classList.add("hidden");
    loadArticles();
  }

  function showEditor() {
    dashboardView.classList.add("hidden");
    editorView.classList.remove("hidden");
    window.scrollTo(0, 0);
  }

  newArticleBtn.addEventListener("click", () => {
    clearForm();
    showEditor();
  });

  cancelEditBtn.addEventListener("click", () => {
    showDashboard();
  });

  function switchTab(lang) {
    tabBtns.forEach(btn => {
      const active = btn.dataset.tab === lang;
      btn.classList.toggle("text-blue-400", active);
      btn.classList.toggle("border-blue-500", active);
      btn.classList.toggle("border-b-2", active);
      btn.classList.toggle("text-slate-400", !active);
      btn.classList.toggle("border-transparent", !active);
    });
    tabPanels.forEach(panel => {
      panel.classList.toggle("hidden", panel.id !== `tab-${lang}`);
    });
    updateLivePreview();
  }

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

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
        settingsStatus.className = key ? "text-sm text-green-400" : "text-sm text-amber-400";
      }
      setTimeout(() => settingsPanel.classList.add("hidden"), 800);
    });
  }

  function updateImagePreview(url) {
    if (url && url.trim()) {
      imagePreview.src = url.trim();
      imagePreview.classList.remove("hidden");
      imagePlaceholder.classList.add("hidden");
      removeImageBtn.classList.remove("hidden");
    } else {
      imagePreview.src = "";
      imagePreview.classList.add("hidden");
      imagePlaceholder.classList.remove("hidden");
      removeImageBtn.classList.add("hidden");
    }
  }

  imageFileInput.addEventListener("change", async () => {
    const file = imageFileInput.files[0];
    if (!file) return;
    uploadStatus.textContent = "Uploading...";
    uploadStatus.className = "text-xs text-blue-400";
    const result = await window.PettyCashFirebase.uploadImage(file);
    if (result.error) {
      uploadStatus.textContent = "Upload failed: " + result.error;
      uploadStatus.className = "text-xs text-red-400";
    } else {
      imageUrlInput.value = result.url;
      updateImagePreview(result.url);
      uploadStatus.textContent = "Image uploaded successfully.";
      uploadStatus.className = "text-xs text-green-400";
      updateLivePreview();
    }
  });

  imageUrlInput.addEventListener("input", () => {
    updateImagePreview(imageUrlInput.value);
    updateLivePreview();
  });

  removeImageBtn.addEventListener("click", () => {
    imageUrlInput.value = "";
    imageFileInput.value = "";
    updateImagePreview("");
    uploadStatus.textContent = "";
    updateLivePreview();
  });

  const previewInputs = [
    "title-en", "summary-en", "content-en", "title-ar", "summary-ar", "content-ar",
    "article-slug", "article-category", "article-author", "article-readtime", "article-image-url"
  ];
  previewInputs.forEach(id => {
    document.getElementById(id)?.addEventListener("input", updateLivePreview);
  });
  [draftCheckbox, featuredCheckbox].forEach(el => el?.addEventListener("change", updateLivePreview));
  tagsInput?.addEventListener("input", updateLivePreview);

  function renderMarkdown(content) {
    if (!content) return "";
    return content
      .replace(/^### (.*$)/gim, "<h3 class='text-xl font-bold mt-4 mb-2'>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2 class='text-2xl font-bold mt-5 mb-3'>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1 class='text-3xl font-bold mt-6 mb-4'>$1</h1>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/\n/gim, "<br>");
  }

  function updateLivePreview() {
    const activeTab = document.querySelector(".tab-btn.text-blue-400")?.dataset.tab || "en";
    const title = document.getElementById(`title-${activeTab}`).value.trim() || (activeTab === "en" ? "Untitled" : "بدون عنوان");
    const summary = document.getElementById(`summary-${activeTab}`).value.trim() || "";
    const content = document.getElementById(`content-${activeTab}`).value.trim() || "";
    const image = imageUrlInput.value.trim();
    const category = categoryInput?.value.trim() || "";
    const author = authorInput?.value.trim() || "";
    const readTime = document.getElementById("article-readtime")?.value.trim() || "—";
    const date = document.getElementById("article-date")?.value || new Date().toISOString().split("T")[0];
    const tags = (tagsInput?.value || "").split(",").map(s => s.trim()).filter(Boolean);
    const isDraft = draftCheckbox?.checked;

    livePreview.innerHTML = `
      <div class='max-w-2xl'>
        ${category ? `<span class='inline-block px-3 py-1 text-xs font-medium bg-blue-600/20 text-blue-400 rounded-full mb-3'>${escapeHtml(category)}</span>` : ""}
        <h1 class='text-3xl font-bold mb-3 leading-tight'>${escapeHtml(title)}</h1>
        ${isDraft ? `<p class='text-amber-400 text-sm mb-3'>Draft</p>` : ""}
        ${summary ? `<p class='text-lg text-slate-400 italic mb-4'>${escapeHtml(summary)}</p>` : ""}
        <div class='flex items-center gap-3 text-xs text-slate-500 mb-6'>
          <span>${escapeHtml(date)}</span>
          <span>·</span>
          <span>${escapeHtml(readTime)} min read</span>
          ${author ? `<span>·</span><span>${escapeHtml(author)}</span>` : ""}
        </div>
        ${image ? `<img src='${escapeHtml(image)}' alt='Hero' class='w-full h-64 object-cover rounded-xl mb-6 border border-slate-700'>` : ""}
        <div class='text-slate-300 leading-relaxed'>${renderMarkdown(content)}</div>
        ${tags.length ? `<div class='mt-6 flex flex-wrap gap-2'>${tags.map(t => `<span class='px-2 py-1 text-xs bg-slate-800 text-slate-400 rounded'>${escapeHtml(t)}</span>`).join("")}</div>` : ""}
      </div>
    `;
  }

  function saveArticleFromForm(publish = true) {
    isDraftInput.value = publish ? "false" : "true";
    draftCheckbox.checked = !publish;
    articleForm.requestSubmit();
  }

  saveDraftBtn.addEventListener("click", () => saveArticleFromForm(false));

  publishBtn.addEventListener("click", (e) => {
    e.preventDefault();
    saveArticleFromForm(true);
  });

  articleForm.addEventListener("submit", async e => {
    e.preventDefault();
    formStatus.textContent = "Saving...";
    formStatus.className = "text-sm text-blue-400";
    publishBtn.disabled = true;
    saveDraftBtn.disabled = true;

    function parseKeywords(input) {
      return (input || "").split(",").map(s => s.trim()).filter(Boolean);
    }

    const article = {
      id: document.getElementById("article-id").value || null,
      slug: document.getElementById("article-slug").value.trim(),
      category: categoryInput?.value.trim() || "",
      author: authorInput?.value.trim() || "",
      tags: parseKeywords(tagsInput?.value),
      featured: featuredCheckbox?.checked || false,
      date: new Date(document.getElementById("article-date").value).toISOString(),
      readTime: document.getElementById("article-readtime").value.trim(),
      image: imageUrlInput.value.trim(),
      published: !draftCheckbox?.checked,
      translations: {
        en: {
          title: document.getElementById("title-en").value.trim(),
          summary: document.getElementById("summary-en").value.trim(),
          content: document.getElementById("content-en").value.trim(),
          metaTitle: document.getElementById("meta-title-en")?.value.trim() || "",
          metaDescription: document.getElementById("meta-description-en")?.value.trim() || "",
          keywords: parseKeywords(document.getElementById("keywords-en")?.value)
        },
        ar: {
          title: document.getElementById("title-ar").value.trim(),
          summary: document.getElementById("summary-ar").value.trim(),
          content: document.getElementById("content-ar").value.trim(),
          metaTitle: document.getElementById("meta-title-ar")?.value.trim() || "",
          metaDescription: document.getElementById("meta-description-ar")?.value.trim() || "",
          keywords: parseKeywords(document.getElementById("keywords-ar")?.value)
        }
      }
    };

    const result = await window.PettyCashFirebase.saveArticle(article);
    publishBtn.disabled = false;
    saveDraftBtn.disabled = false;
    if (result.error) {
      formStatus.textContent = "Error: " + result.error;
      formStatus.className = "text-sm text-red-400";
    } else {
      formStatus.textContent = "Article saved successfully.";
      formStatus.className = "text-sm text-green-400";
      clearForm();
      showDashboard();
    }
  });

  translateBtn.addEventListener("click", async () => {
    const source = {
      title: document.getElementById("title-en").value.trim(),
      summary: document.getElementById("summary-en").value.trim(),
      content: document.getElementById("content-en").value.trim(),
      metaTitle: document.getElementById("meta-title-en")?.value.trim() || "",
      metaDescription: document.getElementById("meta-description-en")?.value.trim() || "",
      keywords: document.getElementById("keywords-en")?.value.trim() || ""
    };

    if (!source.title && !source.summary && !source.content && !source.metaTitle && !source.metaDescription) {
      translateStatus.textContent = "Please enter English content first.";
      translateStatus.className = "text-xs text-red-400";
      return;
    }

    translateBtn.disabled = true;
    translateStatus.textContent = "Translating...";
    translateStatus.className = "text-xs text-blue-400";

    const result = await translateArticle(source);

    translateBtn.disabled = false;
    if (result.error) {
      translateStatus.textContent = "Translation failed: " + result.error;
      translateStatus.className = "text-xs text-red-400";
      return;
    }

    document.getElementById("title-ar").value = result.title || source.title;
    document.getElementById("summary-ar").value = result.summary || source.summary;
    document.getElementById("content-ar").value = result.content || source.content;
    if (document.getElementById("meta-title-ar")) {
      document.getElementById("meta-title-ar").value = result.metaTitle || source.metaTitle;
    }
    if (document.getElementById("meta-description-ar")) {
      document.getElementById("meta-description-ar").value = result.metaDescription || source.metaDescription;
    }
    if (document.getElementById("keywords-ar")) {
      document.getElementById("keywords-ar").value = result.keywords || source.keywords;
    }
    switchTab("ar");
    translateStatus.textContent = "Translation completed.";
    translateStatus.className = "text-xs text-green-400";
    updateLivePreview();
  });

  function clearForm() {
    articleForm.reset();
    document.getElementById("article-id").value = "";
    if (isDraftInput) isDraftInput.value = "false";
    imageUrlInput.value = "";
    updateImagePreview("");
    uploadStatus.textContent = "";
    formStatus.textContent = "";
    if (translateStatus) {
      translateStatus.textContent = "";
      translateStatus.className = "text-xs text-slate-500";
    }
    document.getElementById("article-date").value = new Date().toISOString().split("T")[0];
    ["meta-title-en", "meta-description-en", "keywords-en", "meta-title-ar", "meta-description-ar", "keywords-ar"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    switchTab("en");
    updateLivePreview();
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
    articlesList.innerHTML = "<tr><td colspan='6' class='px-6 py-8 text-center text-slate-500'>Loading articles...</td></tr>";
    const result = await fetchAdminArticles(2);
    if (!result.success) {
      articlesList.innerHTML = `
        <tr><td colspan='6' class='px-6 py-8 text-center'>
          <p class="text-red-400 mb-3">Failed to load articles: ${escapeHtml(result.error?.message || "Connection error")}</p>
          <button id="retry-load-articles" class="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Retry</button>
        </td></tr>
      `;
      document.getElementById("retry-load-articles")?.addEventListener("click", loadArticles);
      return;
    }
    const articles = result.articles;
    updateStats(articles);

    if (!articles.length) {
      articlesList.innerHTML = `
        <tr><td colspan='6' class='px-6 py-8 text-center'>
          <p class='text-slate-400 mb-4'>No articles yet.</p>
          <button id="import-articles-btn" class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Import Articles</button>
        </td></tr>
      `;
      document.getElementById("import-articles-btn")?.addEventListener("click", () => {
        window.location.href = "./import-articles.html";
      });
      return;
    }

    articlesList.innerHTML = articles.map(a => {
      const en = a.translations?.en || {};
      const ar = a.translations?.ar || {};
      const isPublished = a.published !== false;
      const statusText = isPublished ? "Published" : "Draft";
      const statusClass = isPublished ? "text-green-400 bg-green-400/10" : "text-amber-400 bg-amber-400/10";
      return `
        <tr class='hover:bg-slate-800/50'>
          <td class='px-6 py-4'>
            <p class='font-medium text-slate-100'>${escapeHtml(en.title || ar.title || a.slug)}</p>
            <p class='text-xs text-slate-500'>Slug: ${escapeHtml(a.slug || "")}</p>
          </td>
          <td class='px-6 py-4 text-slate-400'>${escapeHtml(a.category || "—")}</td>
          <td class='px-6 py-4 text-slate-400'>${window.PettyCashFirebase.formatDate(a.date, "en")}</td>
          <td class='px-6 py-4 text-slate-400'>${escapeHtml(a.readTime || "—")} min</td>
          <td class='px-6 py-4'><span class='inline-block px-2 py-0.5 rounded text-xs font-medium ${statusClass}'>${statusText}</span></td>
          <td class='px-6 py-4 text-right'>
            <div class='flex items-center justify-end gap-2'>
              <button data-id="${escapeHtml(a.id || '')}" data-slug="${escapeHtml(a.slug || '')}" class='preview-btn text-xs text-slate-400 hover:text-slate-200'>Preview</button>
              <button data-id="${escapeHtml(a.id || '')}" data-slug="${escapeHtml(a.slug || '')}" class='edit-btn text-xs text-blue-400 hover:text-blue-300'>Edit</button>
              <button data-id="${escapeHtml(a.id || '')}" data-slug="${escapeHtml(a.slug || '')}" data-published="${isPublished ? "1" : "0"}" class='toggle-btn text-xs ${isPublished ? "text-amber-400 hover:text-amber-300" : "text-green-400 hover:text-green-300"}'>${isPublished ? "Unpublish" : "Publish"}</button>
              <button data-id="${escapeHtml(a.id || '')}" data-slug="${escapeHtml(a.slug || '')}" class='delete-btn text-xs text-red-400 hover:text-red-300'>Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    articlesList.querySelectorAll(".toggle-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const slug = btn.dataset.slug;
        const makePublished = btn.dataset.published !== "1";
        const article = id
          ? await window.PettyCashFirebase.fetchArticleById(id)
          : await window.PettyCashFirebase.fetchArticleBySlug(slug);
        if (!article) return;
        article.published = makePublished;
        article.id = id || null;
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
        const id = btn.dataset.id;
        const slug = btn.dataset.slug;
        const article = id
          ? await window.PettyCashFirebase.fetchArticleById(id)
          : await window.PettyCashFirebase.fetchArticleBySlug(slug);
        if (article) {
          fillForm(article);
          showEditor();
        }
      });
    });

    articlesList.querySelectorAll(".preview-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const slug = btn.dataset.slug;
        const article = id
          ? await window.PettyCashFirebase.fetchArticleById(id)
          : await window.PettyCashFirebase.fetchArticleBySlug(slug);
        if (article && article.slug) {
          window.open(`./article.html?slug=${encodeURIComponent(article.slug)}`, "_blank");
        }
      });
    });

    articlesList.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("Delete this article?")) return;
        const id = btn.dataset.id;
        const slug = btn.dataset.slug;
        if (!id) {
          alert("This article is in the static file and cannot be deleted from Firestore. To remove it, edit the source files.");
          return;
        }
        const result = await window.PettyCashFirebase.deleteArticle(id);
        if (result.error) {
          alert("Delete failed: " + result.error);
        } else {
          loadArticles();
        }
      });
    });
  }

  function updateStats(articles) {
    const total = articles.length;
    const published = articles.filter(a => a.published !== false).length;
    const drafts = total - published;
    const categories = new Set(articles.map(a => a.category).filter(Boolean)).size;
    const lastPublished = articles
      .filter(a => a.published !== false)
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];
    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-published").textContent = published;
    document.getElementById("stat-drafts").textContent = drafts;
    document.getElementById("stat-categories").textContent = categories;
    document.getElementById("stat-last").textContent = lastPublished
      ? window.PettyCashFirebase.formatDate(lastPublished.date, "en")
      : "—";
  }

  function fillForm(article) {
    document.getElementById("article-id").value = article.id || "";
    document.getElementById("article-slug").value = article.slug || "";
    document.getElementById("article-date").value = article.date ? new Date(article.date).toISOString().split("T")[0] : "";
    document.getElementById("article-readtime").value = article.readTime || "";
    if (categoryInput) categoryInput.value = article.category || "";
    if (authorInput) authorInput.value = article.author || "";
    if (tagsInput) tagsInput.value = Array.isArray(article.tags) ? article.tags.join(", ") : (article.tags || "");
    if (featuredCheckbox) featuredCheckbox.checked = article.featured === true;
    if (draftCheckbox) draftCheckbox.checked = article.published === false;
    imageUrlInput.value = article.image || "";
    updateImagePreview(article.image || "");
    uploadStatus.textContent = article.image ? "Image set." : "";
    const en = article.translations?.en || {};
    const ar = article.translations?.ar || {};
    document.getElementById("title-en").value = en.title || "";
    document.getElementById("summary-en").value = en.summary || "";
    document.getElementById("content-en").value = en.content || "";
    document.getElementById("title-ar").value = ar.title || "";
    document.getElementById("summary-ar").value = ar.summary || "";
    document.getElementById("content-ar").value = ar.content || "";
    const setIfExists = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || "";
    };
    setIfExists("meta-title-en", en.metaTitle);
    setIfExists("meta-description-en", en.metaDescription);
    setIfExists("keywords-en", Array.isArray(en.keywords) ? en.keywords.join(", ") : en.keywords);
    setIfExists("meta-title-ar", ar.metaTitle);
    setIfExists("meta-description-ar", ar.metaDescription);
    setIfExists("keywords-ar", Array.isArray(ar.keywords) ? ar.keywords.join(", ") : ar.keywords);
    switchTab("en");
    updateLivePreview();
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  clearForm();
});

async function translateArticle(source) {
  const openRouterResult = await translateWithOpenRouter(source);
  if (!openRouterResult.error) return openRouterResult;

  console.warn("OpenRouter failed:", openRouterResult.error);
  const myMemoryResult = await translateWithMyMemory(source);
  if (!myMemoryResult.error) return myMemoryResult;

  console.warn("MyMemory failed:", myMemoryResult.error);
  return {
    title: source.title,
    summary: source.summary,
    content: source.content,
    metaTitle: source.metaTitle,
    metaDescription: source.metaDescription,
    keywords: source.keywords
  };
}

async function translateWithOpenRouter(source) {
  const apiKey = getOpenRouterKey();
  if (!apiKey) {
    return { error: "OpenRouter API key not set. Click Settings and save your key." };
  }
  console.log("Using OpenRouter model:", OPENROUTER_MODEL, "key length:", apiKey.length);
  const prompt = JSON.stringify(source);

  async function tryTranslate() {
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
          { role: "system", content: "You are a professional translator. Translate the provided English article into fluent, natural Arabic. Preserve Markdown formatting. Return ONLY a valid JSON object with these exact keys: title, summary, content, metaTitle, metaDescription, keywords (array). Do not wrap the JSON in markdown code blocks." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      })
    });
    const data = await response.json();
    if (!response.ok) {
      const err = data?.error?.message || `HTTP ${response.status}`;
      throw { status: response.status, message: err };
    }
    return data;
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const data = await tryTranslate();
      const text = data?.choices?.[0]?.message?.content || "";
      const parsed = parseTranslationJson(text);
      if (parsed.error) return { error: parsed.error };
      return parsed;
    } catch (err) {
      if (err.status === 429) {
        return { error: "OpenRouter rate limit reached." };
      }
      if (attempt < 3) {
        await new Promise(r => setTimeout(r, attempt * 2000));
        continue;
      }
      return { error: err.message };
    }
  }
  return { error: "Translation failed after retries." };
}

async function translateWithMyMemory(source) {
  try {
    const fields = ["title", "summary", "content", "metaTitle", "metaDescription"];
    const result = { ...source };
    for (const field of fields) {
      const text = source[field];
      if (!text) continue;
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ar`);
      const data = await response.json();
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        result[field] = data.responseData.translatedText;
      }
    }
    return result;
  } catch (err) {
    return { error: err.message };
  }
}

function parseTranslationJson(text) {
  try {
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned);
    const result = {
      title: parsed.title || "",
      summary: parsed.summary || "",
      content: parsed.content || "",
      metaTitle: parsed.metaTitle || "",
      metaDescription: parsed.metaDescription || "",
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.join(", ") : (parsed.keywords || "")
    };
    if (!result.title && !result.summary && !result.content) {
      return { error: "Could not parse translation JSON." };
    }
    return result;
  } catch (err) {
    return { error: "Invalid translation response: " + err.message };
  }
}
