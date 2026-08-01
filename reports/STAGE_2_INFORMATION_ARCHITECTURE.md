# Stage 2 — Information Architecture
**Date:** 2026-08-01
**Role:** Technical Architect + SEO Manager
**Rule:** Structure only — no pages or articles were created in this stage.

---

## 1. Design Principles

1. **Content-first URLs** — URLs describe the content, not the technology
2. **Bilingual paths** — English at root, Arabic under `/ar/` prefix
3. **Flat where possible, deep where needed** — max 3 levels deep for content pages
4. **No orphan sections** — every section linked from navbar, footer, or a parent hub
5. **Preserve existing URLs** — don't break already-indexed pages (article.html?slug=, tools/, pdf-tools/)
6. **Keyword-rich slugs** — URLs contain target keywords, not generic IDs

---

## 2. URL Structure Convention

### 2.1 Language Routing

| Language | URL Pattern | Example |
|---|---|---|
| English (default) | `/{section}/{page}.html` | `/tools/vat-calculator.html` |
| Arabic | `/ar/{section}/{page}.html` | `/ar/tools/vat-calculator.html` |

**Rules:**
- English is the default (no `/en/` prefix) — preserves existing URLs and SEO equity
- Arabic uses `/ar/` prefix — clean, standard approach for bilingual sites
- `hreflang` tags on every page: `en` → canonical URL, `ar` → `/ar/` URL
- Language switcher toggles between the two paths
- Homepage: `/` (EN), `/ar/` (AR)

### 2.2 URL Slug Rules
- Lowercase, hyphen-separated
- Keyword-rich (e.g., `/industries/construction-finance.html` not `/industries/construction.html`)
- No trailing slashes on `.html` pages (consistent with existing site)
- Directory index pages use `/` (e.g., `/tools/`, `/templates/`)
- Max 60 characters per slug

### 2.3 Existing URL Preservation

| Existing URL | Action | Reason |
|---|---|---|
| `/index.html` → `/` | Keep | Homepage, already indexed |
| `/features.html` | Keep | Already indexed |
| `/pricing.html` | Keep | Already indexed |
| `/blog.html` | Keep | Already indexed |
| `/article.html?slug=...` | Keep | 260+ articles indexed; changing to clean URLs would require redirects — deferred to future optimization |
| `/about.html` | Keep, expand | Already indexed |
| `/contact.html` | Keep | Already indexed |
| `/help.html` | Keep | Already indexed |
| `/tools/` + 3 tool pages | Keep, expand | Already indexed |
| `/pdf-tools/` + 42 pages | Keep | Already built, need sitemap addition |

---

## 3. Full Site Map — Section Hierarchy

```
pettycash.site/
│
├── /  (Homepage — EN)
├── /ar/  (Homepage — AR)
│
├── CORE SAAS PAGES
│   ├── /features.html
│   ├── /pricing.html
│   ├── /about.html → /about/  (expand to section)
│   │   ├── /about/founder-story.html
│   │   ├── /about/mission.html
│   │   └── /about/values.html
│   ├── /contact.html
│   └── /help.html
│
├── /tools/  (Free Business Tools Hub)
│   ├── /tools/expense-savings-calculator.html
│   ├── /tools/petty-cash-limit-calculator.html
│   ├── /tools/vat-calculator.html
│   ├── /tools/expense-policy-generator.html
│   ├── /tools/approval-workflow-builder.html
│   ├── /tools/internal-control-score-quiz.html
│   ├── /tools/cash-voucher-generator.html  (existing → rename from petty-cash-voucher-generator)
│   ├── /tools/receipt-generator.html  (existing)
│   ├── /tools/saudi-invoice-generator.html  (existing)
│   ├── /tools/expense-report-generator.html  (Stage 7)
│   ├── /tools/cash-count-sheet-generator.html  (Stage 7)
│   └── /tools/  (hub page lists all tools)
│
├── /pdf-tools/  (Free PDF Tools Hub — existing, 42 tools)
│   ├── /pdf-tools/merge-pdf.html
│   ├── /pdf-tools/split-pdf.html
│   ├── /pdf-tools/compress-pdf.html
│   ├── ... (40 more existing tools)
│   └── /pdf-tools/  (hub page)
│
├── /templates/  (Templates Library Hub)
│   ├── /templates/petty-cash-excel-template.html
│   ├── /templates/expense-tracker-excel.html
│   ├── /templates/cash-count-sheet.html
│   ├── /templates/expense-approval-form.html
│   ├── /templates/receipt-register.html
│   ├── /templates/petty-cash-policy-pdf.html
│   ├── /templates/internal-audit-checklist.html
│   ├── /templates/finance-dashboard-excel.html
│   └── /templates/  (hub page lists all templates)
│
├── /blog/  (Blog & Learning Center)
│   ├── /blog.html  (existing listing page)
│   ├── /article.html?slug=...  (existing article viewer, ~260 articles)
│   └── /blog/  (future: convert to directory with clean URLs)
│
├── /industries/  (Industry-Specific Landing Pages)
│   ├── /industries/construction-finance.html
│   ├── /industries/restaurant-finance.html
│   ├── /industries/clinic-finance.html
│   ├── /industries/school-finance.html
│   ├── /industries/ngo-finance.html
│   ├── /industries/retail-finance.html
│   ├── /industries/manufacturing-finance.html
│   └── /industries/logistics-finance.html
│
├── /compare/  (Comparison Pages)
│   ├── /compare/pettycash-vs-excel.html
│   ├── /compare/pettycash-vs-zoho-expense.html
│   ├── /compare/pettycash-vs-expensify.html
│   ├── /compare/pettycash-vs-sap-concur.html
│   └── /compare/pettycash-vs-odoo.html
│
├── /ai/  (AI Center)
│   ├── /ai/  (hub page)
│   ├── /ai/expense-analyzer.html
│   ├── /ai/receipt-analyzer.html
│   └── /ai/policy-generator.html
│
├── /trust/  (Trust Center)
│   ├── /trust/  (hub page)
│   ├── /security.html
│   ├── /privacy.html
│   ├── /compliance.html
│   ├── /roadmap.html
│   ├── /changelog.html
│   └── /status.html
│
└── Arabic mirrors (all under /ar/):
    /ar/tools/...
    /ar/templates/...
    /ar/industries/...
    /ar/compare/...
    /ar/ai/...
    /ar/trust/...
    /ar/features.html
    /ar/pricing.html
    /ar/blog.html
    /ar/about.html
    /ar/contact.html
    /ar/help.html
```

