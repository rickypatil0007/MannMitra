# Encryption Strategy

## 1. Purpose
To ensure that all data within MannMitra is protected cryptographically, mitigating risks of data interception or physical storage compromise.

## 2. Scope
Covers encryption in transit (network), at rest (storage/database), and optional application-level encryption for highly sensitive fields.

## 3. In Transit
- **Protocol**: TLS 1.2 or 1.3 is enforced globally across all endpoints (Vercel Edge, Supabase API).
- **HSTS**: HTTP Strict Transport Security is enabled to prevent protocol downgrade attacks.
- **WebSockets**: WSS (WebSocket Secure) is used for all real-time chat and notification streams.

## 4. At Rest
- **Database**: The Supabase PostgreSQL database instances are encrypted at rest using AES-256 (standard cloud provider encryption via AWS KMS).
- **Storage**: Audio files (Voice Notes) and images in Supabase Storage are also encrypted at rest using AES-256.

## 5. Application-Level Encryption (ALE) (Future / High Security)
For extreme privacy guarantees (e.g., protecting student journals even from a rogue DBA):
- **Concept**: A column like `diary_entries.content` is encrypted at the application layer *before* being sent to the database.
- **Implementation**: Utilize `pgcrypto` or a dedicated Node.js encryption library with a Key Management Service (KMS). The decryption key is derived partially from the user's password, meaning the server cannot read the data without the user being actively logged in.
- *(Note: ALE breaks native database full-text search, so it should only be used where search functionality is not required).*

## 6. Secret Management
- API Keys (OpenAI, Resend, Twilio) are never stored in code.
- They are injected as Environment Variables at runtime.
- Developers use a `.env.local` file that is strictly `.gitignore`d.

## 7. Testing
- Use a network interception proxy (like OWASP ZAP or Burp Suite) against a staging environment to confirm that no sensitive JWTs or payload data are transmitted over plain HTTP.
