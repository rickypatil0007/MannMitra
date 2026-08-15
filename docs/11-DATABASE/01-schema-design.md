# MANNMITRA — SCHEMA DESIGN

Document: `11-DATABASE/01-schema-design.md`
Status: Production Specification
Version: 1.0
Audience: Database Architects, Backend Engineers
Platform: Database

---

# 1. PURPOSE

To outline the relational structure of the PostgreSQL database, ensuring data integrity, fast querying, and strict privacy boundaries.

---

# 2. CORE TABLES

### 2.1 Users & Auth
- `users`: Managed by Supabase Auth (UUID, Email, encrypted Password).
- `profiles`: Extends user with `name`, `department`, `institution_id`, `onboarding_completed`.

### 2.2 Wellness & Planning
- `tasks`: `id`, `user_id`, `title`, `due_date`, `status`, `priority`.
- `wellness_records`: `id`, `user_id`, `stress_level`, `mood`, `created_at`.
- `reflections`: `id`, `user_id`, `prompts_and_answers` (JSONB).

### 2.3 Community
- `community_profiles`: `id`, `user_id`, `anonymous_alias`.
- `community_posts`: `id`, `community_profile_id`, `content`, `status`, `created_at`.
- `reports`: `id`, `post_id`, `reporter_id`, `reason`.

### 2.4 AI & Support
- `conversation_sessions`: `id`, `user_id`, `started_at`.
- `messages`: `id`, `session_id`, `role`, `content`, `created_at`.
- `support_requests`: `id`, `student_id`, `counsellor_id`, `status`.

---

# 3. RELATIONSHIPS & CONSTRAINTS

- Use Foreign Keys with `ON DELETE CASCADE` for user-owned data (Tasks, Messages) so deleting an account wipes the data cleanly (Right to Forget).
- Use `ON DELETE SET NULL` for Community Posts (referencing the author) if the policy is to retain posts but anonymize the author upon account deletion.
