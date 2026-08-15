# Vercel Deployment

## 1. Purpose
Defines the standard operating procedure for deploying the MannMitra Next.js application to Vercel, the primary compute and hosting provider.

## 2. Scope
Covers project connection, environment variable configuration, and deployment protection.

## 3. Initial Setup

1. **Connect GitHub**:
   - Log into Vercel and click "Add New Project".
   - Import the `MannMitra` repository from GitHub.
   - The framework preset should automatically detect `Next.js`.

2. **Configure Environment Variables**:
   Before hitting "Deploy", populate the environment variables. **Do not skip this step, or the build will likely fail during static generation.**
   - `NEXT_PUBLIC_SUPABASE_URL` (Production Supabase URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Production Anon Key)
   - `OPENAI_API_KEY`
   *(Do NOT include `SUPABASE_SERVICE_ROLE_KEY` if it is not strictly required by a specific background job, to minimize risk).*

3. **Deploy**:
   - Click Deploy. Vercel will run `npm run build` and provision the Edge network.

## 4. Deployment Environments

Vercel automatically provisions three types of environments:
- **Production**: Mapped to the `main` branch and the primary domain (e.g., `mannmitra.edu`).
- **Preview**: Automatically generated for every Pull Request. Useful for UI/UX review before merging.
- **Development**: Localhost.

## 5. Vercel Protection & Security

- **Vercel Authentication**: Enable "Vercel Authentication" for Preview deployments. This ensures that only logged-in members of the Vercel team can view staging deployments, preventing public leakage of unreleased features.
- **Web Application Firewall (WAF)**: If on an Enterprise plan, enable the WAF to block malicious traffic at the edge before it hits the Next.js serverless functions.

## 6. CI/CD Checks
Ensure that Vercel is configured to run `npm run lint` and `npm test` (if unit tests are configured) as part of the Build Command. If tests fail, the deployment must fail.
