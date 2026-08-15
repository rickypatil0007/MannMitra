# Privacy Architecture

## 1. Purpose
To define the fundamental design principles and technical implementations that ensure student mental wellness data remains confidential, consented, and ethically managed.

## 2. Scope
Distinguishes Privacy (protecting the user from unauthorized internal access) from Security (protecting the system from external attackers).

## 3. Core Privacy Principles

### 3.1 Privacy by Design
Privacy is not an afterthought; it is built into the data model. For example, the `Faculty Dashboard` cannot physically query individual student names because the analytics database schema doesn't contain them.

### 3.2 Minimal Data Collection
MannMitra only asks for what is necessary. We do not track GPS location for the "Quiet Spaces" feature; we merely provide a map for the user to navigate themselves.

### 3.3 Explicit Consent
Institutional sharing of individual data (e.g., to a counsellor) operates on an explicit, granular opt-in model.

## 4. The Anonymity Boundary

A critical feature of MannMitra is the Community section.
- **Implementation**: The backend generates a random `display_identity` (e.g., "Calm Tiger") for a user.
- **Boundary**: When fetching community posts, the API strips the actual `user_id` and only returns the `display_identity`. Even if the frontend client was modified to log all network traffic, the real identity is never sent over the wire for anonymous posts.

## 5. Internal Access Controls (Institution vs. Platform Admin)
- **Institution Faculty**: See only k-anonymized aggregate data.
- **Platform Developers/DBAs**: Access to production databases is restricted to core engineering leads. Access requires VPN, MFA, and is heavily audited. Production databases should not be copied to local machines; developers must use seeded dummy data.

## 6. Regulatory Compliance Readiness
The architecture is designed to support compliance with frameworks like GDPR, HIPAA (if deployed in US clinical settings, though it is not a clinical app by default), and local educational privacy laws (e.g., FERPA in the US).

## 7. Testing
- Verify that a database dump generated for the analytics team contains exactly zero email addresses or user names.
