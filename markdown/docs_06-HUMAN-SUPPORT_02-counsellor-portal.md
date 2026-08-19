# MANNMITRA — COUNSELLOR PORTAL

Document: `06-HUMAN-SUPPORT/02-counsellor-portal.md`
Status: Production Specification
Version: 1.0
Audience: Frontend Engineers, Backend Engineers
Platform: Desktop Web Application (Counsellor Role)

---

# 1. PURPOSE

A dedicated, secure dashboard for institutional counsellors to receive student requests, review permitted wellness summaries, and manage follow-ups.

---

# 2. SCOPE

**In Scope (MVP):**
- View pending `SupportRequest`s from students.
- Update request status (e.g., Contacted, Resolved).
- View a summarized, student-approved wellness report.

**Future Scope:**
- Calendar syncing for direct booking.
- Secure in-app messaging.

---

# 3. USER FLOW (COUNSELLOR)

```text
Counsellor logs in (Requires 2FA)
    ↓
Views Dashboard of Pending Requests
    ↓
Clicks on Student "Alex Smith"
    ↓
Views Alex's explicitly shared context (e.g., "Alex requested help regarding: Academic Stress")
    ↓
Views Alex's Wellness Summary (if Alex granted permission during the request)
    ↓
Counsellor emails/calls Alex via institutional channels
    ↓
Marks request as "In Progress"
```

---

# 4. FUNCTIONAL REQUIREMENTS

## HUM-02-01: Authentication
- Counsellors MUST use institutional Single Sign-On (SSO) and Multi-Factor Authentication (MFA) to access the portal.

## HUM-02-02: Information Boundaries
- The Counsellor MUST NOT have access to a student's raw chat logs with Mitra.
- The Counsellor MUST NOT see anonymous community posts linked to the student.
- They only see the data explicitly packaged in the `SupportRequest`.

---

# 5. UI / UX

- **Visuals:** A professional, clinical layout (unlike the soft student app). High data density is acceptable here.
- **Status Indicators:** Clear badges for Pending (Red), In Progress (Yellow), Resolved (Green).

---

# 6. API ENDPOINTS (Role: Counsellor)

- `GET /api/v1/counsellor/requests`
- `GET /api/v1/counsellor/requests/:id/summary`
- `PUT /api/v1/counsellor/requests/:id`
