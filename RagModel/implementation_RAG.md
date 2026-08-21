# MannMitra — Phased Production Implementation Prompt

You are working on the existing **MannMitra** application.

The project already contains:

* the complete MannMitra specification in multiple `.md` files
* existing frontend and backend implementation
* existing authentication
* existing PostgreSQL/Supabase infrastructure
* existing Mitra AI chatbot
* existing planner/task system
* existing mood/stress system
* existing reflection/notes system
* existing analytics/insights system
* existing counselor functionality where applicable
* a knowledge base containing context PDFs
* an exact, predefined algorithm for calculating the user's risk score
* an existing Gemini API key already configured in the server environment

Your task is to implement the **complete Gemini + RAG + multi-signal context + risk engine + counselor alert architecture in phases**.

Do not rebuild MannMitra from scratch.

Do not redesign unrelated UI.

Do not replace existing functionality unnecessarily.

Do not invent a new risk-score algorithm.

Do not create another Gemini API key.

---

# GLOBAL RULES FOR EVERY PHASE

## Rule 1 — READ THE EXISTING `.md` DOCUMENTATION FIRST

Before writing code, inspect the project and read all relevant `.md` files.

Build an internal understanding of:

```text
project architecture
database architecture
authentication
Mitra AI
planner
mood
stress
reflection
analytics
risk scoring
counselor workflows
design system
API routes
environment variables
deployment
existing RAG documentation
```

Do NOT assume the filenames.

Search the complete repository for:

```text
*.md
```

Read all documentation relevant to the features being implemented.

Do not blindly follow an outdated document if the existing code contradicts it.

When `.md` documentation and existing production code conflict:

1. inspect both
2. identify the difference
3. preserve working functionality
4. use the safest compatible architecture
5. document the deviation

---

# Rule 2 — READ THE EXISTING KNOWLEDGE BASE

Locate all existing PDF knowledge-base files.

Do not assume a specific folder.

Search for:

```text
*.pdf
```

Create an inventory containing internally:

```text
filename
title
category
language
source
size
status
```

Do not expose private file contents unnecessarily.

Treat the PDFs as **knowledge sources**, not as user memories.

---

# Rule 3 — READ THE EXISTING RISK-SCORE ALGORITHM

Locate the existing risk-score algorithm in the `.md` documentation or source code.

Search for:

```text
risk score
risk_score
risk level
risk engine
severity
threshold
counselor alert
high risk
```

The existing algorithm is authoritative.

### CRITICAL:

Do NOT invent:

* new weights
* new thresholds
* new scoring equations
* new risk categories
* new normalization rules

unless the documentation explicitly requires them.

Your implementation must reproduce the provided algorithm exactly.

If the algorithm is specified mathematically, implement the same mathematical logic in typed backend code.

If it is specified through a decision tree, implement that decision tree exactly.

If it uses weights, preserve those weights exactly.

If it uses thresholds, preserve those thresholds exactly.

---

# Rule 4 — REUSE THE EXISTING GEMINI API KEY

The project already has the Gemini API key.

Reuse the existing server-side variable.

Do not:

```text
create a key
request another key
rotate the key
hard-code the key
log the key
send the key to frontend
create NEXT_PUBLIC_GEMINI_API_KEY
```

The same existing Gemini API key must be used for:

```text
gemini-embedding-001
+
Gemini Mitra generation model
```

Embedding and generation must remain separate server-side services.

---

# Rule 5 — DO NOT BREAK THE EXISTING FRONTEND

The current MannMitra frontend is already implemented.

Do not redesign:

```text
landing page
dashboard
Mitra UI
planner UI
mood UI
reflection UI
analytics UI
counselor UI
navigation
colors
animations
components
```

unless a phase explicitly requires a minimal UI addition.

Prefer backend integration over frontend rewrites.

---

# Rule 6 — DO NOT USE RAG AS THE RISK ENGINE

Keep these systems separate:

