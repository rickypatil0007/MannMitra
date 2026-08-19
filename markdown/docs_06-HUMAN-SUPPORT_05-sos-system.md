# SOS System

## 1. Purpose
Provides an immediate, frictionless, and discreet emergency support mechanism for students experiencing acute distress or crisis.

## 2. Scope
Defines the triggers, routing logic, integrations, and UI of the SOS feature.

## 3. Actors
- **Student**: Triggers the SOS.
- **Mitra AI**: May proactively recommend triggering the SOS based on conversation sentiment.
- **Support Entities**: Trusted contacts, counsellors, or national emergency numbers that receive the alert.

## 4. Requirements
- The SOS trigger must be accessible from almost anywhere in the app (usually a persistent navigation item or floating action button).
- The trigger must require a deliberate action (e.g., slide-to-confirm or press-and-hold for 3 seconds) to prevent accidental activation.
- The system must provide immediate localized emergency numbers (e.g., 112, 911, local suicide prevention hotlines) regardless of network connectivity.

## 5. User Flow
1. **Activation**: Student accesses the SOS screen and activates the alert.
2. **Routing Selection**: The system attempts to contact the Primary Trusted Contact via automated SMS/Push.
3. **Escalation**: If no response, escalates to Secondary Contact.
4. **Institutional Fallback**: If configured by the university, an alert is sent to the on-call campus counsellor or security.
5. **Immediate Resources**: The UI locks into "Safe Mode", displaying large, tappable buttons to call national emergency services or crisis text lines directly.

## 6. UI / UX Behavior
- **Visuals**: The SOS screen uses high-contrast, clear typography. It must explicitly avoid aggressive "flashing red sirens" to prevent inducing panic. The color palette shifts to a clean white and deep green, emphasizing safety and calm.
- **Feedback**: "Alert sent to [Contact Name]. They have been notified."

## 7. Functional Behavior
- **Silent SOS**: A discreet trigger mechanism (e.g., tapping the Mitra icon 5 times rapidly) can activate the SOS without displaying the primary SOS screen, useful in unsafe physical environments.

## 8. Data Requirements
- `SOSIncident` entity: `id`, `student_id`, `trigger_time`, `trigger_type` (manual, silent, AI-suggested), `resolution_status`.

## 9. Security / Privacy
- SOS events bypass standard privacy blocks *only* for the designated trusted contacts and authorized emergency campus personnel, as life-safety supersedes standard data privacy.

## 10. Edge Cases
- **Offline Mode**: If the device has no internet connection, the SOS screen must still load locally cached emergency phone numbers and prompt the user to use their cellular voice network.

## 11. Testing
- Verify that accidental single-taps do not trigger the SMS cascade.
- Verify that offline mode correctly renders the national emergency dialer links.
