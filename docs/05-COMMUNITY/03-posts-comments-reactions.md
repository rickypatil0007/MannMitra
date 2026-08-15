# MANNMITRA — POSTS, COMMENTS, & REACTIONS

Document: `05-COMMUNITY/03-posts-comments-reactions.md`
Status: Production Specification
Version: 1.0
Audience: Frontend Engineers, Backend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

To define the interaction mechanics of the community feed. The interactions are intentionally limited to prevent toxicity and social comparison.

---

# 2. POSTS

- **Format:** Text-only for MVP. No images, no videos. This drastically reduces the moderation burden and prevents graphic content.
- **Length:** Maximum 500 characters. Encourages brevity and prevents the feed from becoming overwhelming.
- **Visibility:** Posts are visible to all authenticated students within the same deployment/institution (depending on configuration).

---

# 3. COMMENTS

- **Structure:** 1-level deep threading. A post can have comments, but comments cannot have sub-comments. This prevents deep arguments.
- **Identity:** Comments use the same anonymous alias as posts. If a user comments on their own post, the UI should indicate "Original Poster" or highlight their alias.

---

# 4. REACTIONS

- **Type:** A single positive reaction (e.g., "Send Support", "Relatable").
- **No Downvotes:** Downvotes create a toxic environment. If a post is bad, it should be Reported.
- **Display:** The UI should display the total support count. Do not display views or "impressions."

---

# 5. UI / UX REQUIREMENTS

- **Interactions:** Liking a post should use a subtle, pleasant animation (e.g., a heart filling in). Do not use aggressive gamified popups.
- **Composer:** The text input for comments should be inline and minimal.

---

# 6. API ENDPOINTS

- `POST /api/v1/community/posts` (Create Post)
- `POST /api/v1/community/posts/:id/comments` (Add Comment)
- `POST /api/v1/community/posts/:id/reactions` (Toggle Reaction)