```text
RAG
→ semantic retrieval

Structured analytics
→ numerical trends/statistics

Risk engine
→ exact predefined risk algorithm

Gemini
→ conversational generation / controlled text extraction

Counselor alert engine
→ threshold/transition based notifications
```

Never allow RAG similarity alone to determine the risk score.

---

# Rule 7 — USER DATA ISOLATION

All private user information must remain user-scoped.

Never allow:

```text
User A → retrieve User B's private context
```

Always derive the authenticated user ID server-side.

Never trust an arbitrary client-provided `user_id`.

Global knowledge PDFs may be shared according to their intended visibility.

Private user memory must remain private.

---

# Rule 8 — PRODUCTION SAFETY

Do not:

```text
reset database
drop production tables
delete existing user data
rewrite authentication
disable RLS
remove existing features
```

Use additive migrations whenever possible.

---

# IMPLEMENTATION PHASES

Implement **one phase at a time**.

After completing each phase:

1. run the appropriate checks
2. verify the implementation
3. inspect for regressions
4. document what was implemented
5. only then proceed to the next phase

Do not implement later phases prematurely if an earlier foundation is incomplete.

---

# PHASE 0 — DISCOVERY AND ARCHITECTURE AUDIT

## Objective

Understand the existing MannMitra architecture before modifying it.

### Inspect

```text
Next.js version
TypeScript
package manager
Supabase
PostgreSQL
authentication
RLS
Mitra AI
DeepSeek implementation
Gemini implementation
planner
tasks
mood
stress
reflection
notes
analytics
risk scoring
counselor
existing APIs
existing server actions
existing environment variables
```

Search for:

```text
GEMINI_API_KEY
GOOGLE_API_KEY
GoogleGenAI
@google/genai
DeepSeek
pgvector
vector
embedding
RAG
risk
counselor
alert
planner
mood
reflection
```

### Create internally

A dependency map:

```text
Authentication
   ↓
User ID
   ↓
User data
   ↓
RAG / Analytics / Risk
   ↓
Mitra / Insights / Counselor
```

### Output

Create or update an internal implementation note such as:

```text
docs/implementation-audit.md
```

containing:

```text
existing architecture
existing routes
existing database tables
existing relevant MD files
existing knowledge-base PDFs
existing risk algorithm location
existing Gemini/DeepSeek implementation
planned integration points
```

Do not alter application behavior in this phase.

---

# PHASE 1 — GEMINI FOUNDATION

## Objective

Establish clean server-side Gemini infrastructure.

### Requirements

Use:

```text
@google/genai
```

Reuse the existing Gemini API key.

Create/adapt a shared server-only Gemini foundation.

Preferred conceptual structure:

```text
lib/ai/
    gemini.ts
    embeddings.ts
    mitra.ts
```

Adapt this to the existing architecture.

### Implement

Shared Gemini client.

Embedding service:

```typescript
createDocumentEmbedding(text)
createQueryEmbedding(text)
```

Using:

```text
gemini-embedding-001
```

with:

```text
RETRIEVAL_DOCUMENT
RETRIEVAL_QUERY
```

### Verify

Determine the actual embedding dimension.

Do not guess the vector size.

Run a controlled embedding request and verify:

```text
embedding.length
```

### Security

Ensure Gemini remains server-only.

### Tests

Verify:

```text
Gemini configured
document embedding succeeds
query embedding succeeds
dimension is known
no secret exposure
```

---

# PHASE 2 — POSTGRESQL + PGVECTOR FOUNDATION

## Objective

Prepare PostgreSQL for semantic retrieval.

### Inspect

Determine:

```text
pgvector already enabled?
existing vector tables?
existing embeddings?
existing indexes?
existing RPC functions?
existing RLS?
```

### Implement

If necessary:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Create a safe migration.

Create/adapt the RAG storage schema.

The schema must support:

```text
user-private context
global knowledge
PDF metadata
chunk metadata
embedding
source type
source ID
scope
timestamps
```

Do not create duplicate tables if a suitable existing structure exists.

### Verify

Confirm:

