# MANNMITRA — COMFORT LIBRARY

Document: `03-STUDENT/13-comfort-library.md`
Status: Production Specification
Version: 1.0
Audience: Students, Content Team, Frontend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

The Comfort Library is a curated collection of supportive, calming, and practical resources (articles, breathing exercises, lo-fi audio, grounding techniques). It serves as a passive support mechanism when a student doesn't want to talk to AI or a human, but just wants to decompress.

---

# 2. SCOPE

**In Scope (Phase 1):**
- Static or headless CMS-driven list of resources.
- Categorized by intent (e.g., "I need to calm down," "I need to focus").
- Embedded breathing exercise UI.

**Future Scope:**
- Personalized library recommendations based on the student's wellness history.

---

# 3. USER FLOW

```text
Student navigates to Wellness > Comfort Library
    ↓
Selects a category (e.g., "Grounding")
    ↓
Clicks a resource (e.g., "5-4-3-2-1 Technique")
    ↓
Reads/interacts with the content
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-13-01: Content Delivery
- The system MUST display a curated list of content items.
- Content MUST be easily updatable (e.g., via a CMS or dynamic database table) without a code deployment.

## STU-13-02: Interactive Breathing Tool
- MUST include a simple visual breathing tool (e.g., an expanding/contracting circle with instructions: "Inhale... Hold... Exhale").

---

# 5. UI / UX REQUIREMENTS

- **Visuals:** Highly visual, using soft, abstract imagery or color blocks. 
- **Cards:** Use large, touch-friendly cards.
- **Breathing Tool:** Must use smooth CSS animations (ease-in-out). Must respect `prefers-reduced-motion` (e.g., replace the animation with a simple text timer or fade).

---

# 6. DATA REQUIREMENTS

**Required Data Entities:**
- `LibraryResource`:
  - `id` (UUID)
  - `title` (String)
  - `category` (String)
  - `type` (Enum: ARTICLE, AUDIO, INTERACTIVE)
  - `content_url` or `body` (Text)

---

# 7. API REQUIREMENTS

- **GET `/api/v1/library/resources`** (Public or authenticated read-only access).

---

# 8. SECURITY & PRIVACY

- Viewing library resources is not highly sensitive, but analytics regarding *which* resources a user views should be treated as `Private Data`.

---

# 9. ANALYTICS

- `library_resource_viewed` (Include `resource_id`)
- `breathing_exercise_started`
