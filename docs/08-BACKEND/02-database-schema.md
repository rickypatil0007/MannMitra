# Database Schema

## 1. Purpose
Defines the overarching organizational structure of the PostgreSQL database powering MannMitra.

## 2. Scope
Explains schemas, namespaces, and the logical grouping of tables. (Specific tables and columns are detailed in `02-tables.md`).

## 3. Schema Architecture

MannMitra uses multiple PostgreSQL schemas to separate concerns and restrict access:

### `public`
- **Purpose**: The primary schema containing all application business logic.
- **Access**: Accessible via PostgREST (Supabase API) but heavily restricted by Row Level Security (RLS).
- **Key Domains**: Users, Planner, Chat, Community, Counselling.

### `auth`
- **Purpose**: Managed entirely by Supabase GoTrue. Contains identity, passwords, and sessions.
- **Access**: NOT accessible via the public API. The `public.users` table holds a foreign key to `auth.users`.

### `storage`
- **Purpose**: Managed by Supabase Storage. Maps logical files (Voice Notes, Avatars) to physical S3-compatible storage.

### `analytics`
- **Purpose**: A private schema used for materialized views and institutional dashboards.
- **Access**: Accessible only by the backend server via a service role key. Completely hidden from the client API to prevent students from querying aggregate campus data.

## 4. Design Conventions
- **Naming**: `snake_case` for all schemas, tables, and columns.
- **Primary Keys**: UUID v4 universally used for all primary keys to prevent enumeration attacks.
- **Timestamps**: All tables must include `created_at` (default `now()`) and `updated_at`.
- **Soft Deletes**: Sensitive records (like Community Posts) use an `is_deleted` boolean rather than hard deletion to maintain audit trails for moderation purposes.

## 5. Security / Privacy
- Direct querying of the database using the generic `anon` key is forbidden for sensitive tables. All sensitive data must be accessed via authenticated sessions where `auth.uid()` is evaluated.

## 6. Migration Strategy
- Managed via Supabase CLI (`supabase migration up`). 
- Migrations must be immutable once merged to the main branch.

## 7. Related Documentation
- See `11-DATABASE/02-tables.md` for table structures.
