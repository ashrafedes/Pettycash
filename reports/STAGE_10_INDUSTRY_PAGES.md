# Stage 10 — Industry-Specific Landing Pages

**Date:** 2026-08-01  
**Status:** ✅ Complete (Awaiting Approval)

## Overview

Built 8 industry-specific landing pages plus an industries hub page. Each page has unique content covering industry-specific pain points, tailored solution framing, a case study example, FAQ, CTA, and schema markup. No duplicated copy between industry pages — each is genuinely distinct.

## Industries Built

| # | Industry | URL | Color | Key Pain Point |
|---|----------|-----|-------|----------------|
| 1 | Construction | `/industries/construction.html` | Orange | Multi-site petty cash, project cost tracking |
| 2 | Restaurants | `/industries/restaurants.html` | Red | Daily cash-ups, tips, multi-branch |
| 3 | Clinics | `/industries/clinics.html` | Teal | Patient refunds, per-doctor tracking |
| 4 | Schools | `/industries/schools.html` | Indigo | Department budgets, field trips, transparency |
| 5 | NGOs | `/industries/ngos.html` | Green | Donor-restricted funds, audit trails |
| 6 | Retail | `/industries/retail.html` | Fuchsia | Store-level cash, write-offs, staff purchases |
| 7 | Manufacturing | `/industries/manufacturing.html` | Slate | Shift tracking, production line costs |
| 8 | Transportation | `/industries/transportation.html` | Blue | Driver advances, fuel, route profitability |

## Features Per Page

- **Unique challenge section** — industry-specific pain points
- **How PettyCash Helps** — 4 tailored solution points
- **Case study example** — realistic scenario with quantified results
- **FAQ** — 3 industry-specific questions with schema markup
- **Soft CTA** — PettyCash sign-up
- **Bilingual** — English + Arabic with `data-i18n-en` / `data-i18n-ar`
- **Schema** — BreadcrumbList, WebPage, FAQPage
- **Responsive** — TailwindCSS mobile-friendly

## Hub Page

`/industries/index.html` — Grid of all 8 industries with icons, descriptions, and CollectionPage schema.

## Files Created

| File | Description |
|------|-------------|
| `industries/js/industries.js` | Shared nav, footer, language toggle |
| `industries/index.html` | Industries hub page |
| `industries/construction.html` | Construction landing page |
| `industries/restaurants.html` | Restaurants landing page |
| `industries/clinics.html` | Clinics landing page |
| `industries/schools.html` | Schools landing page |
| `industries/ngos.html` | NGOs landing page |
| `industries/retail.html` | Retail landing page |
| `industries/manufacturing.html` | Manufacturing landing page |
| `industries/transportation.html` | Transportation landing page |
| `reports/STAGE_10_INDUSTRY_PAGES.md` | This report |

## Files Modified

| File | Changes |
|------|---------|
| `sitemap.xml` | Added 9 new industry page URLs |
| `js/main.js` | Added Industries link to Resources dropdown |

## Acceptance Criteria Checklist

- [x] 8 industry-specific landing pages
- [x] Each page targets a distinct keyword cluster
- [x] No two industry pages share more than nav/footer boilerplate
- [x] Each page has industry-specific pain points, solution framing, case study, FAQ, CTA
- [x] Bilingual (English + Arabic)
- [x] Schema markup (BreadcrumbList, WebPage, FAQPage)
- [x] Hub page with grid of all industries
- [x] Updated sitemap.xml
- [x] Updated main site nav
