# MANNMITRA — INSTITUTIONAL PRIVACY BOUNDARIES

Document: `07-INSTITUTION/04-privacy-boundaries.md`
Status: Production Specification
Version: 1.0
Audience: Security Engineers, Database Architects, Legal/Compliance
Platform: System Architecture

---

# 1. PURPOSE

To establish hard architectural boundaries that mathematically guarantee the "Privacy First" core principle (Section 2.1). Policy is not enough; the database itself must enforce these rules.

---

# 2. THE HARD RULES

1. **No Backdoors:** There is no "Super Admin" view that allows reading a student's `PersonalNotes` or `VoiceNotes`.
2. **AI Confidentiality:** The LLM's conversation history (`Messages`) cannot be queried by any faculty or counsellor role via the API.
3. **Explicit Consent Only:** Counsellors can only see data if a `SupportRequest` explicitly links to a `WellnessSummarySnapshot` generated at the time of the request.

---

# 3. DATABASE ENFORCEMENT (ROW-LEVEL SECURITY)

Assuming Postgres (Supabase):

**Example: `Messages` Table Policy**
```sql
CREATE POLICY "Users can only view their own chat history"
ON "public"."Messages"
FOR SELECT USING (
  auth.uid() = session_id -- (Assuming session maps to user)
);
```
*Note: There is NO policy granting `role = 'faculty'` access to this table.*

**Example: `CommunityPost` Table Policy**
```sql
CREATE POLICY "Public community posts are visible to all authenticated users"
ON "public"."CommunityPosts"
FOR SELECT USING (
  auth.role() = 'authenticated'
);
-- Note: The API must still strip author_id before returning to the client.
```

---

# 4. AUDITABILITY

- Any database access by developers or DBAs (e.g., for debugging production issues) MUST be logged in an immutable audit trail.
- Developer access to production databases should be strictly limited and require justification.
