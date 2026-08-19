# MANNMITRA — TRUSTED CONTACTS

Document: `03-STUDENT/19-trusted-contacts.md`
Status: Production Specification
Version: 1.0
Audience: Students, Frontend Engineers, Security Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

Trusted Contacts allow students to designate individuals (friends, family, or mentors) who can be contacted on their behalf in times of need or during an active SOS workflow. It provides a safety net controlled entirely by the student.

---

# 2. SCOPE

**In Scope (MVP):**
- Add, edit, and remove trusted contacts (Name, Phone, Email, Relationship).
- Explicit explanation of when they will be contacted.
- Manual trigger to notify a contact ("I need support").

**Future Scope:**
- Automated notification workflows if an SOS is triggered.

---

# 3. USER FLOW

```text
Student navigates to Profile/Settings > Safety > Trusted Contacts
    ↓
Reads clear explanation of what this feature does
    ↓
Clicks "Add Contact"
    ↓
Enters Name and Phone Number (or Email)
    ↓
Contact is saved securely
    ↓
Student can later trigger a "Reach out to [Name]" action from the SOS or Support page
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-19-01: Contact Management
- MUST allow the student to store at least 3 trusted contacts.
- MUST allow updating or deleting contacts at any time.

## STU-19-02: Explicit Consent
- The UI MUST explicitly state: "MannMitra will never contact these people automatically without your permission, except in an emergency SOS scenario (if enabled by your institution)."

## STU-19-03: Notification Trigger
- If the student uses the feature to ask for help, the system MUST send a standardized, calm message to the contact (e.g., via SMS or Email) stating: "[Student Name] is currently using MannMitra and has requested your support. Please check in with them when you can."

---

# 5. UI / UX REQUIREMENTS

- **Visuals:** Standard forms. Must feel secure and robust.
- **Empty State:** "You haven't added any trusted contacts yet. Adding someone you trust can be a helpful safety net."

---

# 6. DATA REQUIREMENTS

**Required Data Entities:**
- `TrustedContact`:
  - `id` (UUID)
  - `user_id` (UUID)
  - `name` (String)
  - `phone_number` (String, optional)
  - `email` (String, optional)
  - `relationship` (String)

---

# 7. API REQUIREMENTS

- **GET `/api/v1/user/trusted-contacts`**
- **POST `/api/v1/user/trusted-contacts`**
- **DELETE `/api/v1/user/trusted-contacts/:id`**
- **POST `/api/v1/support/notify-contact`**

---

# 8. SECURITY & PRIVACY

- Trusted contact data is `Restricted Data`. PII of third parties must be protected.
- Data MUST be encrypted at rest.
- The system MUST rate-limit the `notify-contact` endpoint to prevent abuse/spam.

---

# 9. ANALYTICS

- `trusted_contact_added`
- `trusted_contact_removed`
- `trusted_contact_notified`
