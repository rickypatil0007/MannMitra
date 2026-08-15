# Database Functions & Triggers

## 1. Purpose
Documents the stored procedures (Functions) and Triggers executing directly inside the PostgreSQL database for performance and atomicity.

## 2. Scope
Covers automated profile creation, update timestamps, and complex data aggregations.

## 3. Core Functions

### 3.1 Profile Creation Trigger
- **Event**: `AFTER INSERT ON auth.users`
- **Function**: `handle_new_user()`
- **Behavior**: Automatically inserts a row into `public.profiles` matching the new UUID, assigning a default generic `anonymous_handle`.

### 3.2 Timestamp Auto-Updater
- **Event**: `BEFORE UPDATE ON [table_name]`
- **Function**: `update_modified_column()`
- **Behavior**: Sets `updated_at = now()`. Applied to `profiles`, `tasks`, `community_posts`.

### 3.3 Analytics Rollup (RPC)
- **Function**: `compute_daily_stress_aggregates()`
- **Behavior**: A stored procedure that groups `stress_logs` by department/cohort, computes the average, verifies k-anonymity, and writes the result to `analytics.daily_cohort_stress`. Called nightly via `pg_cron`.

## 4. Remote Procedure Calls (RPC)
Supabase allows calling Postgres functions directly from the client via `.rpc()`.
- **Usage in MannMitra**: Highly discouraged for complex business logic. Prefer Next.js Server Actions. Use RPCs only for database-heavy aggregations that would transfer too much data if done in Node.js.

## 5. Security / Privacy
- Triggers running as `SECURITY DEFINER` execute with the privileges of the creator (usually a superuser). They must be written extremely carefully to avoid bypassing RLS accidentally. Always prefer `SECURITY INVOKER` unless elevation is explicitly required (like creating a profile upon auth registration).

## 6. Testing
- Write a SQL test that inserts into `auth.users` and asserts that a corresponding row in `public.profiles` appears within the same transaction.