```text
database vector dimension
=
Gemini embedding dimension
```

### Tests

```text
migration
vector insertion
vector retrieval
RLS
user isolation
```

---

# PHASE 3 — GENERIC RAG DOCUMENT INGESTION

## Objective

Create the reusable ingestion engine.

Implement:

```text
ingestRagDocument()
```

Responsibilities:

```text
validate
clean
chunk
embed
store
deduplicate
```

Support:

```text
conversation
reflection
note
goal
planner summary
AI plan
other approved semantic sources
```

Do not embed every database row.

Keep numerical data structured.

### Chunk metadata

Maintain:

```text
source_type
source_id
chunk_index
scope
user_id
metadata
```

### Deduplication

Use a content hash or equivalent.

Do not re-embed identical content unnecessarily.

### Tests

Verify:

```text
short document
long document
multiple chunks
duplicate prevention
metadata
embedding dimension
database insertion
```

---

# PHASE 4 — PDF KNOWLEDGE-BASE INGESTION

## Objective

Make the existing context PDFs searchable through RAG.

### First

Inventory all existing PDFs.

Do not modify originals.

### Pipeline

```text
PDF
 ↓
server-side storage/reference
 ↓
text extraction
 ↓
cleaning
 ↓
page metadata
 ↓
chunking
 ↓
Gemini document embedding
 ↓
pgvector
```

### Requirements

Use the existing PDF storage system where possible.

If Supabase Storage is already present, reuse it.

Use a server-side PDF parser compatible with the project.

Do not require a separate PDF AI API unless the existing PDF format genuinely requires one.

### Metadata

Store:

```text
document ID
title
filename
page
chunk index
category
language
scope
source
content hash
```

### Processing state

Use:

```text
pending
processing
ready
failed
```

### Duplicate protection

Do not index the same PDF repeatedly.

Use content hashes.

### Administrator permissions

Only authorized administrators or the existing knowledge-management role may modify global knowledge.

### Tests

Test:

```text
PDF upload
text extraction
chunking
embedding
retrieval
duplicate handling
delete/reindex
invalid PDF
empty PDF
authorization
```

---

# PHASE 5 — RAG RETRIEVAL ENGINE

## Objective

Create the semantic retrieval layer.

Implement:

```text
retrieveRelevantContext()
```

The query pipeline:

```text
user query
 ↓
Gemini query embedding
 ↓
pgvector
 ↓
global PDF retrieval
+
private user memory retrieval
 ↓
user/scope authorization
 ↓
similarity ranking
 ↓
top-K
 ↓
context preparation
```

Default:

```text
topK = 5
```

Make configurable.

Add a configurable similarity threshold.

Do not return hundreds of chunks.

### Important

Do not mix private user memory with another user's memory.

### Retrieval output

Return:

```text
content
similarity
source_type
source_id
metadata
scope
```

### Tests

Verify:

```text
relevant PDF returned
relevant private memory returned
irrelevant data filtered
user isolation
top-K works
threshold works
```

---

# PHASE 6 — MIGRATE MITRA FROM DEEPSEEK TO GEMINI

## Objective

Replace the existing DeepSeek generation backend with Gemini.

### Critical constraint

Do not change the frontend interface.

Keep:

```text
same route
same payload
same message structure
same response format
same streaming behavior when applicable
same conversation history
same UI
```

Only replace the backend generation layer.

### Implement

Separate service:

```text
lib/ai/mitra.ts
```

Use the same:

```text
GEMINI_API_KEY
```

Use the selected Gemini generation model.

### Preserve

All existing Mitra instructions and functionality unless the existing DeepSeek implementation requires a provider-specific change.

### Remove DeepSeek dependency only after Gemini is fully working.

### Tests

```text
normal chat
history
streaming if applicable
error handling
long message
multi-turn conversation
frontend compatibility
```

---

# PHASE 7 — CONNECT RAG TO MITRA

## Objective

Give Mitra relevant personal memory and knowledge-base context.

Flow:

