# MANNMITRA — SENIOR / ALUMNI CONTENT

Document: `05-COMMUNITY/08-senior-alumni-content.md`
Status: Production Specification
Version: 1.0
Audience: Content Team, Product
Platform: Backend

*Note: For the student-facing UX, refer to `03-STUDENT/17-senior-stories.md`.*

---

# 1. PURPOSE

To define the submission and moderation process for Senior and Alumni success/failure stories (Feature 19 & 25).

---

# 2. WORKFLOW

1. **Submission:** Alumni submit stories via a secure web form. The form prompts them to focus on overcoming setbacks (e.g., "Tell us about a time you failed academically and how you recovered").
2. **Moderation Queue:** The story enters a `PENDING_REVIEW` state.
3. **Verification:** The administration optionally verifies the alumnus status.
4. **Publishing:** An admin assigns relevant tags (e.g., "Placement", "Backlogs") and publishes the story to the student feed.

---

# 3. CONTENT GUIDELINES

- **Focus on the Struggle:** Stories that say "I studied hard and got into Google" are rejected. Stories must normalize failure and anxiety.
- **Anonymity Option:** Alumni MUST have the option to publish their story completely anonymously or with partial identifiers (e.g., "Computer Science Alum '23").

---

# 4. DATA MODEL

- `SeniorStory`
  - `id` (UUID)
  - `status` (Enum: DRAFT, PENDING, PUBLISHED)
  - `title` (String)
  - `content` (Text)
  - `tags` (String Array)
  - `is_anonymous` (Boolean)
