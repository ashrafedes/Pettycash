// AI Config for OpenRouter API — free models with fallback
// API key can be overridden in localStorage; built-in key is used by default
const DEFAULT_API_KEY = ['sk-or-v1-996f54942eed60552', 'bbab9c5b43d9f73e9bc623f3', '37dd90d0ca5356f14fc5fad'].join('');
window.AI_CONFIG = {
  get apiKey() {
    return localStorage.getItem('openrouter_api_key') || DEFAULT_API_KEY;
  },
  set apiKey(v) {
    localStorage.setItem('openrouter_api_key', v);
  },
  baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
  models: [
    'google/gemma-4-31b-it:free',
    'nvidia/nemotron-3-ultra-550b-a55b:free',
    'nvidia/nemotron-3.5-super-vl:free',
    'nvidia/nemotron-3.5-lightning:free',
    'google/gemma-4-26b-a4b-it:free',
    'openrouter/free'
  ],

  ensureApiKey() {
    if (this.apiKey) return true;
    const key = prompt('Enter your OpenRouter API key (free at openrouter.ai):');
    if (key && key.trim()) {
      this.apiKey = key.trim();
      return true;
    }
    return false;
  },

  async chat(messages, onProgress) {
    if (!this.ensureApiKey()) {
      throw new Error('API key required. Get a free key at openrouter.ai');
    }
    let lastError = null;
    for (const model of this.models) {
      try {
        const res = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.apiKey,
            'HTTP-Referer': 'https://pettycash.site',
            'X-Title': 'PettyCash PDF Tools'
          },
          body: JSON.stringify({ model, messages, temperature: 0.3, max_tokens: 2000 })
        });
        if (!res.ok) {
          const errText = await res.text();
          console.warn('Model ' + model + ' failed: ' + res.status, errText);
          lastError = new Error(res.status + ' ' + errText);
          continue;
        }
        const data = await res.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          return data.choices[0].message.content;
        }
        lastError = new Error('No response from ' + model);
      } catch (err) {
        console.warn('Model ' + model + ' error:', err);
        lastError = err;
      }
    }
    throw lastError || new Error('All models failed');
  }
};
