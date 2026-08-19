# MANNMITRA — FRONTEND ARCHITECTURE

Document: `10-TECHNICAL/02-frontend-architecture.md`
Status: Production Specification
Version: 1.0
Audience: Frontend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

To establish the structural patterns of the React/Next.js codebase, ensuring the UI remains highly responsive and maintainable across Mobile and Desktop.

---

# 2. FOLDER STRUCTURE (NEXT.JS APP ROUTER)

```text
src/
├── app/                  # Next.js App Router pages and API routes
│   ├── (public)/         # Landing page, login, resources
│   ├── (student)/        # Student dashboard, planner, Mitra
│   └── (institution)/    # Faculty and Counsellor dashboards
├── components/
│   ├── ui/               # Reusable base components (Buttons, Inputs, Cards)
│   ├── blocks/           # Complex components (PlannerGrid, ChatInterface)
│   └── layouts/          # Navigation, Sidebars, Mobile Tabs
├── lib/                  # Utility functions, API clients, Supabase client
├── hooks/                # Custom React hooks (e.g., useStressData)
└── types/                # Global TypeScript definitions
```

---

# 3. COMPONENT DESIGN PRINCIPLES

- **Server Components by Default:** Use React Server Components (RSC) to fetch data on the server and reduce client JavaScript payload.
- **Client Components on Demand:** Only add `"use client"` when interactivity, state, or hooks (e.g., `useState`, `useChat`) are required (e.g., the Mitra chat composer).
- **Responsive-First:** Build the mobile UI first using Tailwind (`w-full px-4`), then scale up using breakpoints (`md:px-8 lg:max-w-4xl`).

---

# 4. ACCESSIBILITY (a11y)

- All interactive elements must be keyboard navigable.
- Semantic HTML tags (`<nav>`, `<main>`, `<article>`) must be used.
- ARIA live regions must be used for dynamic content (e.g., when Mitra starts typing).
