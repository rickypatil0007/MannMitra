# Relationships

## 1. Purpose
Details how the core tables in the database interconnect, including foreign key constraints and cascade behaviors.

## 2. Scope
Focuses on ensuring referential integrity and safe data lifecycle management across the PostgreSQL database.

## 3. Core Relationships

### 3.1 User → Profile (1:1)
- `public.profiles.id` perfectly mirrors `auth.users.id`.
- **Constraint**: `FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE`.
- **Behavior**: If a user is deleted from the auth system, their public profile vanishes instantly.

### 3.2 Profile → Content (1:N)
- `tasks.student_id`, `stress_logs.student_id`, `mitra_conversations.student_id`.
- **Constraint**: `ON DELETE CASCADE`.
- **Behavior**: Hard-deleting a student account wipes all their personal data entirely to comply with privacy laws.

### 3.3 Profile → Community Posts (1:N)
- `community_posts.author_id`.
- **Constraint**: `ON DELETE SET NULL`.
- **Behavior**: If a user deletes their account, their helpful community posts (like a Senior Story) are retained but completely orphaned from their identity.

### 3.4 Conversation → Messages (1:N)
- `mitra_messages.conversation_id`.
- **Constraint**: `ON DELETE CASCADE`.
- **Behavior**: Deleting a chat session drops all messages inside it.

## 4. Complex Relationships

### 4.1 Extracted Tasks
When Mitra AI creates a task from a conversation:
- `tasks` may optionally have an `extracted_from_message_id` FK pointing to `mitra_messages`.
- **Constraint**: `ON DELETE SET NULL`. If the user clears their chat history, the task they agreed to should remain in their planner.

## 5. Security / Privacy
- Foreign Key cascades are powerful but dangerous. Never use `CASCADE` on tables that have financial, audit, or institutional compliance implications (e.g., `audit_logs`).

## 6. Testing
- Write a database test: Insert a user, a task, and a post. Delete the user from `auth.users`. Assert that the task is gone, but the post remains with a `NULL` author.
