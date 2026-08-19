# MANNMITRA — VOICE NOTES

Document: `03-STUDENT/12-voice-notes.md`
Status: Production Specification
Version: 1.0
Audience: Students, Frontend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

Voice Notes allow students to record their thoughts audibly. Speaking is often faster and emotionally easier than typing, especially during high-stress moments.

---

# 2. SCOPE

**In Scope (Phase 2):**
- Record, playback, and delete audio within the browser/app.
- Secure upload and storage.

**Future Scope:**
- On-device transcription so the note becomes searchable text without sending audio to a transcription server.

---

# 3. USER FLOW

```text
Student navigates to Notes
    ↓
Taps the Microphone icon
    ↓
Browser asks for microphone permission (first time only)
    ↓
Student records audio; sees a subtle visualizer
    ↓
Taps Stop
    ↓
Audio is securely saved
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-12-01: Recording
- MUST request explicit microphone permissions.
- MUST provide clear UI states: Ready, Recording, Paused, Stopped.
- MUST limit recordings to a reasonable length (e.g., 5 minutes) to manage storage costs.

## STU-12-02: Playback & Deletion
- MUST provide a native or custom audio player.
- MUST allow permanent deletion of the audio file.

---

# 5. UI / UX REQUIREMENTS

- **Visuals:** Calm recording interface. No aggressive red recording dots. Use a soft pulsing green or sage ring to indicate active recording.
- **Error States:** Handle denied microphone permissions gracefully (e.g., "We need microphone access to record. You can change this in your browser settings.").

---

# 6. DATA REQUIREMENTS

**Required Data Entities:**
- `VoiceNote`:
  - `id` (UUID)
  - `user_id` (UUID)
  - `storage_path` (String)
  - `duration_seconds` (Integer)
  - `created_at` (Timestamp)

---

# 7. API & STORAGE REQUIREMENTS

- Audio files MUST be uploaded directly to secure cloud storage (e.g., Supabase Storage or AWS S3).
- **POST `/api/v1/voice-notes/presigned-url`** (To securely upload the file).
- The storage bucket MUST be private.

---

# 8. SECURITY & PRIVACY

- Voice notes are `Restricted Data`.
- The storage bucket MUST enforce RLS or IAM policies preventing anyone but the file owner from reading the object.

---

# 9. ANALYTICS

- `voice_note_recorded`
- `voice_note_deleted`
