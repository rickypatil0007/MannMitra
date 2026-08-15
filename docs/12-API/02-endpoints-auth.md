# Auth Endpoints

## 1. Purpose
Details the endpoints used for managing user identity and session lifecycles.

## 2. Scope
Most of these map directly to the Supabase GoTrue API, but are often wrapped in Next.js Server Actions for seamless cookie management.

## 3. Endpoints

### 3.1 Sign Up
- **Method**: `POST`
- **Path**: `/auth/v1/signup` (Supabase)
- **Payload**: `{ "email": "student@uni.edu", "password": "..." }`
- **Behavior**: Creates the user in `auth.users` and sends a magic link/OTP.

### 3.2 Sign In with Password
- **Method**: `POST`
- **Path**: `/auth/v1/token?grant_type=password`
- **Payload**: `{ "email": "...", "password": "..." }`
- **Response**: Returns a Session object containing the `access_token` and `refresh_token`.

### 3.3 Auth Callback (Next.js)
- **Method**: `GET`
- **Path**: `/api/v1/auth/callback`
- **Query Params**: `?code=xxxxxx`
- **Behavior**: When a user clicks an email verification link, this Next.js route intercepts the code, exchanges it for a session securely on the server, sets the `sb-xxx-auth-token` HTTP-only cookie, and redirects the user to `/dashboard`.

### 3.4 Sign Out (Next.js)
- **Method**: `POST`
- **Path**: `/api/v1/auth/signout`
- **Behavior**: Calls `supabase.auth.signOut()`, destroying the session on the server and clearing the client-side cookies.

## 4. Security / Privacy
- Passwords must NEVER be logged anywhere.
- If the application is configured for a specific institution, the Sign Up Server Action should intercept the request and assert that the email ends with `@institution.edu` before passing it to Supabase.

## 5. Testing
- Verify that accessing a protected Next.js page without a valid session cookie automatically redirects to `/login`.
