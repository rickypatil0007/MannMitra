# Authorization & RBAC

## 1. Purpose
To define exactly who can see and do what within the MannMitra platform, ensuring absolute privacy boundaries are maintained between Students, Counsellors, and Faculty.

## 2. Scope
Covers Role-Based Access Control (RBAC) implemented via custom JWT claims and enforced at both the API layer and the database Row Level Security (RLS) layer.

## 3. Core Roles

### `student` (Default)
- **Permissions**: Can read/write their own data. Can read public community posts. Can create anonymous community posts.
- **Restrictions**: Cannot read other students' private data. Cannot access institutional endpoints.

### `counsellor`
- **Permissions**: Can read basic student profiles assigned to their caseload. Can read student wellness summaries *only* if consent is actively granted in the `ConsentLog`.
- **Restrictions**: Cannot read private diaries or raw Mitra AI chat logs under any circumstances.

### `faculty`
- **Permissions**: Can access the `/api/v1/analytics/cohort` endpoint to view aggregated, k-anonymized stress trends.
- **Restrictions**: Cannot read any individual student records.

### `admin`
- **Permissions**: Can verify and provision `counsellor` and `faculty` accounts.
- **Restrictions**: Cannot read student personal health data or chat logs (Admins are IT, not healthcare providers).

## 4. Requirements
- The user's role must be embedded securely inside the Supabase JWT `app_metadata` claim so that RLS policies can evaluate it instantly without requiring an expensive secondary table lookup.
- E.g., `(auth.jwt() -> 'app_metadata' ->> 'role') = 'counsellor'`

## 5. Functional Behavior
- **Role Assignment**: Students automatically receive the `student` role. Counsellor and Faculty roles must be assigned manually by an Admin via a secure server action that calls the Supabase Admin API.

## 6. Security / Privacy
- **Zero Trust**: The frontend UI hiding a button (e.g., hiding the "Institution Dashboard" link for a student) is NOT authorization. The backend API route and the Database RLS policy MUST independently verify the JWT role claim before returning data.

## 7. Edge Cases
- **Role Revocation**: If an admin revokes a counsellor's access, the system must immediately invalidate their active refresh tokens so they cannot fetch data for another 60 minutes.

## 8. Testing
- **Negative Testing**: Write an integration test where a user with a `student` JWT attempts to execute a `GET` request against the `/institution/dashboard` endpoint and verify a strict HTTP 403 Forbidden is returned.
