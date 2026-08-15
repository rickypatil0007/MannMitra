# Authentication

## 1. Purpose
To manage secure identity verification for students, faculty, and counsellors accessing MannMitra.

## 2. Scope
Covers Registration, Login, Session Management, Password Recovery, and Role Assignment utilizing Supabase Auth (GoTrue).

## 3. Actors
- **Unauthenticated User**: Can only access the Landing Page or strictly limited "Guest Mode" features.
- **Authenticated Student**: Has access to personal dashboard and features.
- **Authenticated Counsellor/Faculty**: Has access to institutional dashboards based on role claims.

## 4. Requirements
- Registration must require email verification (magic link or OTP) to ensure students are using valid institutional emails (if locked to a campus).
- Sessions must use secure, HTTP-only cookies to prevent XSS attacks from stealing JWTs.
- Password requirements must enforce minimum complexity (8+ chars, numbers, symbols).

## 5. User Flow
1. **Sign Up**: User enters email/password.
2. **Verification**: Supabase sends a confirmation email.
3. **Callback**: User clicks link, hits the `/auth/callback` route, which exchanges the auth code for a session cookie.
4. **Onboarding Guard**: If `profile.is_onboarded` is false, the user is redirected to `/onboarding`.

## 6. UI / UX Behavior
- Authentication forms must be clean, centered, and minimal, reflecting the White/Green calm aesthetic.
- Avoid aggressive "INVALID PASSWORD" text in red; use soft, helpful prompts ("Please check your password").

## 7. Functional Behavior
- **Guest Mode**: If the user selects "Continue as Guest", the backend provisions an anonymous session via Supabase `signInAnonymously()`. This allows temporary database access, which can later be linked to an email if the user decides to create a permanent account.

## 8. Data Requirements
- Supabase manages `auth.users`.
- A trigger automatically creates a corresponding row in `public.profiles` upon account creation.

## 9. Security / Privacy
- Token expiration is set to 1 hour, with a 30-day refresh token window.
- If a user changes their password, all other active sessions across devices must be revoked.

## 10. Edge Cases
- **Stale Callbacks**: If an email verification link expires, the UI must provide a clear "Resend Verification Email" button rather than a generic 400 error.
