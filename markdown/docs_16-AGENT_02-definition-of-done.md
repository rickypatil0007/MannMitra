# MANNMITRA — DEFINITION OF DONE

Document: `16-AGENT/02-definition-of-done.md`
Status: Production Specification
Version: 1.0
Audience: AI Coding Agents, Engineers
Platform: System Architecture

---

# 1. PURPOSE

To establish an absolute baseline for when a feature in MannMitra can be considered "complete."

---

# 2. DEFINITION OF DONE (DoD)

A feature is NOT done when the UI looks good. It is done when:

### 1. Functional Completeness
- The feature exactly matches the requirements defined in its specification document (e.g., `/docs/03-STUDENT/05-planner.md`).
- There are no `TODO` comments or placeholder text left in the code.
- Loading states (skeletons) and Empty states are fully implemented.
- Error handling gracefully informs the user without technical jargon.

### 2. Privacy & Security
- The database table has strict Row-Level Security (RLS) policies implemented and tested.
- The API endpoint securely verifies the user's JWT.
- No PII is logged to the console or analytics platform.

### 3. Styling & Accessibility
- The UI strictly adheres to the Luminous Sanctuary design system (Green/White, clean aesthetic).
- The feature is fully responsive (Mobile, Tablet, Desktop).
- `prefers-reduced-motion` is respected for any animations.

### 4. Testing
- The feature compiles without TypeScript errors.
- Unit tests pass.

### 5. Documentation
- If the implementation required deviating from this `/docs` architecture, the corresponding `.md` file MUST be updated to reflect the new reality.
