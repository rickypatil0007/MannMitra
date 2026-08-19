# API Overview

## 1. Purpose
Provides a general introduction to the MannMitra API surface, which is consumed by the Next.js frontend (Client Components) and potentially future mobile applications.

## 2. Scope
Explains the structure, base URLs, authentication methods, and error conventions for the API.

## 3. Base Architecture

MannMitra exposes two distinct types of APIs to the client:

### 3.1 PostgREST (Supabase)
- **Base URL**: `https://[PROJECT_REF].supabase.co/rest/v1/`
- **Use Case**: Direct, high-speed CRUD operations on public tables (e.g., fetching a list of community posts).
- **Authentication**: Requires the `apikey` header (the `anon` key) AND the `Authorization` header (`Bearer [JWT]`) for RLS.

### 3.2 Custom Edge API (Next.js Server Actions / API Routes)
- **Base URL**: `https://mannmitra.edu/api/v1/`
- **Use Case**: Complex business logic, AI orchestration, integrations with third-party providers (Twilio, OpenAI), and operations requiring the Service Role key.
- **Authentication**: Validates the session cookie automatically via the Supabase Auth Helpers.

## 4. Standard Request/Response Format
All Custom Edge APIs must strictly adhere to `application/json`.

**Success:**
```json
{
  "success": true,
  "data": { "id": "123", "status": "active" }
}
```

**Failure:**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "You do not have access to this student's records."
  }
}
```

## 5. Rate Limiting
- Supabase endpoints are rate-limited natively via their infrastructure.
- Custom Edge APIs utilize Vercel KV/Upstash Redis for IP/User-based rate limiting (e.g., 60 requests per minute). Responses will include `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers.

## 6. Versioning
- The Next.js API routes must include a version identifier in the path (e.g., `/api/v1/ai/chat`) to allow for future breaking changes without disrupting older mobile clients.
