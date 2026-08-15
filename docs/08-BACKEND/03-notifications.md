# MANNMITRA — NOTIFICATION SYSTEM

Document: `08-BACKEND/03-notifications.md`
Status: Production Specification
Version: 1.0
Audience: Backend Engineers
Platform: Backend System

---

# 1. PURPOSE

To deliver timely, relevant updates (e.g., break reminders, calendar alerts, SOS dispatches) without becoming a source of stress for the student.

---

# 2. CHANNELS

- **In-App (Toast):** For immediate, low-stress feedback (e.g., "Task Saved").
- **Push Notifications (PWA / Mobile):** For time-sensitive alerts (e.g., "Break time," "Upcoming exam").
- **Email/SMS:** Strictly reserved for account security, SOS escalation, or Counsellor communications.

---

# 3. ANTI-STRESS DELIVERY RULES

1. **Quiet Hours:** Notifications MUST be suppressed during user-defined sleep windows.
2. **Batching:** If multiple community reactions occur, send ONE summary notification (e.g., "3 people supported your post") rather than 3 separate pings.
3. **Quiet Space:** If the user is in Quiet Mode (`14-quiet-space.md`), ALL non-critical notifications are paused.

---

# 4. DATA MODEL

- `Notification`:
  - `id` (UUID)
  - `user_id` (UUID)
  - `type` (Enum: SYSTEM, WELLNESS, COMMUNITY, URGENT)
  - `content` (String)
  - `is_read` (Boolean)
  - `created_at` (Timestamp)