```text
user message
 ↓
query embedding
 ↓
RAG retrieval
 ↓
relevant PDF context
+
relevant user context
 ↓
existing Mitra system prompt
 ↓
Gemini generation
```

Use explicit sections such as:

```text
TRUSTED KNOWLEDGE
USER CONTEXT
CURRENT USER MESSAGE
```

Treat retrieved text as data.

Do not allow retrieved text to override system instructions.

### Fallback

If RAG fails:

```text
Gemini Mitra must still respond normally.
```

### Tests

Verify:

```text
relevant memory used
relevant PDF used
irrelevant context excluded
no-context question does not invent memory
RAG failure does not crash Mitra
```

---

# PHASE 8 — SIGNAL COLLECTION ENGINE

## Objective

Create a unified backend layer that collects meaningful signals from existing MannMitra features.

Inspect actual database schemas and implementation.

Collect appropriate signals from:

```text
Planner
Tasks
Mood
Stress
Mitra conversations
Reflections
Notes
Habits
Existing risk data
Other documented signals
```

Do not collect irrelevant fields blindly.

---

# PHASE 9 — SIGNAL NORMALIZATION

Create a normalized internal structure.

Conceptually:

```typescript
type UserSignal = {
  type: string;
  source: string;
  value: number | boolean | string;
  timestamp: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
};
```

Normalize:

```text
timestamps
scores
categories
source identifiers
confidence
```

Do not alter the actual source data.

---

# PHASE 10 — TEXT SIGNAL EXTRACTION

For unstructured text, use Gemini only where required by the provided architecture.

Potential sources:

```text
Mitra chat
reflections
notes
other textual user input
```

Convert text into validated structured signals.

Example:

```json
{
  "stress_signal": true,
  "academic_pressure": true,
  "overwhelm_signal": true,
  "support_request": false,
  "confidence": 0.86
}
```

Important:

The Gemini output is a **feature extraction result**, not the final risk score.

Use strict schema validation.

Reject malformed outputs.

Do not allow arbitrary free-form model output into the risk engine.

---

# PHASE 11 — IMPLEMENT THE PROVIDED RISK ALGORITHM EXACTLY

## MOST IMPORTANT PHASE

Locate the exact risk-score algorithm supplied in the project's `.md` files/documentation.

Implement it exactly.

Before coding, extract:

```text
input signals
normalization rules
weights
equations
thresholds
time windows
decay rules
override conditions
risk categories
alert conditions
```

Create a single controlled service:

```text
risk-engine.ts
```

or equivalent.

### Requirements

The risk engine must:

```text
accept normalized signals
apply the provided algorithm
produce the exact configured score
determine risk level
return contributing factors
```

Do not distribute scoring logic across multiple UI components or API routes.

### Example output

```typescript
type RiskAssessment = {
  score: number;
  level: string;
  contributors: Array<{
    source: string;
    reason: string;
    contribution?: number;
  }>;
  evaluatedAt: string;
};
```

Adapt to the exact documented algorithm.

### Critical

Do NOT make Gemini responsible for deciding the final numeric score.

The backend algorithm is authoritative.

---

# PHASE 12 — RISK EVALUATION TRIGGERS

Determine from the existing architecture the best triggers for risk evaluation.

Potential triggers:

```text
new mood entry
stress update
reflection created
planner workload changed
task completion/deadline event
new relevant Mitra message
scheduled evaluation
```

Use event-driven evaluation where appropriate.

Do not calculate expensive full-history analysis on every page render.

---

# PHASE 13 — RISK HISTORY

Store risk assessments using the existing schema if available.

Otherwise create an appropriate table.

Store:

```text
user_id
score
risk_level
contributors
timestamp
algorithm/version
```

Version the algorithm if the existing documentation provides a version.

Do not overwrite historical assessments.

---

# PHASE 14 — COUNSELOR ALERT ENGINE

## Objective

Trigger counselor warnings when the existing risk algorithm indicates the documented alert condition.

Do not invent a different threshold.

