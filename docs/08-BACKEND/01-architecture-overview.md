# MANNMITRA — BACKEND ARCHITECTURE OVERVIEW

Document: `08-BACKEND/01-architecture-overview.md`
Status: Production Specification
Version: 1.0
Audience: Backend Engineers, DevOps
Platform: Backend System

---

# 1. PURPOSE

To define the foundational backend structure that supports MannMitra's responsive UI and intensive AI operations.

---

# 2. TECHNOLOGY STACK

- **Framework:** Next.js (App Router) API Routes (Serverless) OR Node.js/Express (if long-running processes are required).
- **Database:** PostgreSQL (Supabase recommended for MVP due to built-in Auth and RLS).
- **AI/LLM Provider:** OpenAI API (GPT-4o-mini for speed/cost, GPT-4o for complex planning).
- **Storage:** S3-compatible object storage (for Voice Notes).

---

# 3. SERVICE ARCHITECTURE (LOGICAL)

While it may be deployed as a monolith (Next.js), the code must be structured into logical services:

1. **Auth Service:** Registration, SSO, Token management.
2. **User Service:** Profiles, Preferences, Privacy settings.
3. **Planner Service:** Tasks, Events, Calendar operations.
4. **Wellness Service:** Stress tracking, Analytics aggregations.
5. **AI Service:** Orchestrator, Prompts, LLM streaming (Requires Edge network support for fast SSE).
6. **Community Service:** Anonymous alias generation, Moderation pipelines.
7. **SOS/Notification Service:** High-reliability dispatch of alerts.

---

# 4. DESIGN PATTERNS

- **Stateless APIs:** All API endpoints must be stateless, relying on JWT/Session tokens for auth.
- **Server-Sent Events (SSE):** Required for the AI Service to stream responses to the frontend.
- **Background Jobs:** Heavy tasks (Stress Forecasting, Aggregated Analytics, Memory Extraction) MUST run asynchronously via a task queue (e.g., BullMQ, Inngest, or Supabase Cron) so they do not block API responses.

---

# 5. ENVIRONMENT STRATEGY

- `production`: Real user data. Strict access controls.
- `staging`: Mirrors production config. Used for testing new AI prompts safely.
- `development`: Local developer environments. Dummy data only. No PII.
