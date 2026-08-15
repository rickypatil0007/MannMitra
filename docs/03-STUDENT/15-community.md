# MANNMITRA — COMMUNITY FEED

Document: `03-STUDENT/15-community.md`
Status: Production Specification
Version: 1.0
Audience: Students, Frontend Engineers, Backend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

The Community Feed allows students to share thoughts, ask for advice, and realize they are not alone in their struggles. It prioritizes emotional safety and anonymity over viral engagement.

---

# 2. SCOPE

**In Scope (MVP):**
- Anonymous posting (via a pseudonymous identity).
- Text-only posts (no images/videos to simplify moderation).
- Upvoting ("Relatable" or "Support" reactions).
- Commenting (also anonymous).
- Reporting and blocking mechanisms.

**Future Scope:**
- Categorized feeds (e.g., "Academics", "Mental Health", "Social").

---

# 3. USER FLOW

```text
Student navigates to Community
    ↓
Views a chronologically or algorithmically safe-sorted feed of posts
    ↓
Clicks "New Post"
    ↓
Writes text and submits
    ↓
Post appears in the feed anonymously (e.g., "Student #482" or an alias)
    ↓
Other students can click a "Support" button or leave an anonymous comment
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-15-01: Anonymity
- The UI MUST NEVER expose a student's real name, email, or profile picture in the Community section.
- The system SHOULD generate a stable or rotating anonymous alias (e.g., "Blue Fox") for the user.

## STU-15-02: Posting & Interacting
- MUST support creating posts with a character limit (e.g., 500 characters).
- MUST support a single positive reaction type (e.g., "Send Support" or a heart icon). Do not use downvotes.
- MUST support nested comments (1 level deep is sufficient for MVP).

## STU-15-03: Safety Controls
- MUST provide a "Report" button on every post and comment.
- MUST provide a "Block User" button to hide all future content from that anonymous author.
- If a post receives multiple reports, it MUST be auto-hidden pending moderation.

---

# 5. UI / UX REQUIREMENTS

- **Visuals:** Clean, card-based feed. Generous padding.
- **Typography:** Ensure readability.
- **Empty State (New Feed):** "Be the first to share what's on your mind."

---

# 6. DATA REQUIREMENTS

**Required Data Entities:**
- `CommunityPost`:
  - `id` (UUID)
  - `author_id` (UUID - kept secret by API)
  - `anonymous_alias` (String)
  - `content` (Text)
  - `support_count` (Integer)
  - `created_at` (Timestamp)
- `CommunityComment` (Similar to Post, with `post_id`)
- `Report` / `Block` tables.

---

# 7. API REQUIREMENTS

- **GET `/api/v1/community/posts`**
- **POST `/api/v1/community/posts`**
- **POST `/api/v1/community/posts/:id/support`**
- **POST `/api/v1/community/posts/:id/report`**

---

# 8. SECURITY & PRIVACY

- **Backend Anonymity:** The API responses MUST NOT include the `author_id` or any PII. Only the `anonymous_alias` should be sent to the client.
- **Moderation Access:** Only authorized moderators can link an anonymous post back to a real user in the event of a severe safety violation.

---

# 9. ANALYTICS

- `community_feed_viewed`
- `community_post_created`
- `community_post_supported`
- `community_post_reported` (Critical metric)
