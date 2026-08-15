# Access Control & IAM

## 1. Purpose
To define the mechanisms governing exactly who can access the MannMitra administrative and infrastructure systems, preventing internal threats.

## 2. Scope
Applies to cloud infrastructure (Vercel, Supabase), third-party services (OpenAI, Twilio), and the internal admin dashboard.

## 3. Infrastructure Access (Engineers)
- **Principle of Least Privilege**: Developers are given access only to the environments they need.
- **Production Access**: Strictly limited to Lead Engineers and DevOps. Access to the production Supabase dashboard requires Single Sign-On (SSO) and mandatory Multi-Factor Authentication (MFA).
- **Staging/Dev Access**: Open to the engineering team for active development, but strictly utilizing mocked/seeded data. *No production data is ever pulled to staging.*

## 4. Application Admin Access (Staff)
- The MannMitra Admin Portal (used for verifying counsellors and managing institutional settings) is protected by:
  - Role verification (`admin` claim in JWT).
  - An IP Whitelist (if required by the institution, e.g., admins can only log in from the campus network).

## 5. Third-Party Service IAM
- **OpenAI**: Uses Project-scoped API keys with hard usage limits to prevent billing exhaustion if a key is accidentally exposed.
- **Twilio**: Uses restricted API keys that are only permitted to send SMS, not modify account configurations.

## 6. Service Accounts
- Any backend scripts (e.g., the Nightly Analytics Cron) use a dedicated `SERVICE_ROLE` key.
- This key bypasses RLS, making it extremely dangerous. It must NEVER be exposed to the client or used in standard Next.js API routes handling user requests.

## 7. Testing
- Conduct an annual access review to ensure former employees or transferred staff have their infrastructure and admin access revoked immediately.
