# MANNMITRA — SENIOR STORIES

Document: `03-STUDENT/17-senior-stories.md`
Status: Production Specification
Version: 1.0
Audience: Students, Content Team, Frontend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

Senior Stories provide students with relatable, lived experiences from alumni or senior students who have successfully navigated similar academic and emotional challenges. It aims to reduce the stigma of failure and normalize academic struggle.

---

# 2. SCOPE

**In Scope (MVP):**
- Curated, editorial-style articles.
- Filterable by topic (e.g., "Failing a class," "Imposter syndrome," "Burnout").

**Future Scope:**
- Video stories.
- Ability for current seniors to submit their stories for moderation.

---

# 3. USER FLOW

```text
Student navigates to Community > Senior Stories
    ↓
Views a clean grid of story cards
    ↓
Clicks on a story about "Dealing with Exam Failure"
    ↓
Reads a deeply personal, moderated account from an alum
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-17-01: Story Display
- MUST display the title, author (or anonymous identifier), and a short excerpt.
- MUST categorize stories by relevant topics.

## STU-17-02: Content Management
- For MVP, stories are managed by administrators (headless CMS or database). They are NOT user-generated content that goes live immediately.

---

# 5. UI / UX REQUIREMENTS

- **Visuals:** Editorial design. Use large serif or premium sans-serif typography for the body text. Lots of whitespace to make reading comfortable.
- **Images:** Use soft, abstract imagery if photos are unavailable. Avoid cheesy stock photos of happy students.

---

# 6. DATA REQUIREMENTS

**Required Data Entities:**
- `SeniorStory`:
  - `id` (UUID)
  - `title` (String)
  - `author_name` (String - can be "Alumnus '23")
  - `content` (Text)
  - `category` (String)

---

# 7. API REQUIREMENTS

- **GET `/api/v1/community/stories`**
- **GET `/api/v1/community/stories/:id`**

---

# 8. SECURITY & PRIVACY

- Stories are `Public Data` within the authenticated application. No special RLS needed beyond basic read-access for authenticated users.

---

# 9. ANALYTICS

- `senior_story_viewed` (Include `story_id`)
