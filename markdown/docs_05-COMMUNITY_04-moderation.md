# MANNMITRA — MODERATION

Document: `05-COMMUNITY/04-moderation.md`
Status: Production Specification
Version: 1.0
Audience: Backend Engineers, Security Engineers
Platform: Backend

---

# 1. PURPOSE

To ensure the community remains a safe, supportive space. Moderation in a mental health app cannot rely solely on user reports; it requires proactive, automated filtering.

---

# 2. AUTOMATED MODERATION (PRE-PUBLISH)

Before a post or comment is inserted into the database and broadcast to the feed, it MUST pass an automated check.

**Mechanism:**
1. Text is sent to an NLP filter (e.g., OpenAI Moderation API, or a fast local model).
2. Checks for: Hate speech, self-harm, harassment, explicit content.
3. If Flagged: The post is saved with `status: PENDING_REVIEW`. The user sees a soft message: "Your post is being reviewed by our team to ensure community safety."

---

# 3. HUMAN MODERATION (POST-PUBLISH)

For content that passes automated filters but is reported by users.

**Admin Dashboard:**
- Authorized moderators have access to an internal dashboard.
- They can view flagged posts.
- Actions: `APPROVE`, `DELETE`, `BAN_USER`.

---

# 4. SAFETY ESCALATION

If the automated filter detects severe intent (e.g., imminent self-harm):
- The post is blocked.
- The system immediately triggers the `CRISIS_RESPONSE_PROTOCOL` on the backend.
- The user's app transitions to the SOS screen (`03-STUDENT/20-sos.md`).

---

# 5. PRIVACY IN MODERATION

- Moderators viewing the content queue DO NOT see the user's real name by default.
- "Break Glass" procedure: Only senior admins can link a post to a real identity, and this action MUST generate an immutable Audit Log entry.
