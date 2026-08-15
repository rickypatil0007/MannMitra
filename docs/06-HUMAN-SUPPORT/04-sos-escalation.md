# MANNMITRA — SOS ESCALATION PROTOCOL

Document: `06-HUMAN-SUPPORT/04-sos-escalation.md`
Status: Production Specification
Version: 1.0
Audience: Backend Engineers, Security Engineers
Platform: Backend

*Note: For the UX flow, refer to `03-STUDENT/20-sos.md`.*

---

# 1. PURPOSE

To define the exact technical and operational steps the system takes when a severe crisis is detected (Silent SOS or AI Safety trigger).

---

# 2. TRIGGER CONDITIONS

1. **Manual:** Student clicks the SOS button and selects an action.
2. **Automated (Mitra):** The `12-ai-safety.md` module detects severe intent (e.g., imminent self-harm).

---

# 3. ESCALATION LEVELS

### Level 1: Self-Service Escalation (Default MVP)
The system presents the SOS UI. The student must manually tap a button to call 911 or a crisis hotline. 
*Why?* Automated dispatch of emergency services often violates local laws and creates massive liability. MannMitra acts as a directory in Level 1.

### Level 2: Institutional Notification (Configurable per College)
If the student consented during onboarding, and the institution requires it:
An automated, high-priority alert is sent to the designated on-campus emergency response team (e.g., Campus Security or the Head Counsellor).
*Payload:* "SOS Triggered by Student ID [UUID]. Action required."

---

# 4. TECHNICAL IMPLEMENTATION (LEVEL 2)

- Use a dedicated, high-availability queue (e.g., Redis / BullMQ) for SOS alerts to ensure they are not dropped if the main database is under load.
- If Campus Security does not acknowledge the alert within 5 minutes, escalate to a secondary contact.

---

# 5. DATA PRIVACY IN EMERGENCIES

- The SOS Alert payload MUST ONLY contain the information necessary to locate and help the student. It MUST NOT include a transcript of their recent AI conversations unless legally compelled.
