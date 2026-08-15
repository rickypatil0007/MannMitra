# MANNMITRA — AI ORCHESTRATOR

Document: `04-AI/02-ai-orchestrator.md`
Status: Production Specification
Version: 1.0
Audience: AI Engineers, Backend Engineers
Platform: Backend AI Service

---

# 1. PURPOSE

The AI Orchestrator is the central controller for all Mitra interactions. It determines *how* a user's message should be handled by routing it to the appropriate specialized subsystem or prompt chain.

---

# 2. RESPONSIBILITIES

1. **Gatekeeping:** Receiving the request and passing it to the Safety Classifier.
2. **Intent Classification:** Deciding if the user is asking for planning help, emotional support, or just chatting.
3. **Tool/Function Calling:** Executing backend tools (e.g., `create_task`, `fetch_calendar`) if the LLM determines they are needed.
4. **Response Streaming:** Managing the SSE (Server-Sent Events) connection back to the client.

---

# 3. ORCHESTRATION FLOW

```text
Incoming Message: "I have 3 exams next week and I'm freaking out."
    ↓
[Safety Classifier] -> SAFE
    ↓
[Intent Router] -> IDENTIFIED: Planning + Stress Support
    ↓
[Context Assembler] -> Fetches tasks for "next week", fetches user's name
    ↓
[LLM Call] -> Prompt includes context, tools (create_task), and user message
    ↓
LLM streams text: "That sounds really overwhelming. Let's break it down."
LLM calls tool: `create_task(title: "Study for Exam 1", date: "...")`
    ↓
[Output Processor] -> Streams text to UI, executes DB task creation in background
```

---

# 4. FUNCTIONAL REQUIREMENTS

## AI-02-01: Intent Routing
- The orchestrator MUST classify intent accurately. MVP intents:
  - `GENERAL_SUPPORT`
  - `PLANNING_ASSISTANCE`
  - `REFLECTION`
  - `CRISIS` (Handled by safety layer)

## AI-02-02: Tool Execution
- The orchestrator MUST securely execute functions requested by the LLM.
- MUST validate all arguments passed by the LLM before executing DB operations.

## AI-02-03: Context Injection
- MUST inject the last N messages (e.g., 5-10) to maintain conversational memory.
- MUST enforce context window limits to prevent token overflow.

---

# 5. TECHNICAL ARCHITECTURE

- Recommended framework: Vercel AI SDK (if using Next.js/Node) or LangChain/LlamaIndex (if using Python).
- Must utilize asynchronous execution for tool calls so text streaming isn't blocked.

---

# 6. FAILOVER & RETRIES

- If the primary model (e.g., GPT-4o-mini) fails or rate-limits, the Orchestrator SHOULD attempt a fallback (e.g., GPT-3.5 or Claude Haiku) once before returning an error to the user.
