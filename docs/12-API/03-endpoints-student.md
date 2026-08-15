# Student Endpoints

## 1. Purpose
Details the Custom Edge API routes utilized specifically by the student persona for features that cannot be handled via simple PostgREST CRUD.

## 2. Scope
Covers AI interaction, SOS triggering, and complex task management.

## 3. Endpoints

### 3.1 Mitra Chat Stream
- **Method**: `POST`
- **Path**: `/api/v1/ai/chat`
- **Auth Required**: Yes (`role: student`)
- **Payload**: `{ "messages": [{ "role": "user", "content": "I'm stressed about finals." }] }`
- **Behavior**: Fetches RAG context, calls OpenAI, and returns a `ReadableStream` of text chunks. Also handles asynchronous classification to detect escalation triggers.

### 3.2 Trigger SOS Alert
- **Method**: `POST`
- **Path**: `/api/v1/student/sos/trigger`
- **Auth Required**: Yes (or specialized Anonymous Session for emergency guests)
- **Payload**: `{ "lat": 40.71, "lng": -74.00, "trigger_type": "manual" }`
- **Behavior**: Bypasses normal queues to immediately hit the Twilio API, dispatching SMS alerts to the student's primary trusted contacts and the institution's emergency response team. Writes to the `audit_logs`.

### 3.3 Generate Voice Note Signed URL
- **Method**: `POST`
- **Path**: `/api/v1/student/media/sign-upload`
- **Auth Required**: Yes
- **Payload**: `{ "file_size_bytes": 102400, "mime_type": "audio/webm" }`
- **Behavior**: Validates the file parameters against quotas and returns a time-limited signed URL that the client uses to upload the audio file directly to Supabase Storage.

## 4. Security / Privacy
- The `/api/v1/student/*` routes must strictly verify that the JWT `role` is `student`.
- The SOS endpoint must have aggressive rate limiting (e.g., 2 triggers per minute) to prevent a malicious user from spamming the Twilio API and draining funds, while still allowing legitimate rapid clicks during panic.