---

## 4. Content Silo Structure & Internal Linking Strategy

### 4.1 Silo Map

```
                    ┌─────────────┐
                    │  HOMEPAGE   │
                    └──────┬──────┘
                           │
        ┌──────────┬───────┼───────┬──────────┐
        ▼          ▼       ▼       ▼          ▼
   ┌─────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
   │  TOOLS  │ │ BLOG │ │TEMPL.│ │INDUST.│ │COMPARE│
   │  SILO   │ │SILO  │ │SILO  │ │ SILO  │ │ SILO  │
   └────┬────┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘
        │         │        │        │        │
        ▼         ▼        ▼        ▼        ▼
   [Tool pages] [Articles] [Templates] [Industry] [Compare]
        │         │        │        │        │
        └────┬────┘        │        │        │
             ▼             │        │        │
        ┌─────────┐        │        │        │
        │  AI     │        │        │        │
        │ CENTER  │◄───────┘────────┘────────┘
        └─────────┘
              │
              ▼
        ┌─────────┐
        │  TRUST  │
        │ CENTER  │
        └─────────┘
```

### 4.2 Silo Definitions

#### Silo 1: Free Tools (`/tools/` + `/pdf-tools/`)
**Purpose:** Attract top-of-funnel traffic searching for free business/PDF tools
**Pages:** 12 business tools + 42 PDF tools = 54 pages
**Internal links:**
- Every tool page → SaaS CTA (soft)
- Every tool page → 2 related tools (cross-link within silo)
- Every tool page → 1 related blog article (cross-link to Blog silo)
- Tools hub → all tool pages
- Homepage → tools showcase section

#### Silo 2: Blog & Learning Center (`/blog.html` + articles)
**Purpose:** Attract mid-funnel traffic with educational content
**Pages:** ~260 existing + 200 planned = 460 articles
**Internal links:**
- Every article → 3 related articles (same category)
- Every article → 1 relevant tool (cross-link to Tools silo)
- Every article → 1 relevant industry page (cross-link to Industries silo, if applicable)
- Every article → SaaS CTA at end
- Blog listing → all articles via search/tags/pagination
- Homepage → latest articles section (unhide)

#### Silo 3: Templates Library (`/templates/`)
**Purpose:** Lead generation via email-gated downloads
**Pages:** 8 template pages (Stage 8) → expand to 100
**Internal links:**
- Every template page → 1 related tool (cross-link to Tools silo)
- Every template page → 1 related blog article (cross-link to Blog silo)
- Templates hub → all template pages
- Homepage → templates teaser section
- Email capture form → SaaS CTA after download

