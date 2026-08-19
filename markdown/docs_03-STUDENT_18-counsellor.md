# MANNMITRA — COUNSELLOR DISCOVERY & REQUESTS

Document: `03-STUDENT/18-counsellor.md`
Status: Production Specification
Version: 1.0
Audience: Students, Frontend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

To provide a safe, frictionless bridge between the digital platform and qualified human professionals. It allows students to discover available institutional counsellors and request support without leaving the app.

---

# 2. SCOPE

**In Scope (Phase 1):**
- Directory of available institutional counsellors.
- Secure request form to initiate contact.
- Status tracking of the request.

**Future Scope:**
- Full appointment booking and calendar integration.
- Secure messaging with the counsellor.

---

# 3. USER FLOW

```text
Student navigates to Support > Counsellors (or is referred by Mitra/SOS)
    ↓
Views list of available counsellors and their specialties
    ↓
Selects a counsellor and clicks "Request Support"
    ↓
Fills out a brief, optional reason for contact
    ↓
Submits request securely
    ↓
Student sees request status (e.g., "Pending", "Counsellor will email you")
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-18-01: Counsellor Directory
- MUST display counsellor name, title, specialties (e.g., "Academic Stress", "Anxiety"), and availability status.

## STU-18-02: Support Request
- MUST allow the student to submit a secure request.
- The form MUST NOT force the student to write a detailed traumatic account. A simple "I'd like to talk" is sufficient.
- The system MUST notify the counsellor via a secure internal channel or institutional email (without transmitting sensitive data in the email body).

## STU-18-03: Request Status
- MUST show the student their active requests and current status (Pending, Accepted, Completed).

---

# 5. UI / UX REQUIREMENTS

- **Visuals:** Highly professional, trustworthy UI.
- **Profiles:** Use professional, warm headshots if available.
- **Language:** Avoid clinical terminology that might scare students away. Use "Request Support" or "Schedule a Chat" instead of "Book Therapy Session."

---

# 6. DATA REQUIREMENTS

**Required Data Entities:**
- `CounsellorProfile`: Name, bio, specialties, contact info.
- `SupportRequest`:
  - `id` (UUID)
  - `student_id` (UUID)
  - `counsellor_id` (UUID)
  - `message` (Text, encrypted)
  - `status` (Enum: PENDING, IN_PROGRESS, RESOLVED)

---

# 7. API REQUIREMENTS

- **GET `/api/v1/support/counsellors`**
- **POST `/api/v1/support/requests`**
- **GET `/api/v1/support/requests`**

---

# 8. SECURITY & PRIVACY

- `SupportRequest` messages are `Restricted Data`.
- Emails sent to counsellors MUST NOT contain the student's message, only a notification that a request is waiting in the secure portal.

---

# 9. ANALYTICS

- `counsellor_directory_viewed`
- `support_request_submitted` (Crucial metric for institutional ROI)
