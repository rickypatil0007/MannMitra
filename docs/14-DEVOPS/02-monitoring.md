# MANNMITRA — MONITORING & OBSERVABILITY

Document: `14-DEVOPS/02-monitoring.md`
Status: Production Specification
Version: 1.0
Audience: DevOps, Backend Engineers
Platform: System Architecture

---

# 1. PURPOSE

To ensure the engineering team is instantly aware of critical failures (like the SOS system going down) before a student reports it.

---

# 2. APPLICATION PERFORMANCE MONITORING (APM)

- **Tool:** Sentry (or DataDog).
- **Scope:** Captures unhandled exceptions in the React frontend and 500 errors in the API routes.
- **Privacy Rule:** Sentry MUST be configured to scrub PII (Email addresses, Names, and Chat contents) from error payloads before transmission.

---

# 3. CRITICAL ALERTS

The following events MUST trigger immediate alerts (e.g., to a PagerDuty or Slack channel):

- **SOS Failure:** Any 500 error occurring on the `/api/v1/support/sos-triggered` endpoint.
- **AI Outage:** The LLM provider (OpenAI) returning 500s or timeouts consistently for >2 minutes.
- **Database Connection Failure:** Supabase connection pooling exhaustion.

---

# 4. PRODUCT ANALYTICS

- **Tool:** PostHog (Self-hosted or Cloud with strict privacy configs).
- **Scope:** Track feature usage (e.g., `dashboard_viewed`, `planner_task_created`).
- **Privacy Rule:** Analytics payloads MUST NEVER contain the content of user inputs (e.g., the text of a reflection or the title of a task). They only track the *action*.
