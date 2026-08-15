# MANNMITRA — HUMAN SUPPORT SYSTEM OVERVIEW

Document: `06-HUMAN-SUPPORT/01-support-system-overview.md`
Status: Production Specification
Version: 1.0
Audience: Product, Backend Engineers
Platform: System Architecture

---

# 1. PURPOSE

AI is not a substitute for human connection or medical care. The Human Support system acts as the bridge when a student needs a counsellor, a trusted friend, or emergency intervention.

---

# 2. CORE COMPONENTS

1. **Counsellor Portal:** For institutional mental health professionals to manage requests.
2. **Trusted Contacts:** For peer-to-peer or family support during distress.
3. **SOS Escalation:** For immediate crisis response.

---

# 3. GUIDING PRINCIPLES

- **Explicit Consent:** A student's data is never forwarded to a human without explicit action from the student, EXCEPT in defined SOS scenarios where physical safety is at risk.
- **Frictionless Request:** Asking for help is hard. The UI to request support must require no more than 2 taps.
- **Security:** Support requests and messages are highly sensitive and must be encrypted.

---

# 4. ARCHITECTURE

- The system heavily utilizes internal APIs to route requests securely.
- It integrates with a secure Notification Service to email/SMS counsellors or trusted contacts without transmitting sensitive PII in the clear text of the message.
