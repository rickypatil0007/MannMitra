# MANNMITRA — CALENDAR

Document: `03-STUDENT/06-calendar.md`
Status: Production Specification
Version: 1.0
Audience: Students, Frontend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

The Calendar provides a macro-level view of the student's academic workload. It works in tandem with the Planner to visualize deadlines, exams, and high-pressure periods, helping students prevent overwhelming bottlenecks.

---

# 2. SCOPE

**In Scope (MVP):**
- Monthly and Weekly visual grid.
- Display of tasks with deadlines.
- Display of specific calendar events (e.g., Exams, Classes).
- Visual indication of workload density.

**Future Scope:**
- Two-way sync with Google Calendar/iCal.

---

# 3. USER FLOW

```text
Student navigates to Planner -> Calendar View
    ↓
Views current month
    ↓
Identifies days with multiple deadlines (indicated by workload density)
    ↓
Clicks a specific date to view the day's agenda
    ↓
Adds a new event or task for that date
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-06-01: Calendar Views
- MUST provide a Month view (default) and a Week view.
- MUST allow navigation between previous and future months/weeks.

## STU-06-02: Event & Task Display
- Tasks with a `due_date` MUST appear on the calendar.
- Standalone Events (e.g., "Final Exam") MUST appear on the calendar.
- Clicking an item MUST open a detailed view/edit modal.

## STU-06-03: Workload Density Indicator
- Days with a high volume of tasks/events MUST have a subtle visual indicator (e.g., a slightly shaded background or a dot indicator) to warn the student of upcoming pressure without causing panic.

---

# 5. UI / UX REQUIREMENTS

- **Visuals:** Clean, minimal grid. Do NOT use heavy borders for the grid lines; use very subtle grays (`#E7ECE8`).
- **Indicators:** Use MannMitra green selectively. Do not color every event differently like a chaotic Google Calendar. Use a unified, calm color scheme.
- **Interactions:** Clicking a date should open a side-panel or clean modal showing the agenda for that day, rather than navigating to a completely new page.

---

# 6. DATA REQUIREMENTS

**Required Data Entities:**
- `Event`:
  - `id` (UUID)
  - `user_id` (UUID)
  - `title` (String)
  - `start_time` (Timestamp)
  - `end_time` (Timestamp)
  - `type` (Enum: CLASS, EXAM, PERSONAL, OTHER)

*(Tasks are queried from the Task table using `due_date`)*

---

# 7. API REQUIREMENTS

- **GET `/api/v1/calendar/events`**
  - **Query Params:** `start_date`, `end_date`
  - **Purpose:** Fetches both Tasks and Events within the bounding box of the calendar view.
- **POST `/api/v1/calendar/events`**
- **PUT `/api/v1/calendar/events/:id`**
- **DELETE `/api/v1/calendar/events/:id`**

---

# 8. SECURITY & PRIVACY

- **RLS:** Strict RLS enforcement on the `Event` table (`user_id == auth.uid()`).
- Calendar data is `Private Data`.

---

# 9. ANALYTICS

- `calendar_viewed`
- `calendar_event_created`
- `calendar_view_changed` (month/week)
