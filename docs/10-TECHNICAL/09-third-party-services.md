# Third-Party Services

## 1. Purpose
To inventory and define the integration parameters for external SaaS tools that MannMitra relies upon to function, ensuring a clear understanding of external dependencies.

## 2. Scope
Lists all production dependencies outside of the core Vercel (compute) and Supabase (database) infrastructure.

## 3. Services Inventory

### 3.1 Vercel AI SDK / OpenAI
- **Purpose**: Powers the Mitra chat and AI orchestration.
- **Integration**: Server-side API calls.
- **Security**: API key stored in Vercel Edge config. Zero data retention policy mandated.

### 3.2 Resend / SendGrid (Email)
- **Purpose**: Delivers authentication magic links, password resets, and appointment reminders.
- **Integration**: REST API via background worker.
- **Security**: Must verify domain DKIM/SPF to ensure deliverability.

### 3.3 Twilio (SMS & Voice)
- **Purpose**: Delivers critical SOS alerts and Trusted Contact verifications.
- **Integration**: REST API triggered via secure Server Actions or webhooks.
- **Security**: Webhook signatures must be validated to ensure requests are actually coming from Twilio.

### 3.4 Sentry (APM / Error Tracking)
- **Purpose**: Captures unhandled frontend and backend exceptions.
- **Integration**: Next.js SDK injection.
- **Security**: MUST configure data scrubbing to prevent PII (emails, names) or sensitive data (diary entries, chat logs) from being logged.

## 4. Resilience and Fallbacks
- If a non-critical service (e.g., Email) goes down, the application must queue the action and retry later.
- If a critical service (e.g., OpenAI) goes down, the Mitra UI must fail gracefully: "Mitra is currently resting. Please try again later. If you need immediate help, tap SOS."

## 5. Development vs Production
- The `.env.local` file used by developers should point to test/sandbox keys for services like Twilio and Resend to prevent accidental spam or billing charges during local development.

## 6. Testing
- Verify that a mocked 500 error from the OpenAI API correctly triggers the graceful failure UI state rather than crashing the Next.js application.
