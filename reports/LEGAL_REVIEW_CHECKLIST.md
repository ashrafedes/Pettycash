# Legal Review Checklist

**Status:** ⚠️ Required Before Launch  
**Date:** 2026-08-01

## Pages Requiring Legal Review

| Page | File | Risk Level | Reviewer Required |
|------|------|------------|-------------------|
| Privacy Policy | `privacy.html` | 🔴 High | Saudi data protection lawyer |
| Security | `security.html` | 🟡 Medium | Security/legal advisor |
| Compliance | `compliance.html` | 🔴 High | Saudi tax/legal advisor |

---

## 1. Privacy Policy (`privacy.html`)

### Saudi PDPL Compliance Checklist

- [ ] **Data controller identification** — Verify legal entity name, commercial registration number, and contact details are accurate
- [ ] **Lawful basis for processing** — Confirm each data processing activity has a valid legal basis under PDPL (consent, contract, legal obligation, vital interests, public task, legitimate interests)
- [ ] **Data subject rights** — Ensure all 8 PDPL rights are listed:
  - [ ] Right to be informed
  - [ ] Right of access
  - [ ] Right to rectification
  - [ ] Right to erasure
  - [ ] Right to restrict processing
  - [ ] Right to data portability
  - [ ] Right to object
  - [ ] Right to withdraw consent
- [ ] **Data retention periods** — Specify exact retention durations for each data category (currently says "as long as necessary" — needs specific timeframes)
- [ ] **Cross-border data transfers** — If data is transferred outside Saudi Arabia, ensure PDPL Article 27 compliance (explicit consent or SDAIA approval)
- [ ] **DPO contact** — Appoint a Data Protection Officer and list their contact information
- [ ] **Cookie policy** — Ensure cookie table matches actual cookies used (GTM, GA4, Clarity)
- [ ] **Children's privacy** — Confirm age threshold aligns with Saudi law (currently 13 — verify)
- [ ] **Breach notification** — Add PDPL Article 26 breach notification timeline (72 hours to SDAIA)
- [ ] **Arabic version** — Provide an Arabic translation of the privacy policy (PDPL requires Arabic)
- [ ] **Effective date** — Set actual publication date
- [ ] **Update mechanism** — Describe how users will be notified of policy changes

### Key Saudi Legal References to Verify

- Personal Data Protection Law, Royal Decree M/19 (September 2021)
- PDPL Implementing Regulations (September 2023)
- SDAIA (Saudi Data & Artificial Intelligence Authority) guidelines

---

## 2. Security Page (`security.html`)

### Security Claims Verification Checklist

- [ ] **Encryption claims** — Verify AES-256 at rest and TLS 1.2+ in transit are actually implemented
- [ ] **Access controls** — Confirm role-based access control (RBAC) is implemented as described
- [ ] **Audit trails** — Verify all claimed audit events are actually logged
- [ ] **Hosting location** — Confirm where data is actually hosted (currently says "Firebase" — specify region)
- [ ] **Backup claims** — Verify backup frequency and retention match actual implementation
- [ ] **Incident response** — Ensure incident response plan exists and matches description
- [ ] **Vulnerability reporting** — Set up actual security contact email (currently links to contact form)
- [ ] **Penetration testing** — If claiming regular pentests, provide actual frequency and scope
- [ ] **Compliance certifications** — Only claim certifications that have been actually obtained
- [ ] **SLA terms** — Remove or qualify any SLA-like commitments unless backed by actual SLA

### Remove or Qualify Unverified Claims

- [ ] Review all "we" statements for accuracy
- [ ] Add "to the best of our knowledge" qualifiers where appropriate
- [ ] Remove any guarantees that cannot be backed up

---

## 3. Compliance Page (`compliance.html`)

### ZATCA / E-Invoicing Compliance Checklist

- [ ] **ZATCA integration** — Verify actual ZATCA Phase 2 integration status (API connection, FATOORA portal)
- [ ] **E-invoice format** — Confirm XML/UBL 2.1 format compliance with ZATCA specifications
- [ ] **Cryptographic stamp** — Verify XAdES 4.5.1 digital signature implementation
- [ ] **QR code** — Confirm ZATCA-compliant QR code generation (Base64-encoded TLV format)
- [ ] **VAT calculation** — Verify 15% VAT rate is correctly applied and displayed
- [ ] **Invoice fields** — Ensure all mandatory ZATCA fields are present in generated invoices
- [ ] **Simplified vs detailed tax invoice** — Confirm both types are supported per ZATCA rules

### General Compliance Checklist

- [ ] **Record retention** — Verify 6-year retention period aligns with current Saudi tax law
- [ ] **PDPL compliance** — Cross-reference with privacy policy review
- [ ] **Saudization (Nitaqat)** — Confirm claims about Saudization support are accurate
- [ ] **Tax filing** — Remove any claims about filing taxes on behalf of users unless actually offered
- [ ] **Disclaimer** — Ensure disclaimer is prominent: "This page does not constitute legal or tax advice"
- [ ] **Regulatory update mechanism** — Add note about how often compliance information is reviewed/updated

### Key Saudi Legal References to Verify

- ZATCA E-Invoicing Regulations (December 2021)
- ZATCA Phase 2 Integration Bylaws
- Saudi VAT Law (Royal Decree M/113)
- Saudi Companies Law
- Labor Law (Saudization/Nitaqat requirements)

---

## Sign-Off

| Reviewer | Page | Date | Signature |
|----------|------|------|-----------|
| Legal Counsel (Privacy) | `privacy.html` | _________ | _________ |
| Security Advisor | `security.html` | _________ | _________ |
| Tax/Legal Counsel (Compliance) | `compliance.html` | _________ | _________ |

---

## Post-Review Actions

1. Update all three pages with reviewed and approved content
2. Set actual effective dates
3. Publish Arabic translations
4. Remove "Legal Review Notice" banners after approval
5. Add "Last reviewed: [date]" footer to each page
6. Schedule annual review reminder
