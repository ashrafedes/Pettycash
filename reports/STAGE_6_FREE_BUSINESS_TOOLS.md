# Stage 6 — Free Business Tools Hub

**Date:** 2026-08-01  
**Status:** ✅ Complete (Awaiting Approval)

## Overview

Built 6 new interactive business tools on the `/tools/` hub, each with its own landing page, FAQ, schema markup, soft CTA, and full bilingual (English + Arabic) support. Updated the tools hub page, navigation, and sitemap.

## Tools Built

### 1. Expense Savings Calculator
- **URL:** `/tools/expense-savings-calculator.html`
- **Function:** Calculates annual savings from automating expense tracking based on employees, transactions, manual hours, hourly cost, and average expense
- **Outputs:** Time saved, error reduction savings, labor cost savings, total annual savings
- **Schema:** BreadcrumbList, SoftwareApplication, FAQPage
- **Search Volume Note:** "expense savings calculator" — moderate volume, high intent

### 2. Petty Cash Limit Calculator
- **URL:** `/tools/petty-cash-limit-calculator.html`
- **Function:** Calculates optimal petty cash float based on daily expenses, replenishment cycle, and safety buffer
- **Outputs:** Base float, safety buffer amount, recommended limit, contextual recommendation
- **Schema:** BreadcrumbList, SoftwareApplication, FAQPage
- **Search Volume Note:** "petty cash limit calculator" — niche, low competition

### 3. VAT Calculator (Saudi Context)
- **URL:** `/tools/vat-calculator.html`
- **Function:** Calculates 15% Saudi VAT on any amount — inclusive or exclusive mode, with custom rate support
- **Outputs:** Net amount, VAT amount, total amount
- **Schema:** BreadcrumbList, SoftwareApplication, FAQPage
- **Search Volume Note:** "VAT calculator Saudi Arabia" — high volume, high competition

### 4. Expense Policy Generator
- **URL:** `/tools/expense-policy-generator.html`
- **Function:** Generates a professional expense policy document based on company name, thresholds, categories, receipt requirements, and approval rules
- **Outputs:** Copyable policy document with 7 sections
- **Schema:** BreadcrumbList, SoftwareApplication, FAQPage
- **Search Volume Note:** "expense policy template" — moderate volume, low competition

### 5. Approval Workflow Builder
- **URL:** `/tools/approval-workflow-builder.html`
- **Function:** Design custom multi-level approval workflows with role, min/max thresholds, and visual summary
- **Outputs:** Copyable workflow summary with approval chain
- **Schema:** BreadcrumbList, SoftwareApplication, FAQPage
- **Search Volume Note:** "approval workflow" — moderate volume, B2B intent

### 6. Internal Control Score Quiz
- **URL:** `/tools/internal-control-score-quiz.html`
- **Function:** 10-question quiz assessing internal control strength across segregation of duties, documentation, approvals, reconciliation, and access controls
- **Outputs:** Score (0-100), category label, personalized recommendations
- **Schema:** BreadcrumbList, SoftwareApplication, FAQPage
- **Search Volume Note:** "internal control assessment" — niche, high-value B2B

## Features

All 6 tools share these features:
- **Fully client-side** — no login, no server calls, no data leaves the browser
- **Bilingual** — English (LTR) and Arabic (RTL) with `data-i18n-en` / `data-i18n-ar` attributes
- **Dark mode** support via shared PCTools library
- **SEO content** — each page has an SEO intro paragraph, FAQ section, and soft CTA
- **Schema markup** — BreadcrumbList, SoftwareApplication (with Offer), and FAQPage on every tool
- **Soft CTA** — every tool ends with a CTA to try PettyCash SaaS
- **Trust microcopy** — "Free forever • No credit card required • Setup in 2 minutes" under every CTA
- **Mobile-friendly** — responsive TailwindCSS layout

## Files Modified

| File | Changes |
|------|---------|
| `tools/js/shared.js` | Added nav entries + tool card descriptions for 6 new tools (EN + AR), added Calculators dropdown to renderNav |
| `tools/index.html` | Added 6 new tool cards, updated footer with all tool links |
| `sitemap.xml` | Added 6 new tool page URLs |

## Files Created

| File | Description |
|------|-------------|
| `tools/expense-savings-calculator.html` | Expense Savings Calculator |
| `tools/petty-cash-limit-calculator.html` | Petty Cash Limit Calculator |
| `tools/vat-calculator.html` | Saudi VAT Calculator |
| `tools/expense-policy-generator.html` | Expense Policy Generator |
| `tools/approval-workflow-builder.html` | Approval Workflow Builder |
| `tools/internal-control-score-quiz.html` | Internal Control Score Quiz |
| `reports/STAGE_6_FREE_BUSINESS_TOOLS.md` | This report |

## Acceptance Criteria Checklist

- [x] `/tools/` hub page updated with all 6 new tools
- [x] Each tool has its own landing page (Arabic + English)
- [x] Each tool is fully functional client-side (no login required)
- [x] Each tool has FAQ section
- [x] Each tool has schema markup (BreadcrumbList, SoftwareApplication, FAQPage)
- [x] Each tool has internal links to other tools and SaaS product
- [x] Every tool ends with a soft CTA into the SaaS product
- [x] Tools prioritized by estimated search volume (noted per tool)
- [x] Mobile-friendly responsive design
- [x] Real SEO content around each tool (not just the widget)
- [x] Sitemap updated with all new tool pages