Implement:

```text
Risk assessment
 ↓
documented alert condition
 ↓
alert creation
 ↓
counselor notification
```

### Deduplication

Prevent counselor spam.

Use:

```text
risk-state transitions
cooldowns
material score changes
unreviewed alert suppression
```

according to the documented behavior.

---

# PHASE 15 — COUNSELOR ALERT STORAGE

Reuse the existing notification/risk-alert system if one exists.

Otherwise create a safe table similar to:

```text
counselor_risk_alerts
```

Store:

```text
user
risk score
risk level
trigger
contributing signals
summary
status
created_at
reviewed_at
reviewed_by
```

Do not expose unnecessary raw private conversations.

---

# PHASE 16 — COUNSELOR AUTHORIZATION

Counselors must only see students they are authorized to support.

Inspect the existing:

```text
role model
counselor assignment model
organization model
RLS
```

Implement using existing conventions.

Never expose all student risk assessments globally.

---

# PHASE 17 — ANALYTICS + INSIGHTS

Keep structured analytics independent from RAG.

Use:

```text
structured data
    ↓
charts / metrics / trends
```

Use:

```text
RAG
    ↓
semantic explanations/context
```

Combine them only inside the existing insights engine.

Example:

```text
stress trend increased
+
task completion decreased
+
relevant user reflections mention deadline pressure
```

Generate an insight carefully.

Do not claim medical diagnosis or unsupported causality.

---

# PHASE 18 — MITRA CONTEXT FROM THE RISK ENGINE

Determine from the existing product requirements whether Mitra should receive a limited internal context.

If permitted:

```text
current risk state
relevant non-sensitive contributing factors
```

Do not expose counselor-only information unnecessarily.

Do not reveal internal scoring implementation.

Do not tell the user their hidden score unless the existing UX explicitly specifies it.

---

# PHASE 19 — HEALTH CHECK / DEBUG SYSTEM

Implement a protected development health check.

Verify:

```text
Gemini
embedding model
embedding dimension
PostgreSQL
pgvector
RAG table
PDF knowledge base
Mitra generation
risk engine
```

Never expose secrets.

Do not make internal diagnostic endpoints publicly usable in production.

---

# PHASE 20 — SECURITY AUDIT

Search the complete repository for:

```text
NEXT_PUBLIC_GEMINI_API_KEY
GEMINI_API_KEY=
AIza
console.log
apiKey
DeepSeek
```

Verify:

```text
Gemini key remains server-side
```

Also verify:

```text
RLS
user authorization
counselor authorization
PDF admin authorization
RAG scope filtering
```

---

# PHASE 21 — COMPLETE TEST SUITE

Run the project's existing tests.

Add focused tests for:

## Gemini

```text
embedding
query embedding
generation
dimension validation
```

## RAG

```text
ingestion
chunking
retrieval
PDF retrieval
deduplication
user isolation
```

## Mitra

```text
chat
history
streaming
RAG context
fallback without RAG
```

## Risk

```text
algorithm correctness
signal normalization
time windows
edge cases
thresholds
risk-level transitions
```

## Counselor

```text
alert generation
alert deduplication
authorization
review workflow
```

## Regression

Verify:

```text
planner
mood
reflection
analytics
authentication
dashboard
existing APIs
existing routes
```

---

# PHASE 22 — PERFORMANCE OPTIMIZATION

After correctness is verified:

Inspect:

```text
embedding frequency
database query performance
vector indexes
RAG context size
Gemini token usage
risk evaluation frequency
PDF processing
duplicate ingestion
```

Optimize only after correctness.

Do not prematurely optimize by removing required signals.

---

# PHASE 23 — DOCUMENTATION

Update/create:

```text
docs/rag.md
docs/risk-engine.md
docs/architecture.md
```

Document:

```text
Gemini configuration
embedding model
embedding dimension
PDF pipeline
RAG schema
retrieval
user isolation
Mitra migration
signal collection
risk algorithm
risk evaluation
counselor alerts
testing
troubleshooting
```

