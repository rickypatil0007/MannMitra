# MANNMITRA — MEMORY & CONTEXT

Document: `04-AI/14-memory-context.md`
Status: Production Specification
Version: 1.0
Audience: AI Engineers, Security Engineers
Platform: Backend AI Service

---

# 1. PURPOSE

To give Mitra continuity across sessions, so the student feels heard and doesn't have to repeat themselves ("Like I mentioned yesterday...").

---

# 2. SCOPE

**In Scope (Phase 2):**
- Explicit factual memory extraction (e.g., User's major, key stressors).
- User ability to view and delete memories.

**Future Scope:**
- Automatic semantic recall via vector embeddings.

---

# 3. EXTRACTION MECHANISM

Instead of searching the entire chat history on every turn, use a background summarization process.

**Workflow:**
1. After a chat session ends (e.g., 30 mins of inactivity), a background job runs.
2. It passes the session transcript to a fast LLM.
3. *Prompt:* "Extract lasting factual preferences or context about the user from this transcript. Output as a JSON list. Ignore transient emotions."
4. Result: `["Struggles with procrastination", "Majoring in Biology", "Has a dog named Max"]`
5. These facts are stored in a `UserMemory` table.

---

# 4. CONTEXT INJECTION

When a new session starts, the Orchestrator fetches the top 5-10 facts from `UserMemory` and injects them into the `[CURRENT_CONTEXT]` block of the system prompt.

---

# 5. PRIVACY & CONTROL

- The student MUST have access to a UI (Settings > Mitra Memory) where they can see exactly what the AI has remembered.
- They MUST be able to delete individual facts or wipe memory entirely.
- Memories are `Restricted Data` and encrypted at rest.
