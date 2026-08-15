# MANNMITRA — AUTHENTICATION FLOW (API)

Document: `12-API/02-authentication-flow.md`
Status: Production Specification
Version: 1.0
Audience: Backend Engineers, Frontend Engineers
Platform: System Architecture

---

# 1. PURPOSE

To standardize how the API securely identifies the user making the request without relying on easily spoofed headers.

---

# 2. TOKEN VERIFICATION

All protected API routes MUST verify the JWT token before executing any business logic.

**Next.js Route Handler Example:**
```typescript
import { createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
  const supabase = createServerClient(...);
  
  // This verifies the token cryptographically
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  // Safe to proceed using `user.id`
}
```

---

# 3. CONTEXT INJECTION

- The `user.id` extracted from the verified token MUST be used for all subsequent database queries. 
- NEVER trust a `user_id` passed in the JSON body of a request for operations where the user is acting on their own data.

**Wrong:** `UPDATE tasks SET status='COMPLETED' WHERE id = body.task_id AND user_id = body.user_id;`
**Right:** `UPDATE tasks SET status='COMPLETED' WHERE id = body.task_id AND user_id = authUser.id;`

---

# 4. GUEST TOKEN HANDLING

- Guest users receive a standard JWT, but their `role` claim is set to `guest`.
- The API MUST check this role if the endpoint modifies persistent database state (like creating a community post) and return a `403 Forbidden` for guests.
