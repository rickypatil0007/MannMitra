# MANNMITRA — CONVERSATION ENGINE

Document: `04-AI/04-conversation-engine.md`
Status: Production Specification
Version: 1.0
Audience: AI Engineers, Backend Engineers
Platform: Backend AI Service

---

# 1. PURPOSE

The Conversation Engine manages the lifecycle of a chat session, ensuring the LLM has the right historical context without overflowing the token window or incurring massive costs.

---

# 2. RESPONSIBILITIES

- Managing Chat Sessions (grouping messages logically).
- Context Window Management (truncation/summarization).
- Formatting prompts for the specific LLM API (e.g., OpenAI Chat Completions format).

---

# 3. CONTEXT MANAGEMENT STRATEGY

**MVP Strategy: Sliding Window**
- Inject the System Prompt.
- Inject the most recent 10-15 messages of the current session.
- If the token count exceeds a safe threshold (e.g., 3000 tokens), drop the oldest messages (excluding the System Prompt).

**Future Strategy: Semantic Memory**
- Use vector embeddings (e.g., pgvector in Supabase) to search past conversations for relevant context (e.g., finding out the user previously struggled with Math when they mention "I have a test tomorrow").

---

# 4. DATA MODELS

- `ConversationSession`:
  - `id` (UUID)
  - `user_id` (UUID)
  - `started_at` (Timestamp)
  - `last_message_at` (Timestamp)

- `Message`:
  - `id` (UUID)
  - `session_id` (UUID)
  - `role` (Enum: `user`, `assistant`, `system`, `tool`)
  - `content` (Text)
  - `tokens` (Integer - optional, for cost tracking)

---

# 5. ERROR RECOVERY

- If the context array exceeds the model's absolute token limit, the engine MUST forcefully truncate the oldest user/assistant messages before retrying. It MUST NOT fail the request entirely.
