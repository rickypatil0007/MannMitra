# MANNMITRA — ACCESS CONTROL (RBAC)

Document: `09-SECURITY-PRIVACY/02-access-control.md`
Status: Production Specification
Version: 1.0
Audience: Security Engineers
Platform: System Architecture

---

# 1. PURPOSE

To define the strict authorization boundaries between the different user personas identified in the Master Product Vision.

---

# 2. ROLE DEFINITIONS

### `guest`
- **Read:** Public Content.
- **Write:** None.

### `student`
- **Read:** Own Private/Restricted Data, Anonymous Community Data.
- **Write:** Own Private/Restricted Data, Anonymous Community Data.

### `counsellor`
- **Read:** Student data explicitly shared via `SupportRequest`.
- **Write:** Updates to request status, counsellor notes (invisible to student).

### `faculty`
- **Read:** Only `AggregatedInstitutionalMetrics`.
- **Write:** None.
- **Explicit Block:** Faculty roles MUST be explicitly denied read access to `Users`, `Messages`, `Notes`, etc.

### `admin_moderator`
- **Read:** Community posts (including flagged ones).
- **Write:** Ability to update post status (APPROVE/DELETE) and ban users.
- **Explicit Block:** Moderators MUST NOT have access to private student chats or notes.

---

# 3. ENFORCEMENT

Access control is enforced at TWO layers:
1. **API Layer:** The serverless functions check the JWT role before processing logic.
2. **Database Layer (Defense in Depth):** Row-Level Security (RLS) ensures that even if an API endpoint has a vulnerability, the database will refuse to return unauthorized rows.
