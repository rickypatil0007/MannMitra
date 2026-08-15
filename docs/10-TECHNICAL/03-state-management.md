# MANNMITRA — STATE MANAGEMENT

Document: `10-TECHNICAL/03-state-management.md`
Status: Production Specification
Version: 1.0
Audience: Frontend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

To define how data flows through the React application, preventing "prop drilling" and ensuring the UI always reflects the truth of the database without unnecessary re-renders.

---

# 2. SERVER STATE (Primary)

The vast majority of MannMitra's state is "Server State" (e.g., tasks, wellness records, community posts).

**Implementation:**
- Use **React Query (TanStack Query)** or **SWR**.
- *Why:* It automatically handles caching, background refetching, and optimistic updates.
- Do NOT copy server data into global state stores (like Redux) just to display it.

---

# 3. CLIENT STATE (Secondary)

For ephemeral UI state (e.g., "Is this modal open?", "What is typed in the composer right now?").

**Implementation:**
- Local state (`useState`, `useReducer`) for component-specific data.
- Context API or lightweight stores (e.g., **Zustand**) for global UI state (e.g., active theme, current sidebar tab).

---

# 4. AI CHAT STATE

The conversational state with Mitra requires specific handling.

**Implementation:**
- Use the `useChat` hook from Vercel AI SDK.
- It manages the message history array, handles the streaming SSE response, and provides loading states automatically.
