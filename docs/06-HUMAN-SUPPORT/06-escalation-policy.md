# Escalation Policy

## 1. Purpose
To define the strict rules and automated pathways for escalating a student's distress signals from automated AI support to human intervention, ensuring no critical situation is ignored while minimizing false alarms.

## 2. Scope
This document governs the rules engine that decides *when* and *how* to escalate. It applies to Mitra AI conversations, stress forecast spikes, and explicit user actions.

## 3. Actors
- **Mitra AI Classifier**: Detects escalation triggers.
- **Escalation Engine**: Routes the alert.
- **Counsellor / Admin**: Receives the escalated alert.

## 4. Requirements
- The system must employ a deterministic rules engine alongside the LLM to prevent the LLM from suppressing critical alerts.
- Escalation must happen instantly upon trigger detection.
- The policy must differentiate between "Require Check-in" (moderate) and "Immediate Intervention" (severe).

## 5. Escalation Triggers

### Level 1: Moderate (Require Check-in)
- **Trigger**: Student logs "Very High Stress" for 3 consecutive days.
- **Trigger**: Mitra AI detects consistent themes of academic hopelessness or extreme overwhelm.
- **Action**: Mitra prompts the user: "Would you like me to connect you with a counsellor?" No forced escalation.

### Level 2: High (Active Intervention)
- **Trigger**: Student mentions self-harm, suicide, or severe crisis in chat or voice notes.
- **Trigger**: Explicit triggering of the SOS system.
- **Action**: Immediate automated alert sent to the on-call institutional counsellor and/or trusted contacts (based on the institution's configured legal liability matrix). Mitra AI immediately switches to the "Safety Protocol" prompt, providing crisis hotline numbers and ceasing general conversation.

## 6. Functional Behavior
- **Safety Protocol**: When Level 2 is triggered, the AI must not attempt to "talk the user down" or act as a therapist. It must acknowledge the pain, validate the user, and explicitly pivot to human support.

## 7. Data Requirements
- `EscalationLog`: `id`, `student_id`, `trigger_source`, `severity_level`, `timestamp`, `action_taken`.

## 8. Security / Privacy
- Level 2 escalations are exempt from standard privacy restrictions regarding the institution's designated emergency responders, as per standard duty-of-care exceptions.

## 9. Error Handling
- If the primary escalation webhook (e.g., to the counsellor portal) fails, the system must trigger an SMS to the fallback campus security number.

## 10. Testing
- Inject synthetic "Level 2" phrases into the AI chat interface and assert that the Escalation Engine triggers within 1 second and the UI shifts to the Safety Protocol.
