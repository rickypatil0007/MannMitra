# MANNMITRA — STRESS ANALYSIS

Document: `04-AI/08-stress-analysis.md`
Status: Production Specification
Version: 1.0
Audience: AI Engineers
Platform: Backend AI Service

---

# 1. PURPOSE

To passively analyze conversation text and self-reported data to gauge the student's current stress level. This helps personalize responses and informs the Stress Forecast.

---

# 2. IMPLEMENTATION

**MVP:**
- Rely primarily on explicit user check-ins (`03-STUDENT/07-stress-tracking.md`).
- Use the LLM's natural language understanding during chat to detect high pressure.

**Prompt Injection:**
Before generating a response, the Context Assembler injects the student's most recent stress check-in.
*Context snippet:* `<user_context> Today's reported stress: 4/5 (High). Mood: Anxious. </user_context>`

---

# 3. RULE OF THUMB

- If the context shows High Stress (4 or 5), the system prompt instructs the AI to be **shorter, more validating, and less demanding**.
- Do not suggest complex new planning exercises to a student who is currently at a 5/5 stress level. Suggest rest or grounding techniques instead.

---

# 4. PRIVACY

- The AI's internal assessment of the student's stress MUST NOT be saved as a formal medical record or diagnostic label. It is transient context used only to improve the immediate conversation.