Document the **actual implementation**, not an aspirational design.

---

# PHASE 24 — FINAL PRODUCTION VERIFICATION

Verify:

```text
TypeScript
lint
tests
build
database migrations
RLS
API routes
Mitra
planner
mood
reflection
analytics
counselor dashboard
PDF knowledge base
RAG
risk engine
alerts
```

Verify no API key exists in client code.

Verify no new Gemini key was created.

Verify DeepSeek is no longer serving production Mitra requests.

Verify the frontend interface remains unchanged.

---

# FINAL ARCHITECTURE TARGET

The final system should look like:

```
                MANNMITRA
                    │
      ┌─────────────┼─────────────┐
      │             │             │
      ▼             ▼             ▼
  Structured       RAG          Gemini
    Data         Context        Services
      │             │             │
      │             ├──── PDF    ├── Mitra
      │             ├──── User   └── Extraction
      │             │
      └──────┬──────┘
             ▼
      Multi-Signal Layer
             │
     ┌───────┴────────┐
     │                │
     ▼                ▼
Analytics         Risk Engine
     │                │
     ▼                ▼
  Insights       Risk Assessment
                      │
                alert condition
                      │
                      ▼
               Counselor Alert
```

````

---

# ABSOLUTE NON-NEGOTIABLES

1. Read the existing `.md` files before implementation.
2. Read and inventory the existing PDF knowledge base.
3. Read and implement the provided risk algorithm exactly.
4. Never invent a replacement risk algorithm.
5. Reuse the existing Gemini API key.
6. Use `gemini-embedding-001` for RAG embeddings.
7. Use the selected Gemini model for Mitra generation.
8. Keep embeddings and generation as separate server-side services.
9. Replace DeepSeek backend without changing the Mitra frontend interface.
10. Keep user RAG data isolated by authenticated user.
11. Keep global PDF knowledge separate from private user memory.
12. Keep structured analytics separate from RAG.
13. Keep risk calculation separate from RAG.
14. Counselor alerts must follow the documented risk/alert algorithm.
15. Never expose API keys.
16. Never reset or destroy the existing database.
17. Do not modify unrelated UI/features.
18. Implement in phases.
19. Test every phase before proceeding.
20. Do not claim implementation that was not actually verified.

---

# PHASE COMPLETION REPORT

After each phase, provide:

```text
PHASE X COMPLETE

Implemented:
- ...

Files changed:
- ...

Database changes:
- ...

APIs/services added:
- ...

Tests performed:
- ...

Security verification:
- ...

Existing functionality verified:
- ...

Known issues/blockers:
- ...

Ready for next phase:
YES / NO
````

At the end provide:

```text
MANNMITRA IMPLEMENTATION COMPLETE

Gemini:
✓ Embeddings
✓ Mitra generation
✓ Existing API key reused
✓ Server-side only

RAG:
✓ User context
✓ PDF knowledge base
✓ Chunking
✓ Embeddings
✓ pgvector
✓ User isolation

Multi-Signal:
✓ Planner
✓ Mood/stress
✓ Mitra context
✓ Reflections/notes
✓ Other documented signals

Risk:
✓ Existing algorithm implemented exactly
✓ Structured signal processing
✓ Risk history
✓ Risk state transitions

Counselor:
✓ Alert generation
✓ Alert deduplication
✓ Authorization
✓ Counselor visibility

Analytics:
✓ Structured analytics preserved
✓ RAG context integrated where appropriate

Security:
✓ No client-side Gemini key
✓ RLS
✓ User isolation
✓ Counselor authorization
✓ No destructive migrations

Testing:
✓ Unit tests
✓ Integration tests
✓ RAG tests
✓ Risk algorithm tests
✓ Isolation tests
✓ Mitra tests
✓ Regression tests
✓ Build/lint/typecheck
```

If any phase cannot be completed safely because the actual repository differs from the documentation, inspect the code and implement the safest compatible version rather than guessing or destroying existing functionality.
