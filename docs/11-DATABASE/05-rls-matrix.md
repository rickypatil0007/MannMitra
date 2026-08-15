# RLS Matrix

## 1. Purpose
Provides a quick-reference table for the Row Level Security policies applied to the core tables in the MannMitra database.

## 2. Scope
Lists the specific `SELECT`, `INSERT`, `UPDATE`, and `DELETE` access rules for students and counsellors.

## 3. The Matrix

| Table | Role | SELECT (Read) | INSERT (Create) | UPDATE (Edit) | DELETE |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **profiles** | `student` | Own row only | Triggers only | Own row only | `cascade` via auth |
| **profiles** | `counsellor` | Assigned caseload | No | No | No |
| **tasks** | `student` | `uid = student_id` | `uid = student_id` | `uid = student_id` | `uid = student_id` |
| **stress_logs** | `student` | `uid = student_id` | `uid = student_id` | No (Immutable) | No (Immutable) |
| **mitra_msgs** | `student` | `uid = student_id` | Server Action | No | Server Action |
| **diary** | `student` | `uid = student_id` | `uid = student_id` | `uid = student_id` | `uid = student_id` |
| **diary** | `counsellor` | **DENIED** | **DENIED** | **DENIED** | **DENIED** |
| **community** | `student` | All Approved | `uid = author_id` | `uid = author_id` | `uid = author_id` |
| **consent** | `student` | Own row only | `uid = student_id` | `uid = student_id` | `uid = student_id` |
| **consent** | `counsellor`| `uid = grantee_id` | No | No | No |

## 4. Implementation Rules
- All `UPDATE` policies on user-editable tables (like `tasks`) must enforce `WITH CHECK (uid = student_id)` to prevent a user from transferring ownership of a task to someone else during an update.

## 5. Security / Privacy
- The "Diary" row in the matrix is the most critical. RLS absolutely guarantees that even if a frontend bug attempts to fetch diary entries for a counsellor, the database will return `[]`.

## 6. Testing
- RLS Matrix must be audited using a script during CI/CD to ensure no table accidentally defaults to public read access.
