# Audit Logging

## 1. Purpose
To maintain a secure, immutable record of critical actions within the system, ensuring accountability, aiding in debugging, and fulfilling compliance requirements regarding sensitive health-related data.

## 2. Scope
Covers what is logged, how it is stored, and who can access the logs.

## 3. What to Log
Not every click is audited. Audit logging is reserved for significant security, privacy, or lifecycle events.

### A. Authentication & Access
- Login successes and failures.
- Password resets.
- Role changes (e.g., user promoted to counsellor).

### B. Sensitive Data Access
- A counsellor opening a student's wellness summary (Logging: `counsellor_id`, `student_id`, `timestamp`, `consent_id_referenced`).
- An admin accessing a system configuration panel.

### C. Emergency Actions (Critical)
- Activation of the SOS system.
- Dispatch of an SMS to a Trusted Contact.
- Escalation Engine overriding privacy controls to alert campus security.

### D. Data Lifecycle
- Account deletion requests.
- Export of user data (GDPR/Data Privacy compliance).

## 4. Technical Implementation
- **Storage**: A dedicated `audit_logs` table in PostgreSQL.
- **Immutability**: The table must have a Row Level Security policy that allows `INSERT` but strictly denies `UPDATE` or `DELETE` to ALL roles, including standard admins. Only a superuser connecting directly to the database can drop logs (and that action itself is logged by AWS/GCP).
- **Triggers**: Many logs are generated automatically via PostgreSQL triggers (e.g., `ON UPDATE OF role IN users`).

## 5. Payload Structure
```json
{
  "id": "uuid",
  "actor_id": "uuid (who performed the action)",
  "target_id": "uuid (who was affected, if applicable)",
  "action": "COUNSELLOR_ACCESSED_RECORD",
  "metadata": { "ip_address": "192.168.x.x", "user_agent": "..." },
  "created_at": "timestamp"
}
```

## 6. Security / Privacy
- Audit logs themselves contain sensitive metadata about who is talking to whom. Access to read the `audit_logs` table is restricted strictly to the `System Security Officer` or equivalent high-level administrative role.
- Never log plaintext passwords or API keys in the `metadata` column.

## 7. Data Retention
- Audit logs related to emergency actions (SOS) are retained for 7 years (or according to local medical/institutional liability laws).
- Standard access logs are retained for 1 year, then archived to cold storage (e.g., AWS Glacier).

## 8. Testing
- Attempt to execute an `UPDATE` statement against a row in the `audit_logs` table using the Admin API key and assert it throws a permission denied error.
