# MASTER PROMPT — PettyCash.site Marketing Website Transformation

**File purpose:** This is the single operating manual you (the AI agent) must load and follow for the entire project. Read it fully before writing any code. Do not skip stages. Do not merge stages. Do not proceed to the next stage until the current stage has been explicitly approved by the project owner.

---

## 0. HOW TO USE THIS FILE

You are acting as an autonomous multi-role software and marketing team: SEO Manager, UX Designer, Conversion (CRO) Expert, Content Writer, Technical Architect, and QA Lead — one at a time, depending on the stage.

Rules for how you work through this file:

1. Work **one stage at a time**, in order (Stage 1 → Stage 16). Never start a later stage before the current one is marked "Approved."
2. At the end of every stage, produce a **Stage Report** using the exact format in Section 3 below, and then **stop and wait** for explicit approval ("approved", "continue", "go to stage X") before continuing.
3. If a stage's acceptance criteria are not fully met, say so explicitly, list what is missing, and propose a fix — do not mark it done anyway.
4. Never touch, rewrite, or restructure the actual SaaS application. This project covers the **marketing website only**. The marketing website's only job is to attract visitors, build trust and authority, and convert them into SaaS sign-ups — it does not contain the SaaS product itself.
5. All content, pages, and UI must support **both Arabic (RTL) and English (LTR)**, unless a stage says otherwise.
6. Keep a running changelog file (`/reports/CHANGELOG.md`) and append one entry per stage.
7. If you hit a decision that materially changes scope, budget, or timeline, stop and ask — don't assume.

---

## 1. PROJECT VISION

**Project name:** PettyCash.site Marketing Website Transformation

**Current state:** A standard SaaS landing page (Hero → Features → Pricing → FAQ) that looks like most other SaaS marketing sites and does not generate meaningful organic traffic.

**Target state:** The most useful free resource on the internet for petty cash and expense management — for small and medium businesses — built as a content and tools authority site that happens to sell a SaaS product as the natural next step, not the first ask.

**Core strategic shift:** Stop treating the website as a page that sells the software. Treat it as a library of free tools, templates, calculators, guides, and industry-specific resources that earns organic search traffic continuously — with the SaaS as the logical upgrade path for people who already got value from the site.

**Non-goals:**
- This project does not modify the SaaS application itself.
- This project does not chase paid traffic or ads.
- This project does not aim for a single "big launch" — it aims for compounding weekly progress.

---

## 2. GLOBAL RULES (apply to every stage)

### 2.1 Content Rules
- No thin or duplicate content. Every page must be genuinely useful on its own.
- Long-form content (guides, articles) targets 1,000+ words minimum, ideally 3,000+ for pillar content, in continuous, well-developed prose — not filler.
- Every page needs a clear purpose, a clear next step (CTA), and internal links to at least 3 related pages.
- Bilingual: Arabic and English versions for every content page, each written natively (not machine-translated word-for-word) and each independently SEO-optimized.

### 2.2 SEO Rules
- Every page must have: unique title tag, unique meta description, proper H1–H4 structure, canonical tag, Open Graph tags, and appropriate Schema.org / JSON-LD markup (Article, FAQ, SoftwareApplication, Organization, Breadcrumb, HowTo, or Product as relevant).
- No orphan pages — every new page must be linked from at least one existing page and from the sitemap.
- Target long-tail, high-intent keywords over generic ones.
- Update `sitemap.xml` and `robots.txt` at the end of every stage that adds pages.

### 2.3 UX & Design Rules
- Mobile-first responsive design.
- Consistent design system (colors, spacing, typography) — do not introduce a new visual style per page.
- Every interactive tool (calculator, generator) must work with no login required, and must end with a soft CTA to the SaaS product.
- Accessibility target: WCAG 2.1 AA minimum.

### 2.4 CRO Rules
- Every page needs one primary CTA and, at most, one secondary CTA. No competing calls to action.
- Forms (downloads, email capture) must ask for the minimum viable information (usually just email).
- Trust signals (testimonials, stats, security badges, case studies) should appear near every conversion point, not only on the homepage.

### 2.5 Performance Rules
- Target Lighthouse score 90+ on Performance, Accessibility, Best Practices, and SEO for every shipped page.
- Images optimized and lazy-loaded, critical CSS inlined, JS deferred where possible.
- No new page should regress Core Web Vitals (LCP, CLS, INP) versus the previous stage's baseline.

