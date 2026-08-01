# Stage 3 — Homepage Redesign

**Date:** 2026-08-01  
**Status:** ✅ Complete (Awaiting Approval)

## Overview

Rebuilt the PettyCash homepage with a new section structure, interactive ROI calculator, and full bilingual (Arabic/English) content support. The redesign shifts the homepage from a traditional SaaS landing page toward a content and tools authority site, as outlined in the Stage 2 Information Architecture report.

## New Section Order (14 sections)

| # | Section | Purpose |
|---|---------|---------|
| 1 | Hero (with video) | Value proposition + CTA + demo video |
| 2 | Stats Bar | Key metrics at a glance |
| 3 | Problem | Pain points of manual petty cash management |
| 4 | **ROI / Savings Calculator** ⭐ NEW | Interactive slider-based calculator showing hours saved, monthly/annual savings, and error reduction |
| 5 | How It Works | 3-step process overview |
| 6 | **Social Proof / Customer Stories** ⭐ NEW | Stats grid (500+ users, 50K+ expenses, 99.9% uptime, 4.8/5 rating) + 3 testimonials with star ratings |
| 7 | Free Tools Showcase | Teaser for business tools and PDF tools |
| 8 | **Templates Teaser** ⭐ NEW | 4 free template cards (Excel template, approval form, policy PDF, audit checklist) |
| 9 | **AI Assistant Teaser** ⭐ NEW | Purple gradient section showcasing AI features (Expense Analyzer, Receipt Scanner, Policy Generator) |
| 10 | Comparison (Excel vs PettyCash) | Side-by-side comparison with "See All Comparisons" link |
| 11 | **Pricing Preview** ⭐ NEW | All 4 pricing plans displayed with features, badges, and CTAs |
| 12 | FAQ | 5 common questions with accordion |
| 13 | Latest Articles | Blog preview (unhidden, was previously `hidden`) |
| 14 | CTA | Final conversion call-to-action |

## Sections Removed

- Solutions (merged into Problem → ROI flow)
- Features grid (moved to dedicated `/features.html` page)
- Why Choose Us (replaced by Social Proof section)
- Benefits (Manager/Employee) (replaced by ROI calculator + Social Proof)

## ROI Calculator Logic

The interactive ROI calculator uses 4 user inputs:
- **Number of Employees** (3–200, default 10)
- **Monthly Expense Transactions** (10–500, default 50)
- **Hours Spent on Expense Admin Per Week** (1–40, default 8)
- **Average Hourly Cost** (SAR 25–300, default 75)

**Formula:**
- Hours saved/week = hours × 75% (PettyCash automates ~75% of manual work)
- Hours saved/month = hours saved/week × 4.33
- Monthly savings = hours saved/month × hourly rate
- Annual savings = monthly savings × 12
- Error reduction = 95% (constant)

Results update in real-time as sliders move. Currency displays as "SAR" (EN) or "ريال" (AR).

## Schema Markup Updates

- Added `aggregateRating` to `SoftwareApplication` schema (4.8/5, 500 reviews)
- Added `FAQPage` schema with 5 Q&A entries matching the visible FAQ section
- All schema uses valid JSON-LD format

## Bilingual Support

All new sections have complete Arabic and English translations:
- ROI calculator labels, inputs, and results
- Social proof stats and testimonials (3 testimonials with Arabic names/roles)
- Templates teaser (4 items)
- AI teaser (3 items + badge + CTA)
- Comparison "view all" link
- Pricing "view all" link

## Files Modified

| File | Changes |
|------|---------|
| `index.html` | Rebuilt `<main>` with 14-section structure; added FAQPage + aggregateRating schema |
| `js/translations.js` | Added EN + AR keys for `roi`, `socialProof`, `templatesTeaser`, `aiTeaser`, `comparison.viewAll`, `pricing.viewAll` |
| `js/home.js` | Added `initROICalculator()`, `renderSocialProof()`, `renderTemplatesTeaser()`, `renderAITeaser()`, `renderPricingPreview()`, `updateComparisonViewAll()`; updated DOMContentLoaded; removed calls to `renderSolutions()`, `renderFeatures()`, `renderWhyUs()`, `renderBenefits()` |

## Acceptance Criteria Checklist

- [x] New homepage section structure implemented (14 sections)
- [x] ROI calculator with interactive sliders (4 inputs, 4 outputs)
- [x] Full bilingual content (Arabic + English) for all new sections
- [x] Social proof section with stats and testimonials
- [x] Templates teaser section
- [x] AI assistant teaser section
- [x] Pricing preview section
- [x] FAQ section with schema markup
- [x] Latest articles section unhidden
- [x] Schema markup updated (FAQPage + aggregateRating)
- [x] All existing sections retained (Hero, Stats, Problem, How It Works, Comparison, Tools, CTA)

## Notes

- The `renderSolutions()`, `renderFeatures()`, `renderWhyUs()`, and `renderBenefits()` functions still exist in `home.js` but are no longer called on the homepage. They can be removed in a cleanup pass or repurposed for other pages.
- The templates teaser links to `./templates/` and AI teaser links to `./ai/` — these directories don't exist yet and will be created in later stages.
- The comparison "See All Comparisons" links to `./compare/` — also to be created in later stages.
