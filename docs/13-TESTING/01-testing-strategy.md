# MANNMITRA — TESTING STRATEGY

Document: `13-TESTING/01-testing-strategy.md`
Status: Production Specification
Version: 1.0
Audience: QA Engineers, Fullstack Engineers
Platform: System Architecture

---

# 1. PURPOSE

To ensure the MannMitra platform is highly reliable. In a mental wellness context, a broken button or a crashed chat interface can actively induce stress and break trust.

---

# 2. TESTING TIERS

### 1. Unit Testing (Vitest / Jest)
- **Focus:** Backend utility functions, rate limiting logic, data formatting, complex React hooks.
- **Goal:** Fast, reliable feedback on core logic.

### 2. Integration Testing
- **Focus:** API Endpoints interacting with a test database.
- **Goal:** Ensuring Database RLS policies are working correctly (e.g., testing that User A cannot fetch User B's tasks).

### 3. End-to-End (E2E) Testing (Playwright / Cypress)
- **Focus:** Critical user flows (Login, Creating a Task, Sending an SOS, Submitting a Community Post).
- **Goal:** Ensuring the UI is functional from the user's perspective.

### 4. AI & Prompt Testing
- **Focus:** Evaluating LLM responses against safety and quality baselines.
- **Goal:** Preventing regressions when system prompts are updated.

---

# 3. CONTINUOUS INTEGRATION (CI)

- All Unit and Integration tests MUST run on every Pull Request via GitHub Actions.
- E2E tests MUST run on staging before a production deployment.
