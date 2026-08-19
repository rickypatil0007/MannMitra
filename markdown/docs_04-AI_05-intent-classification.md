# MANNMITRA — INTENT CLASSIFICATION

Document: `04-AI/05-intent-classification.md`
Status: Production Specification
Version: 1.0
Audience: AI Engineers
Platform: Backend AI Service

---

# 1. PURPOSE

Intent Classification is the first processing step (after safety checks) for any user message. It determines what the user is trying to accomplish so the Orchestrator can route them to the most cost-effective and accurate prompt chain.

---

# 2. SUPPORTED INTENTS (MVP)

1. **`CASUAL_CHAT`**: General conversation, venting, or seeking comfort. (Routes to standard companion prompt).
2. **`PLANNING`**: Mentioning deadlines, exams, tasks, or feeling overwhelmed by workload. (Routes to planning prompt with tool access).
3. **`REFLECTION`**: Processing a past event ("I failed my test", "I had a great day"). (Routes to reflection engine).
4. **`SUPPORT_REQUEST`**: Asking for human help, a counsellor, or how to use the app. (Routes to recommendation engine or UI redirect).

---

# 3. IMPLEMENTATION STRATEGY

**Option A (MVP): Single-Pass LLM**
Use a fast, cheap model (e.g., GPT-4o-mini) with `response_format: { type: "json_object" }` to classify the intent of the incoming message before generating the full response.

*Pros:* Easy to implement.
*Cons:* Adds ~500ms latency.

**Option B: Parallel Tool Calling**
Provide the main generation model with specific tools (e.g., `start_planning()`, `record_reflection()`). If the model doesn't call a tool, it defaults to casual chat.

*Pros:* Lower latency.

**Decision for MVP:** Use Option B (Tool Calling/Function Calling) integrated directly into the Conversation Engine, as modern models are highly optimized for this.

---

# 4. EDGE CASES

- **Ambiguous Intent:** If the intent is unclear, default to `CASUAL_CHAT`. It is better for Mitra to respond supportively than to erroneously trigger a complex planning flow.
