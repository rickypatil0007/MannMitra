# MANNMITRA — RATE LIMITING

Document: `12-API/03-rate-limiting.md`
Status: Production Specification
Version: 1.0
Audience: Backend Engineers, DevOps
Platform: System Architecture

---

# 1. PURPOSE

To prevent abuse, accidental DDoS from client loops, and to strictly control LLM API costs.

---

# 2. RATE LIMITING TIERS

Rate limits should be enforced at the Edge (e.g., Vercel KV / Upstash Redis) based on the authenticated `user_id` (or IP for unauthenticated routes).

### Tier 1: Standard API Routes (Fast)
- **Endpoints:** `/api/v1/tasks`, `/api/v1/wellness`
- **Limit:** 100 requests per minute per user.
- **Reason:** Standard usage.

### Tier 2: Community Write Routes (Moderate)
- **Endpoints:** `/api/v1/community/posts`
- **Limit:** 5 posts per hour per user.
- **Reason:** Prevents spamming the community feed and exhausting automated moderation quotas.

### Tier 3: AI Chat Generation (Strict)
- **Endpoints:** `/api/v1/chat/message`, `/api/v1/chat/audio`
- **Limit:** 30 messages per 10 minutes per user.
- **Reason:** Protects against massive OpenAI API billing spikes. 

### Tier 4: Sensitive Actions (Very Strict)
- **Endpoints:** `/api/v1/support/notify-contact`
- **Limit:** 3 per hour.
- **Reason:** Prevents SMS/Email spam via the platform.

---

# 3. CLIENT FEEDBACK

When a user hits a rate limit, the API MUST return a `429 Too Many Requests` status.
The frontend MUST catch this gracefully and display a calm message: "You're moving a bit fast. Please wait a moment before trying again." (Do not show scary technical errors).
