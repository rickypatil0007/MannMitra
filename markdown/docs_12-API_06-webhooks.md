# Webhooks

## 1. Purpose
Defines the endpoints designed to receive asynchronous events from external third-party services, enabling MannMitra to react to events happening outside its own infrastructure.

## 2. Scope
Covers incoming webhooks from Twilio (SMS delivery status), Stripe (if B2B billing is implemented), and Clerk/Supabase Auth (if identity events are routed externally).

## 3. Endpoints

### 3.1 Twilio Delivery Status
- **Method**: `POST`
- **Path**: `/api/v1/webhooks/twilio/status`
- **Auth Required**: No (Uses HMAC Signature Verification)
- **Payload**: Standard Twilio `SmsStatus` URL-encoded form data.
- **Behavior**: 
  1. Validates the `X-Twilio-Signature` header using the Twilio Auth Token.
  2. Updates the `audit_logs` or `sos_incidents` table with the delivery status (e.g., `delivered`, `undelivered`, `failed`).
  3. If status is `failed` during an SOS event, the backend instantly triggers the fallback mechanism (e.g., calling the campus security number).

### 3.2 Supabase Database Webhooks (Internal)
- Supabase allows triggering external HTTP endpoints on database mutations.
- **Example**: `AFTER INSERT ON community_posts` triggers a webhook to an AI moderation service to check the text for severe obscenity before setting the status to `APPROVED`.

## 4. Security / Privacy
- **Signature Validation**: Webhooks must never be processed without cryptographically verifying the signature header provided by the sender. Without this, a malicious actor could send a fake POST request claiming an SOS SMS was "delivered", suppressing the fallback safety mechanism.
- **Replay Attacks**: Webhook processors should verify the timestamp of the event (if provided) and ensure idempotency (processing the same event twice should not cause duplicate database updates).

## 5. Error Handling
- Webhook endpoints must return a `200 OK` as quickly as possible. Heavy processing (like AI moderation) should be offloaded to a background queue or Edge Function so the third-party service doesn't time out and retry the webhook.
