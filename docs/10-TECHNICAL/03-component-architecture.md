# Component Architecture

## 1. Purpose
Defines the structural pattern for building UI components in the MannMitra Next.js application, ensuring reusability, consistency with the White+Green design system, and maintainability.

## 2. Scope
Covers atomic design principles, Server vs. Client component separation, and the UI library ecosystem (shadcn/ui, Tailwind).

## 3. Architecture Pattern (Atomic Design)
Components are organized into three primary layers within `src/components/`:

### A. UI (Atoms/Molecules)
- Located in `src/components/ui/`
- Fundamental building blocks: Buttons, Inputs, Cards, Dialogs.
- Predominantly generated via `shadcn/ui` and styled using Tailwind CSS classes.
- Completely stateless and highly reusable.

### B. Shared (Organisms)
- Located in `src/components/shared/`
- Complex, domain-agnostic components: TopNav, Sidebar, Footer, Layout wrappers.
- May contain localized state (e.g., mobile menu toggle).

### C. Features (Ecosystems)
- Located near their respective routes (e.g., `src/app/(app)/planner/_components/`) or in `src/components/features/`.
- Domain-specific components: `TaskList`, `StressChart`, `MitraChatInterface`.
- These are often Client Components that handle complex state, data fetching, and business logic.

## 4. Server vs. Client Components (Next.js App Router)
- **Default to Server Components**: Pages and layouts are Server Components (`.tsx` without `"use client"`) by default. This minimizes JavaScript sent to the browser and allows direct, secure database reads.
- **Client Components**: Only use `"use client"` when the component requires interactivity (`useState`, `useEffect`, `onClick`) or browser APIs (like the Web Audio API for voice notes).
- **Interleaving**: Pass Client Components as children to Server Components to avoid polluting the server tree with client logic.

## 5. Styling Guidelines
- All styling is done via Tailwind CSS utility classes.
- Use the `cn()` utility (`clsx` + `tailwind-merge`) to conditionally join classes and resolve conflicts gracefully.
- Strict adherence to the color tokens defined in `tailwind.config.ts` (e.g., `bg-[#EFF8F1]`, `text-[#2E7D5B]`).

## 6. Testing
- UI Components (Atoms) are tested visually using Storybook.
- Feature Components are tested using Jest and React Testing Library to assert interactive behaviors (e.g., clicking a task marks it complete).
