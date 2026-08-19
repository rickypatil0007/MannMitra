# Data Classification

## 1. Purpose
To categorize the data processed by MannMitra so that appropriate security controls, retention policies, and encryption standards can be applied proportionally to the risk level.

## 2. Scope
Applies to all data at rest and in transit within the database, storage buckets, and API payloads.

## 3. Classification Levels

### Level 1: Public (Low Risk)
Data intended for general consumption without authentication.
- **Examples**: Marketing copy, general wellness articles, public university resource links, completely anonymized macro-level campus stats.
- **Controls**: TLS in transit. No specific encryption at rest required beyond standard cloud provider defaults.

### Level 2: Internal / Pseudonymous (Moderate Risk)
Data accessible only by authenticated users, but not directly tied to a sensitive identity in the UI.
- **Examples**: Anonymous community posts, aggregated cohort stress trends, user application settings (e.g., dark mode).
- **Controls**: Role-based access control (RLS). Standard database encryption at rest.

### Level 3: Confidential / PII (High Risk)
Personally Identifiable Information that identifies a specific student.
- **Examples**: Names, Email addresses, Academic IDs, Enrolled Courses, Trusted Contact phone numbers.
- **Controls**: Strict RLS. Audit logging for administrative access. Data masked in non-production environments.

### Level 4: Highly Sensitive / Health (Critical Risk)
Data detailing a specific user's psychological state or private thoughts.
- **Examples**: Private diaries, voice notes, raw Mitra AI chat transcripts, exact stress/mood logs, counsellor session notes.
- **Controls**: Strict RLS. Application-level encryption (optional/future) for diary entries. Extremely short retention periods for raw AI transcripts. Immutable audit logging for ANY access.

## 4. Handling Requirements
- Level 4 data must never be logged into application performance monitoring tools (e.g., Sentry) or standard console logs.
- Level 4 data must never be used to train external LLMs. API calls to OpenAI/Anthropic must explicitly opt-out of data retention/training policies.

## 5. Testing
- Run automated secret/PII scanners against application logs to ensure Level 3 or 4 data is not leaking into observability platforms.
