# MANNMITRA — SOS WORKFLOW

Document: `03-STUDENT/20-sos.md`
Status: Production Specification
Version: 1.0
Audience: Students, Frontend Engineers, Security Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

The SOS workflow provides immediate, actionable paths to crisis support. It is a safety-critical feature designed for moments when a student feels they are in danger or experiencing a severe mental health crisis.

---

# 2. SCOPE

**In Scope (MVP):**
- Persistent, accessible entry point (e.g., an icon in the global navigation).
- Clear, unbranded display of national/regional emergency numbers.
- Display of specific institutional crisis resources (if configured).
- Option to quickly message Trusted Contacts.

**Future Scope:**
- Geolocation-based routing to local emergency services.

---

# 3. USER FLOW

```text
Student clicks the persistent "SOS" or "Urgent Help" button
    ↓
UI transitions immediately to a focused, distraction-free screen
    ↓
System presents 3 clear options:
  1. Call Emergency Services (e.g., 911 / 112)
  2. Call Institutional Crisis Line (if applicable)
  3. Message a Trusted Contact
    ↓
Student clicks an option (triggers `tel:` link or internal API)
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-20-01: Persistent Access
- The SOS button MUST be visible from almost every screen in the application (usually in the header or primary navigation).

## STU-20-02: Safety-First UI
- The SOS screen MUST strip away all non-essential navigation.
- It MUST load instantly (should be pre-rendered or statically available).

## STU-20-03: Actionable Links
- Phone numbers MUST use `tel:` links to launch the dialer on mobile devices.
- Text lines (e.g., Crisis Text Line) MUST use `sms:` links where supported.

---

# 5. UI / UX REQUIREMENTS

- **Visuals:** The SOS screen should be distinct from the rest of the app to indicate a context switch, but it MUST NOT be aggressive (no flashing red sirens). Use solid, high-contrast colors (e.g., dark charcoal background with white text and clear, solid buttons).
- **Clarity:** Keep text to an absolute minimum. Large typography. "Call 911" is better than "If you are experiencing a medical emergency, please dial 911."

---

# 6. DATA REQUIREMENTS

- Crisis numbers can be hardcoded for the MVP based on the deployment region, or fetched dynamically from an `InstitutionConfig` table.

---

# 7. API REQUIREMENTS

- **GET `/api/v1/config/crisis-resources`** (Public or authenticated)
- **POST `/api/v1/support/sos-triggered`** (To log that the SOS view was accessed, strictly for safety auditing, without breaching privacy).

---

# 8. SECURITY & PRIVACY

- SOS activation data is highly sensitive.
- The fact that a student viewed the SOS screen MUST NOT be broadcast to the community or automatically sent to faculty unless a specific, legally compliant institutional policy requires it (and the student consented during onboarding).

---

# 9. ANALYTICS

- `sos_button_clicked`
- `sos_resource_clicked` (e.g., which specific hotline they tapped)
*(These are critical safety metrics and must be monitored for platform health).*