### 2.6 Technical Stack
- Frontend: Static HTML + TailwindCSS + vanilla JavaScript (or existing framework already in use on the site — confirm before switching).
- Hosting: existing hosting setup (Firebase / Cloudflare — confirm current setup before Stage 1 starts).
- Analytics: Google Analytics 4, Google Search Console, Microsoft Clarity.
- Structured data: Schema.org via JSON-LD only (no microdata).

---

## 3. STAGE REPORT FORMAT (use this exact template after every stage)

```
## Stage [N] Report — [Stage Name]
Status: ✅ Complete / ⚠️ Partial / ❌ Blocked

### What was built
- ...

### Before → After metrics
| KPI | Before | After | Status |
|---|---|---|---|
| ... | ... | ... | ✅/⚠️/❌ |

### Files changed / created
- ...

### Issues found (not yet fixed)
- ...

### Recommendation for next stage
- ...

### Awaiting approval to proceed to Stage [N+1]
```

---

## 4. THE 16 STAGES

---

### STAGE 1 — Website Audit
**Role:** Senior SaaS Growth Consultant + UX + SEO + CRO + Technical Architect
**Rule:** Do not modify anything in this stage. Analysis only.

**Tasks:**
- Crawl every existing page.
- Identify duplicate or thin content.
- Evaluate heading structure, CTA placement, and conversion flow on every page.
- Audit mobile UX, desktop UX, accessibility, and Core Web Vitals.
- Audit internal linking structure and current SEO health (indexed pages, meta quality, schema presence).
- Score the site on: SEO, UX, CRO, Performance, Accessibility (0–100 each).

**Deliverables:** Audit Report, prioritized list of weaknesses and opportunities, quick-win list, baseline scores for all KPIs used throughout the project.

**Acceptance criteria:** Audit Report + Priority List + all 5 baseline scores + a roadmap confirming/adjusting the stage order below.

---

### STAGE 2 — Information Architecture
**Role:** Technical Architect + SEO Manager

**Tasks:**
- Design the full site structure: Tools, Templates, Blog/Learning Center, Industry Pages, Comparison Pages, AI Center, Trust Center, SaaS product pages.
- Define URL structure (e.g. `/tools/`, `/templates/`, `/blog/`, `/industries/`, `/compare/`) in both Arabic and English paths.
- Define the content silo structure and how silos interlink.
- Produce a full sitemap (visual + `sitemap.xml` skeleton).
- Do not write any articles or pages yet — structure only.

**Deliverables:** New sitemap, URL structure document, content hierarchy, internal linking strategy.

**Acceptance criteria:** Every planned page in the 16-stage plan has an assigned URL and a place in the hierarchy; no orphaned sections.

---

### STAGE 3 — Homepage Redesign
**Role:** UX Designer + Conversion Expert + Content Writer

**Tasks:**
- Rebuild the homepage in this order: Hero → Problem → ROI/Savings Calculator (embedded, interactive) → short video/demo → Customer Stories/Social Proof → Free Tools teaser → Templates teaser → AI Assistant teaser → Comparison teaser → Pricing → FAQ → Footer.
- Every section must answer one of: What is this? Why should I care? Why trust it? Why now? What's next?
- Write full Arabic and English copy — not placeholder text.
- Build fully responsive Tailwind markup.

**Deliverables:** Complete homepage (Arabic + English), meta tags, schema markup for Organization + SoftwareApplication.

**Acceptance criteria:** Responsive on mobile/tablet/desktop, Lighthouse 90+, WCAG AA, working ROI calculator with real inputs/outputs.

---

### STAGE 4 — Conversion Optimization Pass
**Role:** CRO Expert

**Tasks:**
- Review every CTA sitewide (not just homepage) for clarity, placement, and consistency.
- Reduce sign-up friction (minimize form fields, clarify what happens after submit).
- Improve typography, whitespace, and scanability across templates.
- Propose 3–5 concrete A/B test ideas with hypotheses (not implemented yet — just documented).

**Deliverables:** CTA audit doc, updated CTA components sitewide, A/B test backlog.

**Acceptance criteria:** One clear primary CTA per page, no conflicting CTAs, all forms minimal-field.

---

### STAGE 5 — SEO Foundation
**Role:** SEO Manager

**Tasks:**
- Implement sitewide meta tag templates (title, description), canonical tags, Open Graph, Twitter Cards.
- Implement JSON-LD schema: Organization, SoftwareApplication, FAQPage, Article, BreadcrumbList — applied consistently across templates, not one-off per page.
- Generate `sitemap.xml` and `robots.txt`.
- Validate everything against Google's Rich Results Test.

**Deliverables:** Schema templates, sitemap, robots.txt, validation report.

**Acceptance criteria:** Zero schema errors in Rich Results Test; sitemap includes every live page.

---

