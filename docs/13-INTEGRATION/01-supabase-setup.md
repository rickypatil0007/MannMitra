# Supabase Setup

## 1. Purpose
Provides the step-by-step instructions for initializing, configuring, and connecting the Supabase backend to the MannMitra Next.js application.

## 2. Scope
Covers local development CLI setup, project linking, environment variables, and initial schema seeding.

## 3. Prerequisites
- Node.js (v18+)
- Docker (required for local Supabase development)
- Supabase CLI installed globally (`npm install -g supabase`)

## 4. Local Development Setup

1. **Initialize Supabase**:
   Navigate to the project root and run:
   ```bash
   supabase init
   ```
   This creates the `supabase/` directory containing configuration.

2. **Start Local Database**:
   ```bash
   supabase start
   ```
   This will download the necessary Docker images and spin up a complete local Supabase stack (PostgreSQL, GoTrue, Storage, Studio). It will output the local API URLs and anon keys.

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and populate the Supabase credentials provided in step 2:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1..."
   SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1..."
   ```

4. **Apply Migrations and Seed Data**:
   The `supabase/migrations` folder contains the schema definitions.
   ```bash
   supabase db reset
   ```
   This command drops the local database, recreates it from the migrations, and inserts dummy data defined in `supabase/seed.sql` (e.g., test student and counsellor accounts).

## 5. Production Linking

When ready to deploy:
1. Create a project in the Supabase Cloud dashboard.
2. Link the local project to the remote project:
   ```bash
   supabase link --project-ref [YOUR_PROJECT_REF]
   ```
3. Push the migrations to production:
   ```bash
   supabase db push
   ```

## 6. Type Generation
To maintain end-to-end type safety, generate TypeScript definitions from the database schema:
```bash
supabase gen types typescript --local > src/types/supabase.ts
```
*(Run this command locally every time you create a new migration).*
