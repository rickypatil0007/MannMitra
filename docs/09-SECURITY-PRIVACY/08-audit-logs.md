# System Audit Logs

## 1. Purpose
To maintain a forensic trail of infrastructure and administrative changes, ensuring that any malicious internal action or misconfiguration can be traced and remediated. (Note: This is distinct from the application-level logging defined in `08-BACKEND/11-audit-logging.md`).

## 2. Scope
Covers database query logging, server request logging, and infrastructure mutation logs.

## 3. Infrastructure Logs
- **Vercel Edge Logs**: Captures every HTTP request, response time, status code, and error trace. Kept for 1-7 days depending on the plan. Used primarily for immediate debugging.
- **Supabase Postgres Logs (`pg_stat_statements`)**: Captures slow queries and database errors. Can be used to identify potential DoS attacks targeting expensive SQL queries.
- **Auth Logs**: Supabase GoTrue retains a log of all authentication attempts, which is critical for identifying brute-force credential stuffing attacks.

## 4. Administrative Action Logs
If a developer changes an environment variable in Vercel, or modifies a table schema in Supabase, the respective cloud provider logs the action against the developer's IAM identity.

## 5. Log Aggregation (SIEM)
For a production deployment at scale, logs from Vercel and Supabase should be exported via Log Drains to a centralized SIEM (Security Information and Event Management) system like Datadog, Splunk, or AWS CloudWatch.

## 6. Security / Privacy
- **Scrubbing**: The log drain must be configured to automatically scrub/redact sensitive patterns (like Authorization headers, passwords, or credit cards) before writing to the SIEM.

## 7. Testing
- Trigger a simulated 500 Server Error in the application, then navigate to the SIEM/Vercel dashboard and verify that the error trace is visible but any PII contained in the request body is redacted.
