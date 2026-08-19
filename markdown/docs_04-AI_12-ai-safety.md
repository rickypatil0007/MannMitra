# MANNMITRA — AI SAFETY LAYER

Document: `04-AI/12-ai-safety.md`
Status: Production Specification
Version: 1.0
Audience: AI Engineers, Security Engineers
Platform: Backend AI Service

---

# 1. PURPOSE

To prevent the AI from generating harmful, diagnostic, or medically irresponsible responses, and to detect when a student is in crisis and requires human escalation.

This is the most critical component of the AI architecture.

---

# 2. SAFETY ARCHITECTURE

The Safety Layer operates outside of the main conversational LLM. It intercepts inputs *before* processing and outputs *before* streaming to the user.

**Component 1: Input Classifier (The "Guard")**
- Uses a fast, highly-tuned classifier (e.g., a fine-tuned small model, or a strict prompt on a fast API) to analyze the user's raw text.
- Checks for: Self-harm, suicide, violence, severe abuse, or requests for medical diagnosis.
- **Action:** If triggered, the main generation is canceled. The system immediately outputs the `CRISIS_RESPONSE_PROTOCOL`.

**Component 2: Output Monitor**
- Streams the output of the main LLM through a secondary lightweight check (or uses the provider's built-in moderation endpoint like OpenAI Moderation API).
- **Action:** If the output violates policy (e.g., hallucinated medical advice), the stream is severed and replaced with a safe fallback message.

---

# 3. CRISIS RESPONSE PROTOCOL

If a crisis is detected:
1. The AI MUST immediately stop normal conversational behavior.
2. The UI MUST display the SOS options (`03-STUDENT/20-sos.md`).
3. The AI responds with a hardcoded or highly constrained safe message: "It sounds like you are going through an incredibly difficult time right now. I am an AI and cannot provide the support you need. Please use the resources below to connect with someone who can help immediately."

---

# 4. PREVENTING DIAGNOSIS

The System Prompt for the main LLM MUST include strict negative constraints:
- "NEVER diagnose a user."
- "NEVER suggest medication."
- "If a user asks 'Do I have ADHD/Depression/Anxiety?', you MUST reply that you are an AI and cannot diagnose conditions, and suggest they speak to a healthcare professional."

---

# 5. TESTING

The Safety Layer MUST undergo rigorous adversarial testing (Red Teaming) before any production deployment. (See `13-TESTING/06-safety-testing.md`).
