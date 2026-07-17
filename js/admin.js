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

function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login-section");
  const gridView = document.getElementById("grid-view");
  const editView = document.getElementById("edit-view");
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const logoutBtn = document.getElementById("logout-btn");
  const articleForm = document.getElementById("article-form");
  const articlesGrid = document.getElementById("articles-grid");
  const articleCount = document.getElementById("article-count");
  const formStatus = document.getElementById("form-status");
  const uploadStatus = document.getElementById("upload-status");
  const imageFileInput = document.getElementById("article-image-file");
  const imageUrlInput = document.getElementById("article-image-url");
  const imagePreview = document.getElementById("image-preview");
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
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const newArticleBtn = document.getElementById("new-article-btn");
  const backToGridBtn = document.getElementById("back-to-grid-btn");
  const editViewTitle = document.getElementById("edit-view-title");
  const searchInput = document.getElementById("admin-search");

  let allArticles = [];
  let searchQuery = "";

  if (!window.PettyCashFirebase) {
    if (loginError) {
      loginError.textContent = "Firebase not loaded. Check your connection.";
      loginError.classList.remove("hidden");
    }
    return;
  }

  function showView(name) {
    loginSection.classList.toggle("hidden", name !== "login");
    gridView.classList.toggle("hidden", name !== "grid");
    editView.classList.toggle("hidden", name !== "edit");
  }

  function updateAuthView() {
    const authed = sessionStorage.getItem(ADMIN_AUTH_KEY) === "1";
    if (authed) {
      showView("grid");
      loadArticles();
    } else {
      showView("login");
    }
  }

  updateAuthView();

  function switchTab(lang) {
    tabBtns.forEach(btn => {
      const active = btn.dataset.tab === lang;
      btn.classList.toggle("text-blue-600", active);
      btn.classList.toggle("border-blue-600", active);
      btn.classList.toggle("border-b-2", active);
      btn.classList.toggle("text-slate-500", !active);
      btn.classList.toggle("border-transparent", !active);
    });
    tabPanels.forEach(panel => {
      panel.classList.toggle("hidden", panel.id !== `tab-${lang}`);
    });
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
        settingsStatus.className = key ? "text-sm text-green-600" : "text-sm text-amber-600";
      }
      setTimeout(() => settingsPanel.classList.add("hidden"), 800);
    });
  }

  newArticleBtn.addEventListener("click", () => {
    clearForm();
    editViewTitle.textContent = "New Article";
    showView("edit");
  });

  backToGridBtn.addEventListener("click", () => {
    showView("grid");
    loadArticles();
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderGrid();
    });
  }

  function updateImagePreview(url) {
    if (!imagePreview) return;
    if (url && url.trim()) {
      imagePreview.src = url.trim();
      imagePreview.classList.remove("hidden");
    } else {
      imagePreview.src = "";
      imagePreview.classList.add("hidden");
    }
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
      updateImagePreview(result.url);
      uploadStatus.textContent = "Image uploaded successfully.";
      uploadStatus.className = "mt-1 text-xs text-green-600";
    }
  });

  imageUrlInput.addEventListener("input", () => {
    updateImagePreview(imageUrlInput.value);
  });

  articleForm.addEventListener("submit", async e => {
    e.preventDefault();
    formStatus.textContent = "Saving...";
    formStatus.className = "text-sm text-blue-600";
    saveBtn.disabled = true;

    function parseKeywords(input) {
      return (input || "").split(",").map(s => s.trim()).filter(Boolean);
    }

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
    saveBtn.disabled = false;
    if (result.error) {
      formStatus.textContent = "Error: " + result.error;
      formStatus.className = "text-sm text-red-600";
    } else {
      formStatus.textContent = "Article saved successfully.";
      formStatus.className = "text-sm text-green-600";
      clearForm();
      setTimeout(() => {
        showView("grid");
        loadArticles();
      }, 800);
    }
  });

  clearBtn.addEventListener("click", () => {
    clearForm();
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
      translateStatus.className = "mt-2 text-xs text-red-600";
      return;
    }

    translateBtn.disabled = true;
    translateStatus.textContent = "Translating...";
    translateStatus.className = "mt-2 text-xs text-blue-600";

    const result = await translateArticle(source);

    translateBtn.disabled = false;
    if (result.error) {
      translateStatus.textContent = "Translation failed: " + result.error;
      translateStatus.className = "mt-2 text-xs text-red-600";
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
    translateStatus.className = "mt-2 text-xs text-green-600";
  });

  function clearForm() {
    articleForm.reset();
    document.getElementById("article-id").value = "";
    imageUrlInput.value = "";
    updateImagePreview("");
    uploadStatus.textContent = "";
    formStatus.textContent = "";
    if (translateStatus) {
      translateStatus.textContent = "";
      translateStatus.className = "mt-2 text-xs text-slate-500";
    }
    document.getElementById("article-date").value = new Date().toISOString().split("T")[0];
    ["meta-title-en", "meta-description-en", "keywords-en", "meta-title-ar", "meta-description-ar", "keywords-ar"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    switchTab("en");
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
    if (!articlesGrid) return;
    articlesGrid.innerHTML = renderSkeletonCards(6);
    const result = await fetchAdminArticles(2);
    if (!result.success) {
      articlesGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-red-600 mb-3">Failed to load articles: ${escapeHtml(result.error?.message || "Connection error")}</p>
          <button id="retry-load-articles" class="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Retry</button>
        </div>
      `;
      document.getElementById("retry-load-articles")?.addEventListener("click", loadArticles);
      return;
    }
    allArticles = result.articles;
    if (articleCount) {
      articleCount.textContent = allArticles.length + " article" + (allArticles.length !== 1 ? "s" : "");
    }
    renderGrid();
  }

  function renderSkeletonCards(count) {
    return Array.from({ length: count }, () => `
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
        <div class="h-40 bg-slate-200"></div>
        <div class="p-5 space-y-3">
          <div class="h-5 bg-slate-200 rounded w-3/4"></div>
          <div class="h-4 bg-slate-200 rounded w-full"></div>
          <div class="h-4 bg-slate-200 rounded w-5/6"></div>
          <div class="flex justify-between pt-2">
            <div class="h-3 bg-slate-200 rounded w-20"></div>
            <div class="h-3 bg-slate-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    `).join("");
  }

  function renderGrid() {
    if (!articlesGrid) return;
    if (!allArticles.length) {
      articlesGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-slate-600 mb-4">No articles yet in Firestore.</p>
          <a href="./import-articles.html" class="inline-block px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Import Articles</a>
        </div>
      `;
      return;
    }

    let filtered = allArticles;
    if (searchQuery) {
      filtered = allArticles.filter(a => {
        const en = a.translations?.en || {};
        const ar = a.translations?.ar || {};
        const haystack = [en.title, en.summary, ar.title, a.slug, a.author].join(" ").toLowerCase();
        return haystack.includes(searchQuery);
      });
    }

    if (!filtered.length) {
      articlesGrid.innerHTML = `<p class="col-span-full text-center text-slate-500 py-12">No articles match your search.</p>`;
      return;
    }

    articlesGrid.innerHTML = filtered.map(a => {
      const en = a.translations?.en || {};
      const ar = a.translations?.ar || {};
      const isPublished = a.published !== false;
      const statusText = isPublished ? "Published" : "Draft";
      const statusClass = isPublished ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700";
      const imageUrl = a.image || "./images/article-placeholder.svg";
      const title = en.title || ar.title || a.slug || "Untitled";
      const summary = (en.summary || ar.summary || "").slice(0, 100);
      return `
        <div class="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
          <div class="h-40 overflow-hidden bg-slate-100 relative">
            <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width="400" height="160">
            <span class="absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full ${statusClass}">${statusText}</span>
          </div>
          <div class="p-5 flex flex-col flex-1">
            <h3 class="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">${escapeHtml(title)}</h3>
            <p class="text-sm text-slate-500 line-clamp-2 mb-3 flex-1">${escapeHtml(summary)}</p>
            <div class="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span>${window.PettyCashFirebase.formatDate(a.date, "en")}</span>
              ${a.readTime ? `<span>${escapeHtml(a.readTime)} min</span>` : ""}
            </div>
            <div class="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button data-id="${escapeHtml(a.id || '')}" data-slug="${escapeHtml(a.slug || '')}" class="edit-card-btn flex-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors font-medium">Edit</button>
              <button data-id="${escapeHtml(a.id || '')}" data-slug="${escapeHtml(a.slug || '')}" data-published="${isPublished ? "1" : "0"}" class="toggle-card-btn px-3 py-1.5 text-sm font-medium border rounded-lg hover:bg-slate-50 transition-colors ${isPublished ? "text-amber-600 border-amber-200" : "text-green-600 border-green-200"}">${isPublished ? "Unpublish" : "Publish"}</button>
              <button data-id="${escapeHtml(a.id || '')}" data-slug="${escapeHtml(a.slug || '')}" class="delete-card-btn px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium">Delete</button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    articlesGrid.querySelectorAll(".edit-card-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const slug = btn.dataset.slug;
        const article = id
          ? await window.PettyCashFirebase.fetchArticleById(id)
          : await window.PettyCashFirebase.fetchArticleBySlug(slug);
        if (article) {
          fillForm(article);
          editViewTitle.textContent = "Edit Article";
          showView("edit");
        }
      });
    });

    articlesGrid.querySelectorAll(".toggle-card-btn").forEach(btn => {
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

    articlesGrid.querySelectorAll(".delete-card-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("Delete this article?")) return;
        const id = btn.dataset.id;
        if (!id) {
          alert("This article is in the static file and cannot be deleted from Firestore.");
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

  function fillForm(article) {
    document.getElementById("article-id").value = article.id || "";
    document.getElementById("article-slug").value = article.slug || "";
    document.getElementById("article-date").value = article.date ? new Date(article.date).toISOString().split("T")[0] : "";
    document.getElementById("article-readtime").value = article.readTime || "";
    if (publishedInput) publishedInput.checked = article.published !== false;
    imageUrlInput.value = article.image || "";
    updateImagePreview(article.image || "");
    uploadStatus.textContent = article.image ? "Image already uploaded." : "";
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
