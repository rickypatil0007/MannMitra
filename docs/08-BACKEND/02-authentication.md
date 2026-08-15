# MANNMITRA — AUTHENTICATION & SESSIONS

Document: `08-BACKEND/02-authentication.md`
Status: Production Specification
Version: 1.0
Audience: Backend Engineers, Security Engineers
Platform: Backend / Frontend Auth

---

# 1. PURPOSE

To ensure secure access to the platform while supporting the "Onboarding without forced disclosure" requirement (Feature 02).

---

# 2. AUTHENTICATION MODES

### 1. Registered User (Standard)
- **Method:** Email/Password, or OAuth (Google, Institutional SSO).
- **Access:** Full access to all features (Planner, Community, private notes).

### 2. Guest User (Frictionless Entry)
- **Method:** Anonymous JWT generated on the fly.
- **Access:** Can view public resources (Comfort Library, Senior Stories). Cannot save private data (Notes) or post in the Community.
- **Conversion:** The UI should gently prompt guests to register to save their data.

---

# 3. JWT & SESSION MANAGEMENT

- **Implementation:** Supabase Auth (or similar standard JWT implementation).
- **Storage:** Tokens MUST be stored securely on the client (e.g., HTTP-only cookies to prevent XSS attacks).
- **Expiration:** Short-lived access tokens (e.g., 1 hour) and longer-lived refresh tokens (e.g., 30 days).

---

# 4. ROLE-BASED ACCESS CONTROL (RBAC)

The JWT payload MUST include the user's role to allow fast, client-side routing decisions and backend RLS enforcement.

**Roles:**
- `student` (Default)
- `guest`
- `counsellor`
- `faculty`
- `admin` (Strictly for moderation and platform management).
