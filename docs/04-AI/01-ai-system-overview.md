# MANNMITRA — AI SYSTEM OVERVIEW

Document: `04-AI/01-ai-system-overview.md`
Status: Production Specification
Version: 1.0
Audience: AI Engineers, Backend Engineers, Product
Platform: Backend AI Service

---

# 1. PURPOSE

The AI System is the core intelligence layer of MannMitra, powering the "Mitra" companion. It handles natural language understanding, context management, safety detection, and structured task extraction. 

The system is designed as a **Companion**, not a medical diagnostician.

---

# 2. ARCHITECTURE OVERVIEW

The AI architecture consists of several specialized components coordinated by a central Orchestrator.

1. **Input Gateway:** Receives user messages and normalizes them.
2. **Safety Classifier:** (Synchronous) Scans input for self-harm or crisis intent.
3. **Intent Router (Orchestrator):** Determines the primary goal of the user's message (e.g., Casual Chat, Planning, Reflection).
4. **Context Assembler:** Retrieves relevant user data (recent tasks, past reflections, memory) to inject into the prompt.
5. **LLM Engine:** The primary language model (e.g., OpenAI GPT-4o-mini or Claude 3.5 Haiku) that generates the response.
6. **Output Processor:** Extracts structured data (e.g., tasks to add to the DB) and streams the text response to the client.

---

# 3. CORE PRINCIPLES

- **Safety First:** If the Safety Classifier flags an input, the standard generation path is aborted and a predefined safety response is triggered.
- **Privacy by Design:** Only context strictly relevant to the current conversation is pulled from the DB. 
- **Non-Clinical:** The system prompt strictly prohibits diagnosing conditions, prescribing treatments, or acting as a therapist.
- **Latency Matters:** Responses must stream to the client. Structured data extraction should happen in parallel or via function calling.

---

# 4. DEPENDENCIES

- **LLM Provider:** OpenAI API (default) or Anthropic API.
- **Database (Vector/Relational):** Postgres (Supabase) for conversation history and user context.
- **Backend:** Node.js / Python service handling the orchestration.

---

# 5. ERROR HANDLING

- **LLM Timeout/Failure:** If the LLM provider is down, the system MUST return a graceful fallback message: "Mitra is having trouble connecting right now. Please try again in a moment."
- **Context Failure:** If database retrieval fails, the Orchestrator MUST fall back to a stateless conversational mode rather than crashing.

---

# 6. OBSERVABILITY & EVALUATION

- All LLM interactions MUST be logged for quality and safety auditing (with PII redacted or encrypted).
- Key metrics: Latency, Token Usage, Safety Flag Rate, Intent Routing Accuracy.
