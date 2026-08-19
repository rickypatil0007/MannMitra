# MANNMITRA — REFLECTION SYSTEM

Document: `03-STUDENT/10-reflection-system.md`
Status: Production Specification
Version: 1.0
Audience: Students, Frontend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

The Reflection System helps students process their experiences, turning high-pressure moments or failures into learning opportunities. It encourages constructive thinking rather than self-criticism.

---

# 2. SCOPE

**In Scope (Phase 1):**
- Guided text prompts.
- Private saving of reflections.
- Ability to review past reflections.

**Future Scope:**
- AI-assisted reflection analysis (Mitra reading the reflection and offering a supportive perspective).

---

# 3. USER FLOW

```text
Student completes a major task (or is prompted by the Dashboard)
    ↓
Clicks "Reflect on this"
    ↓
System presents 2-3 guided questions
    ↓
Student writes short text responses
    ↓
Saves reflection privately
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-10-01: Guided Prompts
- MUST provide structured prompts. Examples:
  - "What felt difficult?"
  - "What helped you get through it?"
  - "What would you try differently next time?"
- MUST allow the student to write free-form text.

## STU-10-02: Storage & Review
- MUST save the reflection securely.
- MUST provide a gallery/list view of past reflections sorted by date.

---

# 5. UI / UX REQUIREMENTS

- **Visuals:** An uncluttered, distraction-free writing environment. Large typography, plenty of whitespace.
- **Tone:** The UI should feel like a private journal.
- **Buttons:** Use soft, secondary styling for "Save" to keep the visual focus on the text being written.

---

# 6. DATA REQUIREMENTS

**Required Data Entities:**
- `Reflection`:
  - `id` (UUID)
  - `user_id` (UUID)
  - `prompts_and_answers` (JSONB)
  - `created_at` (Timestamp)

---

# 7. API REQUIREMENTS

- **POST `/api/v1/reflections`**
- **GET `/api/v1/reflections`**

---

# 8. SECURITY & PRIVACY

- Reflections are `Restricted Data`. They contain highly personal thoughts.
- MUST NOT be used for targeted institutional analytics.
- Data MUST be encrypted at rest.

---

# 9. ANALYTICS

- `reflection_started`
- `reflection_completed`
- `reflection_abandoned`
