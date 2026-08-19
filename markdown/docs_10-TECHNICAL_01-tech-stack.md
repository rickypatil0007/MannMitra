# MANNMITRA — TECH STACK

Document: `10-TECHNICAL/01-tech-stack.md`
Status: Production Specification
Version: 1.0
Audience: Fullstack Engineers
Platform: System Architecture

---

# 1. PURPOSE

To define the standardized technologies used to build MannMitra, ensuring maintainability, performance, and developer velocity.

---

# 2. FRONTEND

- **Framework:** Next.js (App Router). Enables Server-Side Rendering (SSR) for fast initial loads and SEO (for public pages).
- **Language:** TypeScript. Strict typing is required to prevent runtime errors.
- **Styling:** Tailwind CSS v4.
- **Components:** Radix UI primitives / shadcn-ui (customized to match the Luminous Sanctuary design system).

---

# 3. BACKEND & DATABASE

- **API Layer:** Next.js Route Handlers (Serverless) for standard REST. Edge functions for AI streaming.
- **Database:** PostgreSQL.
- **BaaS (Backend as a Service):** Supabase (Handles Auth, Postgres, RLS, Storage, and Realtime).
- **ORM:** Prisma or Drizzle (for type-safe database queries).

---

# 4. AI & DATA PROCESSING

- **LLM Provider:** OpenAI API (GPT-4o / GPT-4o-mini).
- **AI SDK:** Vercel AI SDK (for React hooks `useChat` and stream processing).
- **Vector Search (Future):** `pgvector` inside PostgreSQL.

---

# 5. INFRASTRUCTURE & DEVOPS

- **Hosting:** Vercel (Frontend & API).
- **CI/CD:** GitHub Actions.
- **Monitoring/Logging:** Sentry (Error tracking), PostHog or Mixpanel (Privacy-compliant product analytics).
