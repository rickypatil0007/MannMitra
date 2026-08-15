# Background Jobs

## 1. Purpose
To execute heavy, time-consuming, or scheduled tasks asynchronously, ensuring the main user-facing APIs remain fast and responsive.

## 2. Scope
Covers cron jobs, asynchronous queues, and AI batch processing within the MannMitra backend.

## 3. Core Jobs

### 3.1 Nightly Analytics Rollup (Cron)
- **Schedule**: Every day at 02:00 AM.
- **Function**: Aggregates the day's stress logs, task completions, and anonymized interaction metrics into the `analytics` schema to power the Institution Dashboard (Feature 18).

### 3.2 Stress Forecast Engine (Cron)
- **Schedule**: Every day at 04:00 AM (after the analytics rollup).
- **Function**: Analyzes upcoming calendar events (Feature 06) and historical stress patterns to predict potential high-stress windows for the upcoming 7 days, writing predictions to the `stress_forecasts` table.

### 3.3 Notification Dispatcher (Queue)
- **Schedule**: Continuous polling / Event-driven.
- **Function**: Processes the `notification_queue` table and dispatches emails/push notifications via external providers.

### 3.4 Inactive Account Anonymization (Cron)
- **Schedule**: Monthly.
- **Function**: Identifies accounts marked for deletion past their 30-day grace period and permanently hard-deletes personal identifiers, complying with privacy retention policies.

## 4. Technical Implementation
- **Supabase pg_cron**: Used for simple, database-centric scheduled tasks (e.g., executing a stored procedure for analytics rollups).
- **Vercel Cron Jobs**: Used for tasks requiring external API compute (e.g., hitting the AI gateway to generate forecasts).
- **Supabase Edge Functions / Webhooks**: Triggered asynchronously on database inserts (e.g., processing a newly uploaded voice note).

## 5. Requirements
- Background jobs must be idempotent; if a job fails halfway and restarts, it must not duplicate data (e.g., sending two identical reminder emails).
- Jobs must log their execution status (`SUCCESS`, `FAILED`, `DURATION`) to a `job_logs` table for observability.

## 6. Error Handling
- Failed jobs (e.g., the Twilio API is down) must implement exponential backoff and retry up to 5 times before alerting the engineering team via an APM (e.g., Sentry).

## 7. Testing
- Mock the current time and execute the `Stress Forecast Engine` manually in a staging environment to ensure it correctly identifies a simulated upcoming exam.
