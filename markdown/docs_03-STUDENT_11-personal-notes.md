# MANNMITRA — PERSONAL NOTES

Document: `03-STUDENT/11-personal-notes.md`
Status: Production Specification
Version: 1.0
Audience: Students, Frontend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

Personal Notes provide a completely unstructured, private space for students to write down their thoughts, vent, or brain-dump. Unlike the Reflection System, Notes do not have guided prompts.

---

# 2. SCOPE

**In Scope (Phase 1):**
- Create, edit, and delete text notes.
- Secure, encrypted storage.
- Auto-save functionality.

**Future Scope:**
- Rich text formatting.
- Ability to tag notes.

---

# 3. USER FLOW

```text
Student navigates to Wellness > Notes
    ↓
Clicks "New Note"
    ↓
Types freely (auto-saves in background)
    ↓
Closes note
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-11-01: Note Management
- MUST allow creation of plain-text notes.
- MUST implement auto-save to prevent data loss.
- MUST allow the student to delete a note permanently.

## STU-11-02: Privacy Guarantees
- Notes are strictly private. The UI MUST clearly state: "Your notes are private."

---

# 5. UI / UX REQUIREMENTS

- **Visuals:** Minimalist text editor. No formatting toolbar in MVP to keep it simple.
- **Empty State:** "Your private space to think. Create your first note."
- **Typography:** Use a comfortable reading font (e.g., Inter, size 16px+).

---

# 6. DATA REQUIREMENTS

**Required Data Entities:**
- `Note`:
  - `id` (UUID)
  - `user_id` (UUID)
  - `title` (String, optional - can default to first few words)
  - `content` (Text)
  - `updated_at` (Timestamp)

---

# 7. API REQUIREMENTS

- **GET `/api/v1/notes`**
- **POST `/api/v1/notes`**
- **PUT `/api/v1/notes/:id`**
- **DELETE `/api/v1/notes/:id`**

---

# 8. SECURITY & PRIVACY

- Notes are `Restricted Data`.
- Data MUST be encrypted at rest in the database.
- RLS MUST be strictly enforced (`user_id == auth.uid()`).

---

# 9. ANALYTICS

- `note_created`
- `note_deleted`
*(Never log note content or titles)*
