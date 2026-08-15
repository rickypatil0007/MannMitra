# Database Migrations

## 1. Purpose
Defines the workflow for altering the database schema, ensuring all environments (local, staging, production) remain perfectly synchronized without data loss.

## 2. Scope
Covers the Supabase CLI workflow, local development, and CI/CD deployment.

## 3. Workflow

### 3.1 Local Development
1. Start the local database: `supabase start`
2. Make changes to the local schema (e.g., via Supabase Studio or SQL).
3. Generate a migration file: `supabase db diff -f add_new_feature`
4. Review the generated SQL in `supabase/migrations/[timestamp]_add_new_feature.sql`.

### 3.2 Committing
- The `.sql` migration file is committed to Git.
- **Rule**: Once a migration is pushed to `main` and deployed to staging/production, it is IMMUTABLE. Never edit an old migration file. If a mistake was made, create a new migration to fix it.

## 4. Best Practices
- **Idempotency**: Use `IF NOT EXISTS` for tables and columns where possible to prevent migration crashes.
- **Data Preservation**: When altering a column type, always provide a `USING` clause to cast existing data rather than dropping and recreating the column.

## 5. Security / Privacy
- Migrations that drop tables containing sensitive data (e.g., `personal_notes`) must be reviewed by the Lead Engineer to ensure they do not violate data retention or audit policies.

## 6. CI/CD Integration
- GitHub Actions is configured to automatically run `supabase db push` against the Staging database when a PR is merged into `main`.
- Production migrations require manual approval in the deployment pipeline.

## 7. Testing
- Local CI runs `supabase db reset` on every PR to ensure all migrations execute cleanly from scratch without dependency errors.
