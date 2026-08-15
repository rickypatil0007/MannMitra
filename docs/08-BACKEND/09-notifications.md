# Notifications System

## 1. Purpose
To proactively alert students, counsellors, and trusted contacts of important events without requiring them to have the MannMitra application actively open.

## 2. Scope
Covers In-App Notifications, Push Notifications (Web/Mobile), Email, and SMS delivery.

## 3. Core Channels & Providers
- **In-App**: Handled natively via a `notifications` table and real-time WebSockets.
- **Push**: Integrated via Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNs) for mobile wrappers.
- **Email**: Delivered via Resend or SendGrid.
- **SMS (Emergency Only)**: Delivered via Twilio (Reserved strictly for SOS escalation and Trusted Contact verification due to cost and urgency).

## 4. Notification Categories

### A. Wellness Reminders (Low Priority)
- "You've been studying for 3 hours. Time for a quick break?"
- Delivered via Push (if opted in) and In-App.

### B. Community Engagement (Low Priority)
- "Someone replied to your post."
- Delivered via In-App.

### C. Counsellor / Appointments (High Priority)
- "Your session starts in 15 minutes."
- Delivered via Push, Email, and In-App.

### D. SOS / Escalation (Critical Priority)
- "URGENT: [Student Name] has triggered an SOS alert."
- Delivered via SMS and automated Voice Call.

## 5. Requirements
- Students MUST be able to customize their notification preferences in Settings (e.g., "Turn off all community notifications, keep appointment reminders").
- The system must respect "Quiet Space Mode" (Feature 11) by temporarily suppressing all non-critical push notifications.

## 6. Functional Behavior
- Notifications are queued via a database trigger that writes to a `notification_queue` table. A background worker (e.g., pg_cron or an external worker) processes the queue, calls the respective third-party API, and marks it as delivered.

## 7. Security / Privacy
- **No Sensitive Data in Payloads**: Push notification and email payloads MUST NOT contain sensitive mental health data, as lock screens are visible to bystanders and email is not secure.
- **BAD**: "Mitra noticed you are highly stressed and depressed today."
- **GOOD**: "You have a new wellness check-in available on MannMitra."

## 8. Testing
- Verify that a user in "Quiet Space Mode" does not receive a push notification for a community reply, but does receive an in-app badge.
