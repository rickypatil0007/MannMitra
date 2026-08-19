# Data Retention & Deletion Policy

## 1. Purpose
To define how long MannMitra stores different classes of data, ensuring compliance with privacy regulations (GDPR, CCPA, local education laws) and minimizing the risk of a breach by not hoarding unnecessary sensitive data.

## 2. Scope
Applies to database records, AI chat transcripts, storage buckets (audio/images), and system backups.

## 3. Retention Schedules

### 3.1 AI Chat Transcripts (Mitra)
- **Retention**: 30 Days rolling.
- **Reason**: AI needs recent context to maintain conversational continuity, but historical transcripts are highly sensitive. After 30 days, specific extracted *facts* (e.g., "User struggles with math") are stored as summarized metadata, and the raw chat text is hard-deleted.

### 3.2 Student Journals & Voice Notes
- **Retention**: Indefinite, until account deletion.
- **Reason**: This is explicitly user-created content meant for long-term reflection.

### 3.3 Aggregated Institutional Analytics
- **Retention**: 5 Years.
- **Reason**: Needed for institutional year-over-year trending. Privacy is preserved because the data is permanently k-anonymized and decoupled from specific user IDs.

### 3.4 SOS / Emergency Escalation Logs
- **Retention**: 7 Years.
- **Reason**: Required for legal liability, audit, and institutional compliance regarding duty-of-care incidents.

## 4. Deletion Workflows

### 4.1 Account Deletion
When a user clicks "Delete Account":
1. **Grace Period**: Account is marked `is_deleted = true` for 30 days. The user can log back in to cancel the deletion.
2. **Hard Deletion**: A monthly cron job sweeps the database. It deletes the `auth.users` record, which triggers a `CASCADE` delete removing all personal data (`profiles`, `journals`, `tasks`).
3. **Orphaned Content**: Any public/anonymous community posts are kept but the `author_id` is set to `NULL`.

## 5. Security / Privacy
- Database backups (e.g., daily snapshots) naturally retain deleted data for up to 30 days. The privacy policy must clearly state that "deleted data may persist in encrypted disaster recovery backups for up to 30 days."

## 6. Testing
- Create a test user, mark them for deletion, advance the system clock (in a test environment) by 31 days, run the cleanup cron job, and assert that querying the `journals` table for that user returns exactly 0 rows.