#### Silo 4: Industry Pages (`/industries/`)
**Purpose:** Capture industry-specific search intent
**Pages:** 8 industries (Stage 10) → expand to 20
**Internal links:**
- Every industry page → 1 relevant tool (cross-link to Tools silo)
- Every industry page → 1 relevant template (cross-link to Templates silo)
- Every industry page → 1 relevant comparison page (cross-link to Compare silo)
- Every industry page → 2 related blog articles (cross-link to Blog silo)
- Industries hub → all industry pages
- Homepage → industries teaser (Stage 3 redesign)

#### Silo 5: Comparison Pages (`/compare/`)
**Purpose:** Capture bottom-of-funnel commercial intent
**Pages:** 5 comparisons (Stage 11) → expand to 20
**Internal links:**
- Every comparison page → SaaS CTA (primary)
- Every comparison page → 1 relevant industry page (cross-link)
- Every comparison page → 1 relevant blog article (cross-link)
- Compare hub → all comparison pages
- Homepage → comparison teaser (Stage 3 redesign)

#### Silo 6: AI Center (`/ai/`)
**Purpose:** Differentiate product, capture AI-related search intent
**Pages:** 3 AI capability pages (Stage 13)
**Internal links:**
- Every AI page → SaaS CTA (primary)
- Every AI page → 1 relevant tool (cross-link to Tools silo)
- AI hub → all AI pages
- Homepage → AI teaser (Stage 3 redesign)

#### Silo 7: Trust Center (`/trust/` + legal pages)
**Purpose:** Build trust, satisfy compliance requirements
**Pages:** 7 pages (Stage 12)
**Internal links:**
- Trust hub → all trust pages
- Footer → links to Security, Privacy, Compliance, Status
- Every page → footer links to Trust Center pages
- About page → links to Founder Story, Mission, Values

### 4.3 Cross-Silo Linking Rules

| From → To | Link Type | Frequency |
|---|---|---|
| Tools → Blog | "Learn more about [topic]" | 1 per tool page |
| Tools → SaaS CTA | "Upgrade to automate this" | 1 per tool page (soft) |
| Blog → Tools | "Try our free [tool name]" | 1 per article |
| Blog → Industries | "See how [industry] uses this" | 1 per article (if applicable) |
| Industries → Tools | "Free [tool] for [industry]" | 1 per industry page |
| Industries → Compare | "Compare PettyCash vs alternatives" | 1 per industry page |
| Compare → SaaS CTA | "Get started free" | 1 per comparison page (primary) |
| Templates → Tools | "Use [tool] alongside this template" | 1 per template page |
| AI → SaaS CTA | "Try the AI-powered version" | 1 per AI page (primary) |
| All pages → Trust | Footer links | Every page |

### 4.4 Navigation Architecture

#### Navbar (all pages)
| Link | Dropdown items |
|---|---|
| Home | — |
| Features | — |
| Pricing | — |
| Tools ▾ | Business Tools, PDF Tools |
| Templates | — (new) |
| Blog | — |
| Industries ▾ | Construction, Restaurants, Clinics, Schools, NGOs, Retail, Manufacturing, Logistics |
| Compare ▾ | vs Excel, vs Zoho, vs Expensify, vs SAP Concur, vs Odoo |
| AI Center | — (new) |
| Help | — |
| About ▾ | Our Story, Mission, Values, Security, Privacy |
| Contact | — |

#### Footer (all pages)
| Column | Links |
|---|---|
| Product | Features, Pricing, AI Center, Compare |
| Free Tools | Business Tools, PDF Tools, Templates |
| Resources | Blog, Help Center, Industries |
| Company | About, Contact, Security, Privacy, Compliance, Roadmap, Changelog, Status |
| Legal | Privacy Policy, Terms of Service |

---

## 5. Sitemap.xml Skeleton

### 5.1 New Pages to Add to Sitemap

