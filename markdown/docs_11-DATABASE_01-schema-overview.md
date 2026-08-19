# Schema Overview

## 1. Purpose
Provides a high-level summary of the PostgreSQL schema architecture powering MannMitra, ensuring all developers understand the boundaries between public data, authentication, and analytics.

## 2. Scope
Covers the logical division of the database into distinct schemas.

## 3. Schemas

### 3.1 `public`
- **Description**: The primary workspace. Contains all application-specific tables (Profiles, Tasks, Community, Chat).
- **Access**: Exposed via the PostgREST API. Protected entirely by Row Level Security (RLS).

### 3.2 `auth`
- **Description**: Managed by Supabase GoTrue. Contains users, identities, and sessions.
- **Access**: Completely isolated from the client API. The backend can read it securely, and triggers can watch it, but the frontend cannot query it.

### 3.3 `analytics`
- **Description**: Contains materialized views and aggregated rollup tables used by the Institution Dashboard.
- **Access**: Hidden from the PostgREST API. Queries against this schema must be executed by a secure backend Server Action using the Service Role key.

### 3.4 `storage`
- **Description**: Managed by Supabase Storage. Maps object metadata for avatars and voice notes.
- **Access**: Exposed via API, protected by RLS linking back to `public` schema tables.

## 4. Design Rules
- All tables must reside in `public` unless they contain data that absolutely must not be exposed to the REST API under any circumstances.
- Extensions (like `pgvector` or `postgis`) should be installed in the `extensions` schema to keep the `public` schema clean.

## 5. Security / Privacy
- The separation of the `analytics` schema guarantees that a flaw in an RLS policy on the `public` schema cannot accidentally expose macro-level campus data to a student.

## 6. Related Documents
- See `11-DATABASE/02-tables.md` for detailed entity definitions.
