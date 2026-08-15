# Security Architecture

## 1. Purpose
Provides the overarching blueprint for how MannMitra protects the system, data, and users from malicious actors, unauthorized access, and accidental breaches.

## 2. Scope
Covers defense-in-depth strategies, infrastructure security, application security, and AI-specific security measures.

## 3. Defense in Depth Strategy

### 3.1 Edge / Network Layer
- **WAF**: Vercel Web Application Firewall blocks known malicious IPs, DDoS attacks, and SQL injection payloads before they hit the API.
- **TLS**: All traffic is encrypted in transit using TLS 1.3. Unencrypted HTTP is strictly redirected.

### 3.2 Application Layer
- **Input Validation**: All data entering the Next.js API or Server Actions is strictly parsed and validated using Zod.
- **Authentication**: Stateless, cryptographically signed JWTs managed by Supabase GoTrue.
- **CSRF & XSS**: Mitigated natively via React's escaping and secure, HttpOnly, SameSite cookies.

### 3.3 Database Layer
- **RLS**: Row Level Security acts as the ultimate gatekeeper, evaluating the JWT on every single row accessed.
- **Network Isolation**: The PostgreSQL database does not accept direct connections from the internet; it only accepts connections via the authenticated API layer and Supabase connection pooler.

### 3.4 AI Layer
- **Prompt Injection Defense**: User inputs are sanitized and wrapped in strict system prompts. The AI is sandboxed and does not have direct read/write access to the database; it merely returns structured JSON which the backend validates before saving.

## 4. Key Security Policies

### API Keys
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `OPENAI_API_KEY` to the client. They must exist exclusively in the Vercel edge environment variables.

### Dependencies
- Automated scanning (e.g., Dependabot or Snyk) runs weekly to detect and patch vulnerable npm packages.

## 5. Incident Response
- In the event of a suspected breach, the system supports a "Panic Button" script that immediately revokes all active JWTs and rotates the database connection strings, forcing all users to re-authenticate.

## 6. Testing
- Penetration testing (both automated and manual) must be conducted before any major production release, focusing heavily on attempting to bypass RLS policies.