### STAGE 6 — Free Business Tools Hub
**Role:** Content Writer + Frontend Developer

**Tasks:**
- Build `/tools/` hub page.
- Build the following interactive tools, each with its own landing page (Arabic + English), FAQ, schema, and internal links: Expense Savings Calculator, Petty Cash Limit Calculator, VAT Calculator (Saudi context), Expense Policy Generator, Approval Workflow Builder, Internal Control Score Quiz.
- Every tool ends with a soft CTA into the SaaS product.
- Prioritize tools by estimated search volume (research and note this per tool).

**Deliverables:** `/tools/` hub + individual tool pages, each fully functional client-side.

**Acceptance criteria:** Each tool works standalone with no login, mobile-friendly, has real SEO content around it (not just the widget).

---

### STAGE 7 — PDF & Document Tools Expansion
**Role:** Content Writer + SEO Manager

**Tasks:**
- Expand the tools hub with document-generation tools (e.g., Cash Voucher Generator, Receipt Generator, Expense Report Generator) that output downloadable PDFs.
- Give each its own SEO landing page, tutorial section, and FAQ.
- Add comparison callouts where relevant ("vs. doing this manually in Excel").

**Deliverables:** New PDF-generation tool pages, updated internal links, updated sitemap.

**Acceptance criteria:** Each generator produces a correctly formatted downloadable PDF; each page indexed-ready (meta + schema complete).

---

### STAGE 8 — Templates Library
**Role:** Content Writer + Designer

**Tasks:**
- Build `/templates/` library.
- Create downloadable templates: Petty Cash Excel Template, Expense Tracker Excel, Cash Count Sheet, Expense Approval Form, Receipt Register, Petty Cash Policy PDF, Internal Audit Checklist, Finance Dashboard Excel.
- Each template needs its own landing page with a preview, short tutorial, FAQ, and SEO copy.
- Gate downloads behind an email field (minimal — email only).

**Deliverables:** `/templates/` hub + individual template pages + the actual downloadable files.

**Acceptance criteria:** Every template downloads correctly after email capture; email capture integrated with existing list/CRM tool (confirm which one is in use before building).

---

### STAGE 9 — Blog & Content Strategy
**Role:** SEO Manager + Content Strategist

**Tasks:**
- Define content categories: Petty Cash, Expense Management, Accounting, Finance, Internal Control, Saudi VAT & Compliance, Construction Finance.
- Research and cluster keywords per category.
- Produce a prioritized list of 200 article titles ranked by estimated search volume and commercial intent.
- Build a publishing calendar (do not write full articles yet in this stage — planning only).

**Deliverables:** Keyword clusters, 200-title backlog, publishing calendar.

**Acceptance criteria:** Every title mapped to a category, target keyword, and estimated priority (High/Medium/Low).

**Note:** All articles written under this backlog must follow the hard content rule already established for this project: fully human, continuous prose, no bullet-point summarizing anywhere in the article body, minimum 1,000 words (3,000+ for pillar pieces), proper heading structure, images, comparison tables where appropriate, FAQ section, and a clear conclusion with next steps.

---

### STAGE 10 — Industry-Specific Landing Pages
**Role:** Content Writer + SEO Manager

**Tasks:**
- Build dedicated landing pages for: Construction, Restaurants, Clinics, Schools, NGOs, Retail, Manufacturing, Transportation/Logistics.
- Each page: industry-specific pain points, tailored solution framing, a relevant case study or example, FAQ, and CTA.
- No duplicated copy between industry pages — each must be genuinely distinct.

**Deliverables:** `/industries/` section with one page per industry, Arabic + English.

**Acceptance criteria:** Each page targets a distinct keyword cluster; no two industry pages share more than light boilerplate (nav/footer only).

---

### STAGE 11 — Comparison Pages
**Role:** Content Writer + SEO Manager

**Tasks:**
- Build comparison pages: Petty Cash System vs. Excel, vs. Zoho Expense, vs. Expensify, vs. SAP Concur, vs. Odoo.
- Each page: honest, fair comparison table, clear use-case guidance for who should pick what, FAQ, CTA.
- These target high commercial-intent search queries — prioritize accuracy and fairness over sales pressure to preserve trust and SEO longevity.

**Deliverables:** `/compare/` section, one page per competitor/alternative.

**Acceptance criteria:** Comparison tables are factually accurate and up to date; each page has its own schema and meta.

---

### STAGE 12 — Trust Center
**Role:** Content Writer + Technical Architect

**Tasks:**
- Build: Security page, Privacy Policy, Compliance page, Roadmap, Release Notes/Changelog, Status page, Support/Help Center entry point, About/Founder Story, Mission/Vision/Values.

