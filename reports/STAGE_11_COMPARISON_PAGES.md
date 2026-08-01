# Stage 11 — Comparison Pages

**Date:** 2026-08-01  
**Status:** ✅ Complete (Awaiting Approval)

## Overview

Built 5 honest, fair comparison pages plus a comparison hub page. Each page features a detailed comparison table, use-case guidance for when to choose each option, FAQ with schema, and a CTA. Comparisons prioritize accuracy and fairness over sales pressure to preserve trust and SEO longevity.

## Comparisons Built

| # | Comparison | URL | Key Angle |
|---|-----------|-----|-----------|
| 1 | PettyCash vs. Excel | `/compare/petty-cash-vs-excel.html` | When spreadsheet is enough vs. when to switch |
| 2 | PettyCash vs. Zoho Expense | `/compare/petty-cash-vs-zoho-expense.html` | Purpose-built vs. general expense ecosystem |
| 3 | PettyCash vs. Expensify | `/compare/petty-cash-vs-expensify.html` | Petty cash focus vs. receipt scanning/travel |
| 4 | PettyCash vs. SAP Concur | `/compare/petty-cash-vs-sap-concur.html` | SMB tool vs. enterprise platform |
| 5 | PettyCash vs. Odoo | `/compare/petty-cash-vs-odoo.html` | Purpose-built vs. all-in-one ERP |

## Features Per Page

- **Comparison table** — 11-12 rows comparing key features honestly
- **When to choose competitor** — fair, honest guidance
- **When to choose PettyCash** — clear use-case guidance
- **FAQ** — 3 questions with schema markup
- **CTA** — PettyCash sign-up
- **Bilingual** — English + Arabic
- **Schema** — BreadcrumbList, WebPage, FAQPage
- **Responsive** — TailwindCSS mobile-friendly

## Files Created

| File | Description |
|------|-------------|
| `compare/js/compare.js` | Shared nav, footer, language toggle |
| `compare/index.html` | Comparison hub page |
| `compare/petty-cash-vs-excel.html` | vs. Excel comparison |
| `compare/petty-cash-vs-zoho-expense.html` | vs. Zoho Expense comparison |
| `compare/petty-cash-vs-expensify.html` | vs. Expensify comparison |
| `compare/petty-cash-vs-sap-concur.html` | vs. SAP Concur comparison |
| `compare/petty-cash-vs-odoo.html` | vs. Odoo comparison |
| `reports/STAGE_11_COMPARISON_PAGES.md` | This report |

## Files Modified

| File | Changes |
|------|---------|
| `sitemap.xml` | Added 6 new comparison page URLs |
| `js/main.js` | Added Compare link to Resources dropdown |

## Acceptance Criteria Checklist

- [x] 5 comparison pages built
- [x] Comparison tables are factually accurate and fair
- [x] Each page has its own schema and meta
- [x] Clear use-case guidance for who should pick what
- [x] FAQ with schema on each page
- [x] Bilingual (English + Arabic)
- [x] Hub page linking all comparisons
- [x] Updated sitemap.xml
- [x] Updated main site nav
