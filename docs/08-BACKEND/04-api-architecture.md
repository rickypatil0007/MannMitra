# API Architecture

## 1. Purpose
To define the design patterns, protocols, and structure used for communication between the MannMitra frontend and backend.

## 2. Scope
Covers REST endpoints, GraphQL (if used via Supabase), Server Actions (Next.js), and WebSocket channels.

## 3. Architecture Pattern
MannMitra utilizes a **Hybrid API Architecture**:

1. **Next.js Server Actions**: Used for heavy business logic, AI orchestration, and complex database mutations where server-side secrets (like the OpenAI API key) are required.
2. **PostgREST (Supabase)**: Used directly by the client for high-speed, simple data fetching (e.g., loading public community posts or the user's task list) where Row Level Security handles authorization.
3. **WebSockets (Supabase Realtime)**: Used for streaming AI chat responses and immediate peer matching notifications.

## 4. Requirements
- All Server Actions must validate inputs using Zod before interacting with the database.
- APIs must return standardized error payloads.
- Sensitive endpoints must verify the session token explicitly.

## 5. Standard Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "metadata": { "count": 10 }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The task title cannot be empty."
  }
}
```

## 6. Routing Structure (Next.js)
- `/api/v1/ai/chat`: Handles Mitra conversation turns.
- `/api/v1/webhooks/supabase`: Handles database triggers (e.g., sending an email when a new SOS is created).

## 7. Security / Privacy
- **CORS**: Restricted to the exact domain of the production application and verified localhost ports.
- **CSRF**: Mitigated natively by Next.js Server Actions and secure session cookies.

## 8. Error Handling
- The API layer catches all unhandled exceptions, logs the stack trace to an APM (e.g., Sentry), and returns a generic 500 error to the client to prevent leaking internal stack details.

## 9. Edge Cases
- **Network Interruptions**: For streaming AI endpoints, the client must handle premature stream termination and offer a "Retry Response" button.
