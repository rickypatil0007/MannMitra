# Tables

## 1. Purpose
Provides the specific definitions, columns, and data types for the core tables in the `public` schema of MannMitra.

## 2. Scope
Covers the foundational entities required to run the MVP.

## 3. Core Tables

### 3.1 `profiles`
Created automatically via a trigger when a user signs up.
- `id` (uuid, PK, references `auth.users`)
- `role` (text, default 'student')
- `display_name` (text, nullable)
- `anonymous_handle` (text, generated)
- `avatar_url` (text, nullable)
- `created_at` (timestamptz)

### 3.2 `tasks`
Powers the Planner (Feature 05).
- `id` (uuid, PK)
- `student_id` (uuid, FK to `profiles`)
- `title` (text)
- `description` (text, nullable)
- `due_date` (timestamptz)
- `status` (text: 'TODO', 'IN_PROGRESS', 'DONE')
- `is_ai_extracted` (boolean, default false)
- `created_at` (timestamptz)

### 3.3 `stress_logs`
Powers Wellness Analytics (Feature 14).
- `id` (uuid, PK)
- `student_id` (uuid, FK to `profiles`)
- `level` (int, 1-10)
- `primary_emotion` (text)
- `context_tags` (text[])
- `created_at` (timestamptz)

### 3.4 `mitra_conversations`
Groups chat messages into sessions.
- `id` (uuid, PK)
- `student_id` (uuid, FK to `profiles`)
- `title` (text, AI-generated summary)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 3.5 `mitra_messages`
Stores individual chat turns.
- `id` (uuid, PK)
- `conversation_id` (uuid, FK to `mitra_conversations`)
- `role` (text: 'user', 'assistant')
- `content` (text)
- `created_at` (timestamptz)

### 3.6 `community_posts`
Powers the Community (Feature 22).
- `id` (uuid, PK)
- `author_id` (uuid, FK to `profiles`)
- `content` (text)
- `is_anonymous` (boolean)
- `category` (text)
- `status` (text: 'PENDING', 'APPROVED', 'REJECTED', 'DELETED')
- `created_at` (timestamptz)

## 4. Security / Privacy
- All tables must have `created_at` and `updated_at` timestamps for auditability.
- No sensitive keys (like passwords) are stored here; they remain in `auth.users`.

## 5. Testing
- Migrations must include tests that attempt to insert invalid data types (e.g., passing a string to `stress_logs.level`) and assert that the database constraint rejects it.
