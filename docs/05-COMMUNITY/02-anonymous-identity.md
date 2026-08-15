# MANNMITRA — ANONYMOUS IDENTITY

Document: `05-COMMUNITY/02-anonymous-identity.md`
Status: Production Specification
Version: 1.0
Audience: Security Engineers, Backend Engineers
Platform: Backend

---

# 1. PURPOSE

To allow students to participate in the community without fear of judgment from peers or faculty, while still holding them accountable for abusive behavior.

---

# 2. IMPLEMENTATION

When a user first accesses the Community tab, the system generates an `anonymous_alias`.

**Alias Generation Rule:**
Use a random combination of an adjective and an animal/object (e.g., "Calm Fox", "Brave Cedar"). Do NOT use random alphanumeric hashes (like `User#8493`), as they feel robotic and cold.

---

# 3. DATABASE STRUCTURE

Instead of placing community posts directly on the `User` table, use an intermediary `CommunityProfile` table.

`User` (Auth Table)  <-- 1:1 --> `CommunityProfile` (Alias) <-- 1:M --> `CommunityPost`

---

# 4. PRIVACY GUARANTEES

- The API endpoints serving the community feed (`GET /api/v1/community/posts`) MUST query the `CommunityProfile` table for the author name.
- They MUST NOT join with the main `User` table.
- They MUST NOT return the `author_id` to the client.

---

# 5. ALIAS RESET

- Students MAY have the option to "Reset" their alias once per semester if they feel their pseudonymous identity has become too recognizable.
- Resetting an alias orphans past posts (they appear as "Deleted User" or retain the old alias, decoupled from the current session).
