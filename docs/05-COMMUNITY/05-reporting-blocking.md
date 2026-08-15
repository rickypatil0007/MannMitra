# MANNMITRA — REPORTING & BLOCKING

Document: `05-COMMUNITY/05-reporting-blocking.md`
Status: Production Specification
Version: 1.0
Audience: Frontend Engineers, Backend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

To give students control over their own experience and the ability to flag inappropriate content that evaded automated moderation.

---

# 2. REPORTING WORKFLOW

**Trigger:** A "Report" option must be accessible on every post and comment (usually via a '...' menu).
**Flow:**
1. User clicks Report.
2. Selects a reason (e.g., Spam, Harassment, Inappropriate, Triggering).
3. Post is immediately hidden from the reporting user's feed.
4. Backend increments the `report_count` for that post.

**Auto-Hide Threshold:** If a post receives a certain number of unique reports (e.g., 3), it is globally hidden (`status: PENDING_REVIEW`) until a human moderator approves it.

---

# 3. BLOCKING WORKFLOW

**Trigger:** A "Block User" option next to Report.
**Flow:**
1. User clicks Block.
2. Confirmation: "You will no longer see posts or comments from this user."
3. Backend creates a record in the `UserBlock` table mapping the reporting user to the blocked user's internal ID.

**Query Filter:** The API serving the community feed MUST filter out any posts or comments authored by IDs in the requesting user's `UserBlock` list.

---

# 4. UI / UX

- The report/block actions must be frictionless.
- Acknowledge the action calmly: "Thanks for looking out for the community. We've hidden this post and our team will review it."
