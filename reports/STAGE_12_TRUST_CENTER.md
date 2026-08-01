# Stage 12 — Trust Center

**Date:** 2026-08-01  
**Status:** ✅ Complete (Awaiting Approval)

## Overview

Built the Trust Center with security, privacy, compliance, roadmap, changelog, and status pages. About/Founder Story and Help Center already existed and were enhanced with the new trust pages linked from them. All legal/compliance pages include a "Legal Review Notice" flagging content that requires the project owner's legal review.

## Pages Built

| # | Page | URL | Description |
|---|------|-----|-------------|
| 1 | Security | `/security.html` | Data encryption, access controls, audit trails, infrastructure, vulnerability reporting |
| 2 | Privacy Policy | `/privacy.html` | 11-section privacy policy covering data collection, usage, sharing, retention, rights, cookies |
| 3 | Compliance | `/compliance.html` | ZATCA e-invoicing, VAT 15%, record retention, PDPL, Saudization/Nitaqat |
| 4 | Roadmap | `/roadmap.html` | Shipped / In Progress / Planned / Exploring sections with feature list |
| 5 | Release Notes | `/changelog.html` | User-facing changelog with version history, tags (New/Improvement/Fix) |
| 6 | System Status | `/status.html` | Service status, 90-day uptime bar, incident history |

## Pre-existing Pages (Enhanced)

| Page | URL | Notes |
|------|-----|-------|
| About | `/about.html` | Already had story, mission, values — linked to new trust pages |
| Help Center | `/help.html` | Already had FAQ schema and help sections |
| Contact | `/contact.html` | Already had contact form with Google Forms integration |

## Legal Review Flags

All legal/compliance pages include a prominent amber notice:
- **Security page** — notes it describes practices but not a legal guarantee/SLA
- **Privacy Policy** — must be reviewed by legal professional familiar with Saudi PDPL (Royal Decree M/19)
- **Compliance page** — not legal advice; businesses should consult qualified Saudi legal/tax advisor

## Files Created

| File | Description |
|------|-------------|
| `security.html` | Security practices page |
| `privacy.html` | Privacy policy (11 sections) |
| `compliance.html` | Saudi regulatory compliance page |
| `roadmap.html` | Product roadmap with 4 status tiers |
| `changelog.html` | User-facing release notes |
| `status.html` | System status page with uptime history |
| `reports/STAGE_12_TRUST_CENTER.md` | This report |

## Files Modified

| File | Changes |
|------|---------|
| `sitemap.xml` | Added 6 new trust center page URLs |

## Acceptance Criteria Checklist

- [x] Security page built
- [x] Privacy Policy built
- [x] Compliance page built
- [x] Roadmap built
- [x] Release Notes/Changelog built
- [x] Status page built
- [x] Support/Help Center entry point (already existed)
- [x] About/Founder Story (already existed)
- [x] Mission/Vision/Values (already in about.html)
- [x] Legal/compliance pages flagged for legal review
- [x] Updated sitemap.xml
