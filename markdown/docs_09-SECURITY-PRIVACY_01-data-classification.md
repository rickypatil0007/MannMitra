# MANNMITRA — DATA CLASSIFICATION POLICY

Document: `09-SECURITY-PRIVACY/01-data-classification.md`
Status: Production Specification
Version: 1.0
Audience: Security Engineers, Database Architects, Legal
Platform: System Architecture

---

# 1. PURPOSE

To strictly categorize all data handled by MannMitra, ensuring appropriate encryption, access controls, and retention policies are applied (Supports Section 28 of Master Spec).

---

# 2. CLASSIFICATION LEVELS

### LEVEL 1: PUBLIC DATA
- **Definition:** Data intended for open viewing.
- **Examples:** Public Senior Stories, Generic Wellness Articles, Application configuration.
- **Handling:** Edge-cached. No RLS restrictions on `SELECT`.

### LEVEL 2: ANONYMOUS COMMUNITY DATA
- **Definition:** User-generated content published under a pseudonym.
- **Examples:** Community posts, Comments.
- **Handling:** `SELECT` allowed for all authenticated users. API layer MUST NOT expose `author_id`.

### LEVEL 3: PRIVATE DATA
- **Definition:** Standard user data, accessible only to the user.
- **Examples:** Tasks, Calendar Events, Planner configuration, basic Profile data.
- **Handling:** Strict RLS enforcing `user_id == auth.uid()`.

### LEVEL 4: RESTRICTED DATA (SENSITIVE)
- **Definition:** Highly sensitive personal or emotional information.
- **Examples:** Mitra Chat Transcripts, Voice Notes, Personal Diary, Stress/Mood records, Counsellor requests, SOS logs.
- **Handling:** 
  - Strict RLS.
  - Encryption at Rest (e.g., using `pgcrypto` or application-level encryption for text content).
  - Explicit consent workflows required to share with Counsellors.
  - Automatically excluded from Institutional Aggregation unless explicitly anonymized.
