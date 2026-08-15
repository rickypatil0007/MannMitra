# MANNMITRA — AGENT CODING RULES

Document: `16-AGENT/01-coding-rules.md`
Status: Production Specification
Version: 1.0
Audience: AI Coding Agents (Antigravity), Engineers
Platform: Source Code

---

# 1. PURPOSE

To instruct AI coding agents (and human developers) on the strict architectural and styling constraints required when writing code for MannMitra.

---

# 2. STRICT NEXT.JS RULES (Next.js 14/15 App Router)

- **Read Context:** You MUST review `/docs/10-TECHNICAL/02-frontend-architecture.md` before generating React components.
- **Client vs Server:** Default to Server Components. You MUST explicitly add `"use client"` at the very top of the file for components requiring interactivity (`useState`, `onClick`, `useChat`).
- **Data Fetching:** Do NOT use `useEffect` for initial data fetching. Use React Server Components or React Query/SWR on the client.

---

# 3. TAILWIND STYLING CONSTRAINTS

- **Design System:** You MUST strictly adhere to the colors defined in `/docs/02-UX-UI/01-design-system.md`.
- **Primary Background:** Always default to `bg-white` or `bg-[#F7F9F7]` for large surfaces.
- **Text Color:** Use `text-[#171A18]` for primary text. Do NOT use `text-black`.
- **Borders & Radii:** Use `rounded-2xl` or `rounded-3xl`. The UI must feel soft. Do not use sharp `rounded-sm` corners for major layout elements.
- **Shadows:** Use subtle, large shadows (e.g., `shadow-sm` or a custom soft shadow). Do not use harsh, dark drop-shadows.

---

# 4. COMPONENT STRUCTURE (shadcn/ui)

- If modifying base components (`Button`, `Input`, `Card`), ensure they support the `asChild` prop using Radix UI's `Slot` component to prevent nesting anchor tags inside buttons.
- Export interfaces explicitly.

---

# 5. NO PLACEHOLDERS

- Do NOT generate code with comments like `// TODO: Implement actual logic here`. 
- If you write a feature, write the actual implementation based on the documentation in `/docs`.
