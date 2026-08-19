# MANNMITRA — COMPLIANCE & LEGAL

Document: `09-SECURITY-PRIVACY/04-compliance.md`
Status: Production Specification
Version: 1.0
Audience: Legal, Security Engineers, Product
Platform: System Architecture

---

# 1. PURPOSE

To ensure the platform operates within the legal boundaries of the regions it is deployed in, specifically regarding student privacy and health data.

---

# 2. HEALTH DATA REGULATIONS (HIPAA / GDPR / DPDP)

**Crucial Distinction:** MannMitra is an *educational wellness companion*, NOT an Electronic Medical Record (EMR) system. It does not provide medical diagnoses or telemedicine (Feature 01, Section 2.3).

However, because it stores self-reported mental health data, it MUST adhere to strict data protection laws (e.g., GDPR in Europe, DPDP in India, or FERPA/HIPAA-lite standards in the US depending on institutional deployment).

---

# 3. RIGHT TO FORGET (DATA DELETION)

- Users MUST have a frictionless way to permanently delete their account.
- **Cascading Deletion:** Deleting an account MUST hard-delete all `Restricted Data` (Chats, Voice Notes, Reflections).
- **Anonymization of Community Data:** Deleting an account SHOULD anonymize (orphan) their community posts rather than deleting them, to preserve community threads, unless the user explicitly requests full content deletion.

---

# 4. TERMS OF SERVICE & SOS DISCLAIMERS

The onboarding flow MUST include a mandatory, clear, non-legalese checkbox stating:
> "MannMitra is an AI companion designed to help you manage stress. It is not a therapist, a doctor, or a medical device. In a crisis, please use the SOS button or contact emergency services."
