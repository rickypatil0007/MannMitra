# MANNMITRA — CACHING STRATEGY

Document: `08-BACKEND/04-caching-strategy.md`
Status: Production Specification
Version: 1.0
Audience: Backend Engineers
Platform: Backend System

---

# 1. PURPOSE

To ensure the application feels instantly responsive (critical for a calming UX) and to minimize unnecessary LLM and database costs.

---

# 2. CACHING TIERS

### 1. Client-Side State (React Query / SWR)
- **Data:** User tasks, calendar events, current wellness metrics.
- **Strategy:** Stale-while-revalidate. Optimistic UI updates (e.g., marking a task complete immediately in the UI while the API request resolves in the background).

### 2. Edge / CDN Caching
- **Data:** Comfort Library resources, Public Senior Stories, CSS/Assets.
- **Strategy:** Long-lived cache headers (e.g., `Cache-Control: public, max-age=86400`).

### 3. Backend Caching (Redis)
- **Data:** Aggregated institutional metrics, ML Model embeddings, Rate limits.
- **Strategy:** Short-lived TTLs (Time To Live).

---

# 3. INVALIDATION

- **User Data:** When a student creates a task, the client-side cache for `/api/v1/tasks` is invalidated immediately.
- **Community:** The community feed should heavily rely on cursor-based pagination rather than aggressive caching, to ensure moderated/deleted posts disappear quickly.
