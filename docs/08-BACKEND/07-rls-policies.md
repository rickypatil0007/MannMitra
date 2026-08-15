# Row Level Security (RLS) Policies

## 1. Purpose
To provide the definitive technical rulebook for PostgreSQL Row Level Security implementation within MannMitra, ensuring that the database physically rejects unauthorized reads or writes regardless of API layer bugs.

## 2. Scope
Covers the general principles of RLS implementation in Supabase for all sensitive student data tables. (For a specific table-by-table matrix, see `11-DATABASE/05-rls-matrix.md`).

## 3. Core Philosophy
- **Deny by Default**: Every new table created in the `public` schema must have RLS enabled immediately (`ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`). Until a specific policy is added, no user can read or write any rows.

## 4. Policy Categories

### 4.1 Strict Personal Ownership (e.g., Diary, Tasks, Stress Logs)
Only the user who created the record can see it.
```sql
CREATE POLICY "Users can only view their own private data" 
ON public.stress_logs FOR SELECT 
USING (auth.uid() = student_id);
```

### 4.2 Consent-Gated Access (e.g., Wellness Summaries)
A counsellor can only read a student's data if there is an active consent record.
```sql
CREATE POLICY "Counsellors can view consented student data" 
ON public.wellness_summaries FOR SELECT 
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'counsellor' 
  AND EXISTS (
    SELECT 1 FROM public.consent_logs 
    WHERE student_id = wellness_summaries.student_id 
    AND counsellor_id = auth.uid() 
    AND is_active = true
  )
);
```

### 4.3 Community Moderation (e.g., Anonymous Posts)
Users can read all approved posts, but only the author can edit/delete their own post.
```sql
CREATE POLICY "Anyone can view approved posts" 
ON public.community_posts FOR SELECT 
USING (status = 'APPROVED');
```

## 5. Security / Privacy
- RLS policies must never rely on inputs passed from the client API (which can be spoofed). They must rely strictly on `auth.uid()` and securely verified JWT claims injected by the Supabase Auth server.

## 6. Testing
- Every RLS policy must have a corresponding test suite in the database migration (e.g., using `pgTAP` or via integration tests) asserting that a user acting as `User B` cannot `SELECT` a record owned by `User A`.
