# MANNMITRA — DEPLOYMENT STRATEGY

Document: `14-DEVOPS/01-deployment-strategy.md`
Status: Production Specification
Version: 1.0
Audience: DevOps Engineers, Fullstack Engineers
Platform: System Architecture

---

# 1. PURPOSE

To define how code moves from a developer's machine to the production environment safely, ensuring zero downtime.

---

# 2. ENVIRONMENTS

1. **Development:** Localhost. Uses local or staging database.
2. **Preview (Vercel):** Automatically generated on every Pull Request. Connected to a staging database. Used for QA and design review.
3. **Production:** The live environment. Connected to the production database.

---

# 3. CONTINUOUS DEPLOYMENT (CI/CD)

- **Platform:** Vercel (Frontend/API) + GitHub Actions (Testing/Linting).
- **Workflow:**
  1. Developer opens a PR.
  2. GitHub Actions runs Unit/Integration tests and Linters.
  3. Vercel builds a Preview URL.
  4. QA approves.
  5. PR is merged to `main`.
  6. Vercel automatically deploys to Production.

---

# 4. DATABASE MIGRATIONS

- Database schema changes MUST be tracked in version control (e.g., Prisma Migrations or Supabase CLI migrations).
- Migrations MUST be applied to the Staging database and tested before being applied to Production.
- Direct schema modifications in the Production database UI are strictly forbidden.
