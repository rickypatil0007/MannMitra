# Consent Management

## 1. Purpose
To provide a secure, trackable, and user-controlled mechanism for students to grant or revoke access to their sensitive data.

## 2. Scope
Covers the UI flows, database tracking, and API enforcement of data sharing agreements between students and counsellors/institutions.

## 3. Core Principles
- **Opt-In Only**: Sharing personal wellness data (Level 4) is never default.
- **Granular**: A user can share their "Stress Forecast" without sharing their "Mitra Chat Logs".
- **Revocable**: Consent can be revoked at any time with immediate effect.

## 4. The Consent Matrix

| Data Type | Shared with Faculty | Shared with Counsellor | Shared with Community |
| :--- | :--- | :--- | :--- |
| **Aggregated Stress** | Always (k-anonymized) | N/A | No |
| **Personal Stress Log** | Never | Explicit Consent | No |
| **Mitra Chat Logs** | Never | Explicit Consent (Rare) | No |
| **Diary Entries** | Never | Never | No |
| **SOS Triggers** | Emergency Protocol | Emergency Protocol | No |

## 5. Functional Behavior
- **Requesting Consent**: A counsellor can ping a student to request access to their 30-day stress trend to prepare for an appointment.
- **Granting Consent**: The student receives an in-app notification outlining exactly what data is requested and for how long (e.g., "7 days" or "Indefinitely").
- **Database Record**: A record is created in the `consent_logs` table: `student_id`, `grantee_id` (counsellor), `scope` (array of permissions), `expires_at`, `status` (ACTIVE, REVOKED).

## 6. Security / Enforcement
- The RLS policies on the `stress_logs` and `wellness_summaries` tables `JOIN` against the `consent_logs` table. If the consent is REVOKED or expired, the database immediately returns 0 rows to the counsellor.

## 7. UI / UX Behavior
- The "Privacy & Sharing" settings tab displays active consents clearly (e.g., "Counsellor Dr. Smith has access to your Stress Forecast"). A large "Revoke Access" button is provided.

## 8. Testing
- Set an active consent log's `expires_at` to a timestamp in the past. Attempt to query the student's data as the counsellor and assert access is denied.