```
-- Core pages (existing, keep)
/ (priority 1.0, weekly)
/features.html (0.8, monthly)
/pricing.html (0.8, monthly)
/blog.html (0.7, weekly)
/help.html (0.7, monthly)
/about.html (0.7, monthly)
/contact.html (0.7, monthly)

-- About section (new)
/about/founder-story.html (0.6, monthly)
/about/mission.html (0.6, monthly)
/about/values.html (0.6, monthly)

-- Business Tools (existing + new)
/tools/ (0.9, weekly)
/tools/saudi-invoice-generator.html (0.7, monthly) [existing]
/tools/receipt-generator.html (0.7, monthly) [existing]
/tools/petty-cash-voucher-generator.html (0.7, monthly) [existing]
/tools/expense-savings-calculator.html (0.8, monthly) [new - Stage 6]
/tools/petty-cash-limit-calculator.html (0.8, monthly) [new - Stage 6]
/tools/vat-calculator.html (0.8, monthly) [new - Stage 6]
/tools/expense-policy-generator.html (0.8, monthly) [new - Stage 6]
/tools/approval-workflow-builder.html (0.8, monthly) [new - Stage 6]
/tools/internal-control-score-quiz.html (0.7, monthly) [new - Stage 6]
/tools/expense-report-generator.html (0.7, monthly) [new - Stage 7]
/tools/cash-count-sheet-generator.html (0.7, monthly) [new - Stage 7]

-- PDF Tools (existing — ADD ALL 42 to sitemap)
/pdf-tools/ (0.9, weekly)
/pdf-tools/merge-pdf.html (0.7, monthly)
/pdf-tools/split-pdf.html (0.7, monthly)
/pdf-tools/compress-pdf.html (0.7, monthly)
... (all 42 PDF tool pages)

-- Templates (new - Stage 8)
/templates/ (0.9, weekly)
/templates/petty-cash-excel-template.html (0.7, monthly)
/templates/expense-tracker-excel.html (0.7, monthly)
/templates/cash-count-sheet.html (0.7, monthly)
/templates/expense-approval-form.html (0.7, monthly)
/templates/receipt-register.html (0.7, monthly)
/templates/petty-cash-policy-pdf.html (0.7, monthly)
/templates/internal-audit-checklist.html (0.7, monthly)
/templates/finance-dashboard-excel.html (0.7, monthly)

-- Industries (new - Stage 10)
/industries/ (0.8, weekly)
/industries/construction-finance.html (0.8, monthly)
/industries/restaurant-finance.html (0.8, monthly)
/industries/clinic-finance.html (0.8, monthly)
/industries/school-finance.html (0.8, monthly)
/industries/ngo-finance.html (0.8, monthly)
/industries/retail-finance.html (0.8, monthly)
/industries/manufacturing-finance.html (0.8, monthly)
/industries/logistics-finance.html (0.8, monthly)

-- Compare (new - Stage 11)
/compare/ (0.8, weekly)
/compare/pettycash-vs-excel.html (0.8, monthly)
/compare/pettycash-vs-zoho-expense.html (0.8, monthly)
/compare/pettycash-vs-expensify.html (0.8, monthly)
/compare/pettycash-vs-sap-concur.html (0.8, monthly)
/compare/pettycash-vs-odoo.html (0.8, monthly)

-- AI Center (new - Stage 13)
/ai/ (0.8, weekly)
/ai/expense-analyzer.html (0.8, monthly)
/ai/receipt-analyzer.html (0.8, monthly)
/ai/policy-generator.html (0.8, monthly)

-- Trust Center (new - Stage 12)
/trust/ (0.7, monthly)
/security.html (0.7, monthly)
/privacy.html (0.7, yearly)
/compliance.html (0.7, monthly)
/roadmap.html (0.7, monthly)
/changelog.html (0.7, monthly)
/status.html (0.7, weekly)

-- Arabic mirrors (all new)
/ar/ (1.0, weekly)
/ar/features.html (0.8, monthly)
/ar/pricing.html (0.8, monthly)
/ar/blog.html (0.7, weekly)
/ar/help.html (0.7, monthly)
/ar/about.html (0.7, monthly)
/ar/contact.html (0.7, monthly)
/ar/tools/ (0.9, weekly)
/ar/tools/*.html (0.7-0.8, monthly)
/ar/pdf-tools/ (0.9, weekly)
/ar/pdf-tools/*.html (0.7, monthly)
/ar/templates/ (0.9, weekly)
/ar/templates/*.html (0.7, monthly)
/ar/industries/ (0.8, weekly)
/ar/industries/*.html (0.8, monthly)
/ar/compare/ (0.8, weekly)
/ar/compare/*.html (0.8, monthly)
/ar/ai/ (0.8, weekly)
/ar/ai/*.html (0.8, monthly)
/ar/trust/ (0.7, monthly)
/ar/security.html (0.7, monthly)
/ar/privacy.html (0.7, yearly)
/ar/compliance.html (0.7, monthly)
/ar/roadmap.html (0.7, monthly)
/ar/changelog.html (0.7, monthly)
/ar/status.html (0.7, weekly)

-- Articles (existing ~260, keep)
/article.html?slug=... (0.6, monthly) [all existing articles]
```

### 5.2 Sitemap Priority Tiers

