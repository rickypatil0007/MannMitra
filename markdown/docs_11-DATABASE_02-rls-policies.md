# MANNMITRA — ROW-LEVEL SECURITY (RLS) POLICIES

Document: `11-DATABASE/02-rls-policies.md`
Status: Production Specification
Version: 1.0
Audience: Database Architects, Security Engineers
Platform: Database

---

# 1. PURPOSE

To define the exact database-level rules that enforce the privacy architecture. In a Supabase/Postgres environment, RLS is the ultimate defense against unauthorized data access.

---

# 2. IMPLEMENTATION RULES

- **Default State:** RLS MUST be enabled on ALL tables by default. If a table lacks an explicit policy, Postgres defaults to denying all access.
- **Service Role:** Background jobs and backend admin tasks can bypass RLS using a securely stored Service Role key, but client-facing API requests MUST respect RLS using the user's JWT.

---

# 3. CRITICAL POLICIES

### Private Data (Tasks, Messages, Reflections)
```sql
CREATE POLICY "Users can only access their own private data"
ON "public"."tasks"
FOR ALL USING (auth.uid() = user_id);
```

### Community Posts (Read)
```sql
CREATE POLICY "Authenticated users can read approved public posts"
ON "public"."community_posts"
FOR SELECT USING (
  auth.role() = 'authenticated' AND status = 'APPROVED'
);
```

### Community Posts (Write)
```sql
CREATE POLICY "Users can only write posts under their own profile"
ON "public"."community_posts"
FOR INSERT WITH CHECK (
  community_profile_id IN (
    SELECT id FROM community_profiles WHERE user_id = auth.uid()
  )
);
```

### Counsellor Access
```sql
CREATE POLICY "Counsellors can view requests assigned to them"
ON "public"."support_requests"
FOR SELECT USING (
  counsellor_id = auth.uid()
);
```
