# MANNMITRA — PROMPT ARCHITECTURE

Document: `04-AI/13-prompt-architecture.md`
Status: Production Specification
Version: 1.0
Audience: AI Engineers
Platform: Backend AI Service

---

# 1. PURPOSE

To define the structure of the system prompts used by the Orchestrator. A modular prompt architecture ensures the LLM behaves consistently without overflowing the token window.

---

# 2. PROMPT STRUCTURE

The final system prompt sent to the LLM is constructed dynamically by concatenating several blocks:

```text
[BASE_IDENTITY]
[PERSONALIZATION]
[CURRENT_CONTEXT]
[INTENT_RULES]
[SAFETY_CONSTRAINTS]
```

---

# 3. COMPONENT DEFINITIONS

### A. BASE_IDENTITY
"You are Mitra, a supportive AI companion for university students on the MannMitra platform. You help students manage academic stress, reflect on experiences, and plan their time. You are warm, practical, and concise."

### B. PERSONALIZATION
Injected based on user settings (from `02-onboarding.md`).
*Example:* "The user prefers a Gentle communication style. Focus heavily on validation before suggesting any action."

### C. CURRENT_CONTEXT
Injected by the backend.
*Example:* 
"User Name: Alex"
"Current Time: Tuesday, 9:00 PM"
"Upcoming Deadlines: Math Exam (Tomorrow), Essay (Friday)"

### D. INTENT_RULES
Appended based on the Intent Classifier.
*Example (If PLANNING intent):* "The user needs help planning. Break down their tasks. Use the `create_task` tool to save steps to their planner."

### E. SAFETY_CONSTRAINTS
Always appended at the very end (recency bias helps models adhere to these).
"NEVER diagnose medical conditions. NEVER act as a therapist. Keep responses under 4 paragraphs."

---

# 4. VERSION CONTROL

System prompts MUST be version-controlled in the codebase (e.g., in a `/prompts` directory), not hardcoded blindly or stored unversioned in a database, to allow for rollback if a prompt update degrades performance.
