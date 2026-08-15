# State Management

## 1. Purpose
Defines how application state (both UI state and server data) is managed, cached, and synchronized across the MannMitra frontend.

## 2. Scope
Covers local component state, global client state, and server state synchronization strategies.

## 3. Server State (Data Fetching & Caching)
- **Primary Tool**: TanStack React Query (or SWR) + Next.js Server Actions.
- **Philosophy**: The database is the source of truth. The client caches this data to improve UI responsiveness.
- **Implementation**:
  - Use `useQuery` to fetch lists (e.g., Planner Tasks) and cache them by query keys (`['tasks', studentId]`).
  - Use `useMutation` for creating/updating data, immediately performing an optimistic UI update before the server confirms, ensuring a snappy feel.

## 4. Global UI State
- **Primary Tool**: Zustand.
- **Philosophy**: Keep global state to an absolute minimum.
- **Use Cases**: 
  - User session data (derived from Supabase Auth).
  - UI toggles that persist across pages (e.g., "Quiet Space Mode" active status).
  - Global modal controllers (e.g., an SOS modal that can be triggered from anywhere).
- **Structure**: Store files located in `src/store/`. Keep stores small and modular (e.g., `useAuthStore`, `useUiStore`).

## 5. Local Component State
- **Primary Tool**: React `useState` and `useReducer`.
- **Philosophy**: State should live as close to where it is used as possible.
- **Use Cases**: Form inputs (controlled components), local UI toggles (dropdowns, accordions).

## 6. Form State
- **Primary Tool**: React Hook Form + Zod.
- **Philosophy**: Complex forms (like onboarding or creating a detailed support request) should not rely on raw `useState` due to performance (re-renders) and validation complexity.
- **Implementation**: Define a Zod schema for the form, pass it to the hook's resolver, and let React Hook Form manage the field state and error messages.

## 7. Edge Cases
- **Stale Data**: If a user keeps the app open for 24 hours, the `useQuery` hooks must be configured to `refetchOnWindowFocus` to ensure they see the most up-to-date notifications and tasks.
