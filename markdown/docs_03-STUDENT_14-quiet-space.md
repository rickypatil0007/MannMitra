# MANNMITRA — QUIET SPACE & PRIVACY MODE

Document: `03-STUDENT/14-quiet-space.md`
Status: Production Specification
Version: 1.0
Audience: Students, Frontend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

The Quiet Space feature operates in two distinct modes to provide students with peace:
1. **Physical Quiet Space Finder (Feature 08):** Helps students locate actual, physical quiet zones on campus when they need to escape noise or find concentration.
2. **Digital Quiet-Space / Privacy Mode (Feature 11):** A specialized UI mode that minimizes digital sensory input and mutes notifications.

---

# 2. SCOPE

**In Scope (Phase 2):**
- Digital: Toggleable full-screen mode stripping away all complex UI.
- Physical: A directory of known campus quiet spaces (e.g., library, empty classroom).

**Future Scope:**
- Physical: Real-time capacity/occupancy tracking if the institution provides an API.

---

# 3. USER FLOW: PHYSICAL SPACE FINDER

```text
Student is on campus and feels overwhelmed
    ↓
Navigates to Wellness > Find Quiet Space
    ↓
UI displays a list or map of designated quiet zones (Library, Wellness Room, Garden)
    ↓
Student views distance and typical noise level
    ↓
Student navigates to the physical location
```

---

# 4. USER FLOW: DIGITAL PRIVACY MODE

```text
Student is studying and getting distracted/stressed by notifications
    ↓
Clicks "Enter Quiet Space" in the UI
    ↓
UI transitions to a minimal, full-screen mode
    ↓
Community notifications and task alerts are temporarily muted
    ↓
Student exits when ready
```

---

# 5. FUNCTIONAL REQUIREMENTS

## STU-14-01: Physical Space Directory
- The system MUST maintain a list of quiet spaces configured per institution.
- Attributes: Location, Capacity, Noise Level (Low/Silent).

## STU-14-02: Digital Quiet Mode Activation
- MUST utilize the browser's Fullscreen API where supported.
- MUST suppress all application-level toasts/notifications while active.
- MUST display a single focal point (e.g., a breathing circle or soft gradient).

---

# 6. UI / UX REQUIREMENTS

- **Visuals (Digital Mode):** Extremely minimal. Dark or soft neutral background.
- **Visuals (Physical Mode):** Simple cards showing location name and an icon (e.g., a book for library, a leaf for garden). No complex maps for MVP, just clear text directions.

---

# 7. DATA REQUIREMENTS

**Required Data Entities:**
- `CampusSpace`:
  - `id` (UUID)
  - `institution_id` (UUID)
  - `name` (String)
  - `location_description` (String)
  - `type` (Enum: LIBRARY, GARDEN, CLASSROOM, WELLNESS_ROOM)

---

# 8. API REQUIREMENTS

- **GET `/api/v1/campus/spaces`**

---

# 9. SECURITY & PRIVACY

- Physical location data (if GPS is used in the future) MUST NOT be tracked continuously.

---

# 10. ANALYTICS

- `quiet_space_digital_entered`
- `quiet_space_physical_viewed`
