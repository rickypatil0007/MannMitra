# MANNMITRA — MULTILINGUAL AI

Document: `04-AI/16-multilingual-ai.md`
Status: Production Specification
Version: 1.0
Audience: AI Engineers
Platform: Backend AI Service

---

# 1. PURPOSE

To support international students or students who feel more comfortable expressing emotional distress in their native language.

---

# 2. IMPLEMENTATION

Modern LLMs inherently support multiple languages. However, the system prompt must explicitly handle this behavior safely.

**System Prompt Rules:**
- "If the user speaks to you in a language other than English, reply in that exact language."
- "Maintain the same warm, practical, non-clinical persona regardless of the language used."

---

# 3. SAFETY CONSIDERATIONS

- The Safety Classifier MUST support the targeted languages (e.g., using a multilingual moderation model).
- If the safety classifier only supports English, the orchestrator MUST perform a fast, cheap translation to English internally *before* classification.
- **Edge Case:** If the LLM generates a response in a language the moderation API cannot check, the system must either translate the output for checking, or use a model trusted for multilingual safety.

---

# 4. UI IMPACT

The UI itself (menus, buttons) does not need to be translated for this feature to work; the student can simply type Hindi or Spanish into the Mitra chat composer, and Mitra will respond accordingly. Full app internationalization (i18n) is a separate Future Scope project.
