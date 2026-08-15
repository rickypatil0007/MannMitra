# File & Media Processing

## 1. Purpose
Explains how MannMitra handles the recording, uploading, and playback of media, specifically focusing on the Voice Notes feature (Feature 09) and potential image uploads.

## 2. Scope
Covers browser-native media APIs, blob handling, and integration with Supabase Storage.

## 3. Voice Notes Implementation

### 3.1 Recording (Frontend)
- Utilizes the browser's native `MediaRecorder` API.
- Requests `navigator.mediaDevices.getUserMedia({ audio: true })`.
- Captures audio chunks into a `Blob`, typically encoding as `audio/webm` (Chrome/Firefox) or `audio/mp4` (Safari).

### 3.2 Uploading
- The generated `Blob` is uploaded directly to Supabase Storage from the client using `supabase.storage.from('voice_notes').upload()`.
- The file path is typically structured as `${studentId}/${uuidv4()}.webm` to prevent collisions and enforce RLS.

### 3.3 Playback
- The client fetches a short-lived signed URL from Supabase using `createSignedUrl()`.
- The URL is passed to a standard HTML `<audio>` element or a custom audio player UI component for playback.

## 4. Image Processing (Avatars / Attachments)
- If users upload avatars, the client should compress and resize the image *before* uploading to save bandwidth and storage costs.
- Tools like `browser-image-compression` can be used to shrink a 5MB photo to a 200KB WebP file before it hits Supabase Storage.

## 5. Security / Privacy
- **Microphone Permissions**: The app must clearly explain *why* it needs the microphone before prompting the browser permission dialog.
- **Data Leakage**: Do not log raw Base64 strings of media to the console.

## 6. Edge Cases
- **Safari Compatibility**: Safari's `MediaRecorder` implementation has historical quirks regarding codecs. Ensure fallback logic exists or standardize on a widely supported format like `audio/mp4` via a client-side transcoder (like `ffmpeg.wasm`) if absolute cross-browser compatibility is required.

## 7. Testing
- Mock `navigator.mediaDevices` in Jest to ensure the UI correctly displays the "Recording..." state and handles permission denial gracefully.
