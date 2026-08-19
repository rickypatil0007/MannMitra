# MANNMITRA — ENCRYPTION STANDARDS

Document: `09-SECURITY-PRIVACY/03-encryption.md`
Status: Production Specification
Version: 1.0
Audience: Security Engineers, Backend Engineers
Platform: System Architecture

---

# 1. PURPOSE

To ensure that even if the primary database is compromised, highly sensitive student data (`Restricted Data`) cannot be easily read in plaintext.

---

# 2. ENCRYPTION IN TRANSIT

- All traffic MUST run over HTTPS (TLS 1.2 or higher).
- WSS (Secure WebSockets) or HTTPS must be used for AI streaming (SSE).
- Database connections from the API MUST use SSL.

---

# 3. ENCRYPTION AT REST (DATABASE LAYER)

While modern cloud providers encrypt disks at rest automatically, MannMitra requires application-level or column-level encryption for specific tables to prevent DBAs from viewing the data.

**Target Columns:**
- `Messages.content` (AI Chat transcripts)
- `PersonalNote.content`
- `Reflection.prompts_and_answers`
- `SupportRequest.message`

**Implementation:**
- Use Postgres `pgcrypto` extension or a KMS (Key Management Service) integrated into the ORM/Backend.
- Data is encrypted before being inserted into the database and decrypted on-the-fly when queried by the authorized user.

---

# 4. MEDIA ENCRYPTION

- Voice Notes (`.webm` or `.mp3` files) MUST be stored in private buckets.
- The storage provider (e.g., AWS S3, Supabase Storage) MUST have Server-Side Encryption (SSE-S3 or SSE-KMS) enabled.
