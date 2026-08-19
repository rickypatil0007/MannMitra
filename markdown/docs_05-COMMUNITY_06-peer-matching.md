# MANNMITRA — PEER MATCHING (COMMUNITY PERSPECTIVE)

Document: `05-COMMUNITY/06-peer-matching.md`
Status: Production Specification
Version: 1.0
Audience: Backend Engineers, Product
Platform: Backend

*Note: For the UX flow of this feature, refer to `03-STUDENT/16-peer-matching.md`.*

---

# 1. PURPOSE

This document outlines the backend mechanics and safety rules for transitioning students from the anonymous public community to 1-on-1 private messaging.

---

# 2. MATCHING ALGORITHM (MVP)

The MVP algorithm does not use complex ML. It is a deterministic scoring system based on the `PeerMatchPreference` table.

**Criteria:**
- **Institution/Campus:** (Must match exactly).
- **Major/Department:** (High weight).
- **Year of Study:** (High weight).
- **Support Goals:** (Medium weight - e.g., "Managing Academic Workload").

**Execution:**
- A scheduled cron job (e.g., weekly) runs the matching algorithm for all opted-in users.
- Generates up to 3 `ConnectionSuggestion` records per user.

---

# 3. SAFETY CONTROLS IN 1-ON-1 CHAT

When two users agree to match, a `PrivateChatChannel` is created.

- **No Images:** For MVP, private chats support text only to prevent abuse.
- **Reporting:** The same Report/Block mechanics from the public feed apply to private chats.
- **Unmatching:** A user MUST be able to "Unmatch" at any time, instantly destroying the connection and hiding the chat history.

---

# 4. PRIVACY

- Private chat messages are `Restricted Data` and encrypted at rest.
- The AI Orchestrator does NOT read peer-to-peer messages. Mitra is strictly a separate 1-on-1 companion.