**Deliverables:** `/trust/`, `/about/`, `/security/`, `/privacy/`, `/roadmap/`, `/changelog/`, `/status/` pages.

**Acceptance criteria:** All legal/compliance pages reviewed for accuracy (flag anything requiring the project owner's legal review rather than guessing).

---

### STAGE 13 — AI Center
**Role:** Content Writer + Frontend Developer

**Tasks:**
- Build a dedicated AI Center that reframes the AI assistant from "ask a question" to a task-based tool: "Upload your expense report → AI finds duplicate expenses, missing receipts, fraud indicators, VAT errors."
- Build landing pages for: AI Expense Analyzer, AI Receipt Analyzer, AI Policy Generator.
- Each with a clear before/after example, FAQ, and CTA.

**Deliverables:** `/ai/` section with landing pages for each AI capability.

**Acceptance criteria:** Each page demonstrates a concrete input → output example, not abstract claims.

---

### STAGE 14 — Analytics & Measurement
**Role:** Analytics Expert

**Tasks:**
- Integrate GA4 and Google Search Console (confirm properties exist or need creation).
- Integrate Microsoft Clarity for heatmaps/session recordings.
- Define and implement event tracking: CTA clicks, tool usage, template downloads, email captures, demo requests, sign-ups.
- Build a simple internal dashboard (or Looker Studio report) tracking the KPI table below.

**Deliverables:** Analytics implementation, event tracking plan, dashboard.

**Acceptance criteria:** All key events firing correctly and verified in GA4 real-time view before closing the stage.

---

### STAGE 15 — Performance Optimization
**Role:** Technical Architect

**Tasks:**
- Optimize HTML/CSS/JS, images, fonts.
- Inline critical CSS, defer non-critical JS, lazy-load below-the-fold images.
- Implement caching headers and CDN configuration.
- Re-run Lighthouse on every major template (homepage, tool page, article page, template page, industry page) and fix regressions.

**Deliverables:** Performance optimization report per template type.

**Acceptance criteria:** Lighthouse 90+ across Performance, Accessibility, Best Practices, and SEO on every template type.

---

### STAGE 16 — Final QA & Launch Readiness
**Role:** QA Lead

**Tasks:**
- Full sitewide review: SEO, UX, accessibility, performance, grammar (Arabic and English), internal/external links, schema validity, metadata completeness, responsiveness.
- Check for broken links, orphan pages, duplicate content, missing alt text.
- Produce a final production checklist.

**Deliverables:** Final QA Report, Remaining Issues list (prioritized), Production Checklist.

**Acceptance criteria:** Zero broken links, zero schema validation errors, all pages indexed-ready, all KPIs in the final dashboard table populated.

---

## 5. PROJECT DASHBOARD (update at the end of every stage)

| KPI | Baseline (Stage 1) | Current | Target |
|---|---|---|---|
| Total marketing pages | | | 300+ |
| Free tools live | | | 30 |
| Templates live | | | 100 |
| Blog articles published | | | 200 |
| Industry pages | | | 20 |
| Comparison pages | | | 20 |
| Indexed pages (Search Console) | | | matches total pages |
| Internal links | | | |
| Broken links | | | 0 |
| SEO score | | | 90+ |
| Lighthouse performance | | | 90+ |
| Accessibility score | | | 90+ (AA) |
| Monthly organic visitors | | | 10,000+ |
| Email subscribers | | | 1,000 |
| Demo requests / month | | | 100 |
| Free sign-ups / month | | | 300 |

---

## 6. EXECUTION PROTOCOL (recommended, if your AI agent supports long autonomous runs)

If the coding agent running this file (Claude Code, Cursor Agent, etc.) is capable of long-running autonomous work, use the following operating rhythm instead of one continuous run:

1. Run one stage.
2. Produce the Stage Report (Section 3 format).
3. Stop and wait for explicit approval before starting the next stage.
4. If a stage is rejected or partially approved, fix only the flagged issues, then re-report — do not restart the whole stage from scratch unless told to.
5. Never jump ahead to a later stage "to save time" — later stages depend on the structure and content decisions made in earlier ones.
6. Maintain `/reports/CHANGELOG.md` with one dated entry per approved stage.

## 7. DEFINITION OF DONE (project-level)

The project is complete when:
- All 16 stages are marked Approved in the changelog.
- The Project Dashboard (Section 5) shows Current values meeting or exceeding Target for every KPI, or an explicit, agreed-upon reason why a target was adjusted.
- Stage 16's Final QA Report shows zero unresolved blocking issues.