| Priority | Page Type | Rationale |
|---|---|---|
| 1.0 | Homepage | Most important page |
| 0.9 | Hub pages (tools, templates, pdf-tools) | High-value entry points |
| 0.8 | Features, Pricing, Industry, Compare, AI, Calculators | High commercial intent |
| 0.7 | Individual tools, templates, trust pages, help, about, contact | Supporting pages |
| 0.6 | Blog articles, about sub-pages | Content pages, high volume |

---

## 6. Page Count Summary

| Section | EN Pages | AR Pages | Total | Stage |
|---|---|---|---|---|
| Core (home, features, pricing, about, contact, help) | 8 | 8 | 16 | Existing + Stage 3, 12 |
| Business Tools | 12 | 12 | 24 | Stage 6-7 (3 existing) |
| PDF Tools | 42 | 42 | 84 | Existing (add to sitemap) |
| Templates | 8 | 8 | 16 | Stage 8 |
| Blog Articles | ~260 | ~260 | ~520 | Existing (Stage 9 strategy) |
| Industries | 8 | 8 | 16 | Stage 10 |
| Compare | 5 | 5 | 10 | Stage 11 |
| AI Center | 4 | 4 | 8 | Stage 13 |
| Trust Center | 7 | 7 | 14 | Stage 12 |
| **Total** | **~354** | **~354** | **~708** | |

**Note:** The target of 300+ marketing pages is exceeded when counting both languages. Even EN-only, the site will have 354+ pages, well above the 300 target.

---

## 7. Implementation Notes

### 7.1 Arabic Page Strategy
- Arabic pages are **separate HTML files** (not JS-translated) for SEO independence
- Each Arabic page has its own meta tags, schema, and content natively written in Arabic
- `hreflang` tags link EN ↔ AR pairs
- Arabic pages use `dir="rtl"` and `lang="ar"`
- Shared components (navbar, footer) use the existing `translations.js` system

### 7.2 Hub Page Strategy
- Every section has a hub/index page (`/tools/`, `/templates/`, `/industries/`, `/compare/`, `/ai/`, `/trust/`)
- Hub pages list all child pages with descriptions and links
- Hub pages have their own SEO content (not just link lists)
- Hub pages are the primary navigation entry point to each silo

### 7.3 Breadcrumb Strategy
- Every page (except homepage) has a `BreadcrumbList` schema
- Breadcrumb UI component added in Stage 3-4
- Pattern: Home → [Section] → [Page]
- Example: Home → Tools → VAT Calculator

### 7.4 Footer Strategy
- Footer appears on every page with links to all major sections
- Trust Center links (Security, Privacy, Compliance) in footer for every page
- This ensures no orphan pages — even deep content pages link to all sections

---

## 8. Acceptance Criteria Checklist

| Criterion | Status |
|---|---|
| Every planned page in the 16-stage plan has an assigned URL | ✅ Section 3 |
| Every planned page has a place in the hierarchy | ✅ Section 3, 4 |
| No orphaned sections | ✅ Section 4.3-4.4 (navbar + footer link to all sections) |
| URL structure defined in both Arabic and English | ✅ Section 2.1 |
| Content silo structure defined | ✅ Section 4.1-4.2 |
| Internal linking strategy defined | ✅ Section 4.3 |
| Full sitemap (visual + skeleton) produced | ✅ Section 3 (visual) + Section 5 (skeleton) |

---

## Stage 2 Report — Information Architecture
Status: ✅ Complete

### What was built
- Complete site structure with 7 content silos
- URL conventions for English (root) and Arabic (`/ar/` prefix)
- Content hierarchy with all planned pages assigned URLs
- Internal linking strategy with cross-silo rules
- Navbar and footer architecture
- Sitemap.xml skeleton with priority tiers
- Page count summary: ~354 EN pages + ~354 AR pages = ~708 total

### Before → After metrics
| KPI | Before | After | Status |
|---|---|---|---|
| Defined sections | 6 (core + tools + pdf-tools) | 13 (core + tools + pdf-tools + templates + blog + industries + compare + ai + trust) | ✅ |
| URL structure documented | No | Yes | ✅ |
| Internal linking strategy | Ad-hoc | Systematic (cross-silo rules) | ✅ |
| Arabic URL plan | None | `/ar/` prefix for all pages | ✅ |
| Orphan sections | Risk present | Eliminated (navbar + footer coverage) | ✅ |

### Files changed / created
- `reports/STAGE_2_INFORMATION_ARCHITECTURE.md` (this file)

### Issues found (not yet fixed)
- None — this is a planning stage, no code changes made

### Recommendation for next stage
Proceed to **Stage 3 — Homepage Redesign** to rebuild the homepage with the new section structure, ROI calculator, and full Arabic/English copy.

### Awaiting approval to proceed to Stage 3
