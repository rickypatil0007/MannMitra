# MANNMITRA — MITRA CHAT INTERFACE

Document: `03-STUDENT/04-mitra-chat.md`
Status: Production Specification
Version: 1.0
Audience: Students, Frontend Engineers, AI Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

The Mitra Chat Interface is the primary interaction surface for MannMitra's AI companion. It provides a calm, safe, and private conversational environment where students can reflect, plan, and receive contextual support.

---

# 2. SCOPE

**In Scope (MVP):**
- Real-time text conversation with Mitra.
- Contextual quick-reply prompts.
- Streaming AI responses.
- Automatic scrolling and message history.
- Contextual action buttons inside AI responses (e.g., "Add to Planner").

**Future Scope:**
- Voice note integration (Voice AI).
- Inline rich widgets (e.g., interactive calendar inside chat).

---

# 3. USER FLOW

```text
Student navigates to Mitra
    ↓
Empty state / Previous conversation history loads
    ↓
System presents contextual suggested prompts
    ↓
Student types message or clicks prompt
    ↓
Message is sent; loading indicator shown
    ↓
AI response streams in
    ↓
Response includes practical actions if applicable (e.g., Task Extraction)
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-04-01: Conversational UI
- The interface MUST display messages in a standard conversational layout (User right, Mitra left).
- The chat MUST persist history within a defined session/timeframe.

## STU-04-02: Message Composer
- MUST support multiline text input.
- MUST support `Enter` to send and `Shift+Enter` for a new line (Desktop).
- MUST remain accessible and appropriately sized when the mobile keyboard is open.

## STU-04-03: Streaming Responses
- The AI response MUST stream in real-time to reduce perceived latency.
- The interface MUST handle markdown formatting (bold, lists) rendered safely.

## STU-04-04: Actionable Responses
- If the AI Orchestrator identifies a planning intent, the response UI MUST render actionable buttons (e.g., "Save Task") alongside the text.

## STU-04-05: Safety Interventions
- If the AI detects a safety/crisis intent, the UI MUST visually elevate human support options or SOS links seamlessly without breaking the conversational flow.

---

# 5. UI / UX REQUIREMENTS

- **Visuals:** Clean white background, minimal chat bubbles. Use soft sage for Mitra's bubbles, white/light gray for user bubbles.
- **Composer:** Rounded but restrained (12px-16px radius). Placeholder: "What's on your mind?"
- **Animations:** Subtle fade-in for new messages. Smooth auto-scroll to bottom. No dramatic bouncing.
- **Empty State:** If it's a new conversation, display a calm greeting and 3-4 contextual prompts (e.g., "Help me focus," "Talk it through").

---

# 6. DATA REQUIREMENTS

**Required Data Entities:**
- `ConversationSession`: Groups related messages.
- `Message`: Stores sender (`user` | `assistant`), content, timestamp, and metadata (e.g., extracted tasks).

---

# 7. API REQUIREMENTS

- **POST `/api/v1/chat/message`**
  - **Purpose:** Sends a message to the AI Orchestrator.
  - **Payload:** `{ sessionId: string, text: string }`
  - **Response:** Server-Sent Events (SSE) stream for real-time response generation.

- **GET `/api/v1/chat/history`**
  - **Purpose:** Fetches previous messages for the current session.

---

# 8. SECURITY & PRIVACY

- **Privacy:** Chat conversations are `Restricted Data`. They MUST NOT be accessible by institutional dashboards or community features.
- **Storage:** Messages must be encrypted at rest.
- **Safety:** Content must be evaluated by the AI Safety Layer (see `04-AI/12-ai-safety.md`) before rendering.

---

# 9. ACCESSIBILITY

- Screen readers must announce when Mitra is typing and when a new message arrives (using ARIA live regions).
- The composer must maintain visible focus.

---

# 10. ANALYTICS

- `chat_session_started`
- `chat_message_sent`
- `chat_quick_prompt_used`
- `chat_inline_action_clicked` (e.g., task saved)

*Note: Never log the contents of the messages in the analytics platform.*
