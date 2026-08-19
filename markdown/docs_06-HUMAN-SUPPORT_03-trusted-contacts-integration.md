# MANNMITRA — TRUSTED CONTACTS INTEGRATION

Document: `06-HUMAN-SUPPORT/03-trusted-contacts-integration.md`
Status: Production Specification
Version: 1.0
Audience: Backend Engineers
Platform: Backend

*Note: For the UX flow, refer to `03-STUDENT/19-trusted-contacts.md`.*

---

# 1. PURPOSE

To handle the secure outbound communication to third parties (parents, friends) designated by the student, ensuring that notifications are delivered reliably during distress without leaking sensitive data.

---

# 2. INTEGRATION MECHANICS

**Trigger:**
The student clicks "Reach out to [Contact]" from the Support page or SOS menu.

**Backend Execution:**
1. API receives the request with the `trusted_contact_id`.
2. Backend verifies ownership (`user_id == auth.uid()`).
3. Backend formats a predefined, non-alarming message.
   - *Example SMS:* "Hi [Contact Name]. Your friend [Student Name] is currently using the MannMitra app and requested you check in with them when you have a moment. Just a quick text or call would be great."
4. Backend dispatches the message via an external provider (e.g., Twilio for SMS, SendGrid for Email).

---

# 3. SAFETY CONTROLS

- **Rate Limiting:** A student CANNOT trigger a message to a trusted contact more than once every 1 hour to prevent spam.
- **Opt-Out:** The SMS/Email MUST include instructions for the contact to opt-out if they were added maliciously (e.g., "Reply STOP to stop receiving these").

---

# 4. LOGGING

- The backend MUST log that a notification was dispatched (for system health auditing), but it MUST NOT log the content of the student's current chat with Mitra or their specific wellness scores alongside this event.
