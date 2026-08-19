# Emergency Safety

## 1. Purpose
To outline the ultimate failsafe mechanisms and institutional responsibilities regarding student safety on the MannMitra platform.

## 2. Scope
This document covers the legal, ethical, and technical boundaries of MannMitra in life-threatening scenarios. It serves as the definitive reference for institutional integration.

## 3. Principles
- **MannMitra is NOT a medical device or a replacement for emergency services.**
- The platform operates under a "Best Effort Routing" model for emergencies.
- Ultimate responsibility for physical intervention rests with the institution and local emergency services.

## 4. Requirements
- The application must display a clear, permanent disclaimer in the footer or settings that it is not a clinical tool.
- Institutions onboarding onto MannMitra must provide at least one 24/7 emergency contact number (e.g., campus police or on-call warden) to serve as the ultimate fallback for Level 2 escalations.

## 5. Technical Failsafes
- **Watchdog Timer**: If the Escalation Engine fails to receive an HTTP 200 OK from the Counsellor Notification service during a Level 2 event, it will trigger an automated voice call (via Twilio or similar) to the institution's fallback number.
- **UI Lockdown**: In an active, unresolved Level 2 emergency state, the student's UI will prioritize a banner with a single tap-to-call button for emergency services, persisting across all routes.

## 6. Audit and Liability Logging
- Every action during an emergency escalation (who was notified, at what millisecond, whether the SMS was delivered via carrier, who acknowledged the alert) is written to a tamper-evident, append-only Audit Log.
- This log is critical for institutional review post-incident.

## 7. Data Requirements
- `EmergencyAuditLog`: Append-only table with strict RLS preventing modification or deletion by any user, including standard admins.

## 8. Testing
- **Red Team Scenarios**: Conduct periodic simulated emergency triggers (in a staging environment) to verify that the Twilio fallback, SMS delivery, and Audit Logging all perform within a 5-second SLA.
