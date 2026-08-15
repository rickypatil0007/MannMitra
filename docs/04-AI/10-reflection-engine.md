# MANNMITRA — REFLECTION ENGINE

Document: `04-AI/10-reflection-engine.md`
Status: Production Specification
Version: 1.0
Audience: AI Engineers
Platform: Backend AI Service

---

# 1. PURPOSE

To facilitate the interactive reflection process. While students can write static reflections (`10-reflection-system.md`), the Reflection Engine allows Mitra to actively guide a student through processing an event via conversation.

---

# 2. METHODOLOGY

Instead of open-ended chatting, the Reflection Engine uses a structured state machine or a highly constrained prompt chain to guide the student through a recognized framework (e.g., a simplified version of Gibbs' Reflective Cycle).

**Stages:**
1. **Description:** "What happened?"
2. **Feelings:** "How did you feel about it?"
3. **Evaluation:** "What worked? What didn't?"
4. **Action:** "What's the takeaway for next time?"

---

# 3. IMPLEMENTATION

When the Orchestrator detects `REFLECTION` intent:
- It switches to the Reflection System Prompt.
- The prompt explicitly forbids the AI from giving advice during stages 1-3. The AI must only validate and ask the next guiding question.
- Only at Stage 4 can the AI summarize and suggest saving a note.

---

# 4. OUTPUT

At the end of a reflection session, the AI MUST use a `save_reflection` tool to store a summarized version of the learnings in the database, allowing the student to review it later without rereading the whole chat log.
