# MannMitra Architecture Audit & Discovery Note

## 1. Existing Architecture
- **Framework**: Next.js 16.3.1 (App Router)
- **Database**: PostgreSQL (via Neon DB)
- **ORM**: Prisma Client (`@prisma/client` v7.9.1)
- **Authentication**: Firebase Auth (mapped to Prisma `User` table via `firebaseUid`)
- **Package Manager**: npm

## 2. Existing Data Models (from `schema.prisma`)
- `User` (Role-based: STUDENT, COUNSELLOR, FACULTY, ADMIN)
- `Task`, `CalendarEvent` (Planner)
- `MoodRecord`, `StressRecord`, `StressForecast` (Wellness)
- `Conversation`, `Message` (Mitra Chat)
- `PersonalNote`, `VoiceNote` (Reflections)
- `CounsellingRequest`, `TrustedContact`, `SOSAlert` (Support)
- *Note: Vector storage, risk history, and detailed counselor alert tables do not exist yet.*

## 3. Existing Mitra AI Implementation
- Currently located in `backend/server/mitra/mitra.provider.ts` & `mitra.service.ts`.
- Uses `@ai-sdk/openai` configured with an **Nvidia API key** targeting the `meta/llama-3.1-70b-instruct` model, despite prompt references to DeepSeek. (We will migrate this to Gemini).
- Chat is routed through `app/api/mitra/chat/route.ts` using standard Vercel AI SDK streams.

## 4. Existing API Routes & Environment Variables
- `app/api/mitra/chat/route.ts` handles chat.
- `GEMINI_API_KEY` exists in `apikeys/.env`.
- Other existing keys: `NVIDIA_API_KEY`, `FIREBASE_*`, `DATABASE_URL`. (All safely on the server side).

## 5. Knowledge Base (PDFs)
PDFs and related documents are located in `RagModel/Knowledge_base/`:
- `L7.-PHQ-9-and-GAD-7-screening-tools.pdf`
- `Mental-Health-Psychosocial-Support-english-messages (1).pdf`
- `Mental-Health-Psychosocial-Support-english-messages.pdf`
- `brochure.pdf`
- `iCALL-Psychosocial-Helpline-Annual-Report-Apr15-Aug16.pdf`
- `iCALL-Report-Sep-13-to-Mar-15.pdf`
- `iCALL-Work-undertaken-during-COVID-19.pdf`
- `iCALL_Annual_Report_2012-13.pdf`
- `mhGAP.pdf`
- `who-5.pdf`
- Several `.jpg` and `.htm` files from iCALL.

## 6. Risk Scoring Algorithm
Found in `RagModel/risk_Engine.md`.
**Composite Score Formula**:
```
risk_score = 
    w_q  * questionnaire_severity      // PHQ-9/GAD-7/your NHQ, normalized 0-1
  + w_m  * mood_trend_score            // rolling 7/14-day decline, normalized 0-1
  + w_p  * planner_disengagement_score // missed tasks + inactivity, normalized 0-1
  + w_c  * chat_sentiment_score        // session-level sentiment trend, normalized 0-1
  + w_k  * keyword_flag_score          // capped, low weight, category-level flags
```
Weights: `w_q: 0.4`, `w_m: 0.2`, `w_c: 0.15`, `w_p: 0.1`, `w_k: 0.15`.
An explicit crisis keyword forces `CRISIS` band (>= 85 score).

## 7. Planned Integration Points
- **PostgreSQL Extension**: Need to run a migration to add `vector` extension and RAG document tables.
- **Gemini Foundation**: New service in `backend/server/ai/gemini.ts` for embeddings and generation.
- **RAG Retrieval**: Retrieve PDFs and User notes based on user queries, integrate into `api/mitra/chat`.
- **Risk Engine**: Create a `backend/server/risk/riskEngine.ts` to calculate scores on relevant triggers.
- **Counselor Escalation**: Trigger counselor alerts in DB when score hits `HIGH` or `CRISIS`.
