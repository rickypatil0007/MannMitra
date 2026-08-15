# API Integration

## 1. Purpose
Details the technical patterns and libraries used by the MannMitra frontend to communicate securely and efficiently with the backend services.

## 2. Scope
Covers REST clients, Supabase SDK usage, error boundary handling, and typed data contracts.

## 3. The Supabase SDK
For the majority of CRUD operations (fetching tasks, posting to the community, reading stress logs), the application uses the official `@supabase/supabase-js` client.

### 3.1 Client vs Server Usage
- **Browser/Client Components**: Use `createBrowserClient` which automatically handles the session cookie in the browser environment.
- **Server Components/Actions**: Use `createServerClient` ensuring the cookies are passed correctly from the incoming request headers to maintain secure RLS.

## 4. Typed Contracts (TypeScript)
To prevent runtime errors, the API layer must be strictly typed.
- Generate Supabase types using the CLI: `supabase gen types typescript --local > src/types/supabase.ts`.
- All data-fetching functions must return these typed entities (e.g., `Promise<Database['public']['Tables']['tasks']['Row'][]>`).

## 5. Server Actions (Next.js)
For complex operations that require hiding secrets (like generating an AI response or sending an email), use Next.js Server Actions.

```typescript
// src/actions/planner.ts
"use server"

export async function createExtractedTask(data: z.infer<typeof taskSchema>) {
  // 1. Validate auth
  // 2. Validate input
  // 3. Mutate DB
  // 4. revalidatePath('/planner')
}
```

## 6. Error Handling
- Wrap API calls in `try/catch` blocks.
- On failure, catch the error and display a user-friendly toast notification using `sonner` or `react-hot-toast`.
- Do not expose raw database error codes (like `23505` unique violation) to the user. Translate them: "A task with this exact name already exists."

## 7. Testing
- Use Mock Service Worker (MSW) to intercept API calls during frontend unit testing, preventing tests from hitting the actual Supabase database and ensuring predictable responses.
