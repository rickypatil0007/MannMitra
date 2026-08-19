# MANNMITRA — VOICE AI

Document: `04-AI/15-voice-ai.md`
Status: Production Specification
Version: 1.0
Audience: AI Engineers, Frontend Engineers
Platform: Responsive Web Application / Backend

---

# 1. PURPOSE

To provide an alternative input and output method for students who find typing difficult when stressed, overwhelmed, or walking between classes.

---

# 2. SCOPE

**In Scope (Phase 2):**
- Speech-to-Text (STT): User speaks, Mitra transcribes and processes it as text.

**Future Scope:**
- Text-to-Speech (TTS): Mitra replies with a synthesized voice.
- Real-time full duplex conversational voice (like OpenAI Advanced Voice).

---

# 3. ARCHITECTURE (MVP)

1. **Client-side Capture:** Browser/App records audio using MediaRecorder API.
2. **Transmission:** Audio blob is sent to backend `/api/v1/chat/audio`.
3. **STT Processing:** Backend uses a fast API (e.g., OpenAI Whisper) to transcribe the audio to text.
4. **Standard Orchestration:** The transcribed text is fed into the standard AI Orchestrator just like a typed message.
5. **UI Rendering:** The transcription is displayed in the user's chat bubble, and Mitra streams back a text reply.

---

# 4. PRIVACY

- Audio files used for transcription MUST be transient. They are deleted from the server memory immediately after transcription is complete. They MUST NOT be stored in cloud storage (unlike Voice Notes).
