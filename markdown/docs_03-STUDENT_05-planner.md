# MANNMITRA — ACADEMIC PLANNER

Document: `03-STUDENT/05-planner.md`
Status: Production Specification
Version: 1.0
Audience: Students, Frontend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

The Academic Planner is a core organizational tool designed to help students manage their workload without feeling overwhelmed. It combines task management with deadline tracking and integrates closely with Mitra for AI-assisted planning.

---

# 2. SCOPE

**In Scope (MVP):**
- Task creation, editing, and deletion.
- Deadline and priority assignment.
- View by "Today", "Upcoming", and "Completed".
- Integration with AI-extracted tasks from Mitra conversations.

**Future Scope:**
- Syllabus parsing for automated task creation.
- Deep integration with external calendars (Google Calendar, Outlook).

---

# 3. USER FLOW

```text
Student navigates to Planner
    ↓
Views "Today's Tasks"
    ↓
Student clicks "Add Task"
    ↓
Enters title, deadline, and priority
    ↓
Saves Task
    ↓
Student marks task as complete
    ↓
Subtle success feedback; task moves to completed
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-05-01: Task Management
- MUST allow students to create tasks with a title (required), description (optional), deadline (optional), and priority (Low, Medium, High).
- MUST allow editing and deleting existing tasks.
- MUST allow marking tasks as complete/incomplete.

## STU-05-02: Planner Views
- **Today:** Tasks due today or overdue.
- **Upcoming:** Tasks due in the next 7 days.
- **All:** Paginated list of all active tasks.

## STU-05-03: AI Integration
- Tasks extracted by Mitra during a conversation MUST appear in the planner automatically (or require a single-click confirmation from the chat UI).

---

# 5. UI / UX REQUIREMENTS

- **Visuals:** Premium productivity tool aesthetic (e.g., Linear/Things). White surface, subtle borders, high contrast typography for task titles.
- **Task Row:** Should display Title, Deadline (formatted cleanly, e.g., "Tomorrow", "Oct 12"), Priority indicator (subtle dot or tag), and a completion checkbox.
- **Checkbox:** Use a smooth animation upon completion (subtle checkmark draw, slight fade out of the text). Do NOT use confetti or aggressive gamification.
- **Empty State:** "You have no tasks for today. Take a moment to rest or plan ahead."

---

# 6. DATA REQUIREMENTS

**Required Data Entities:**
- `Task`:
  - `id` (UUID)
  - `user_id` (UUID)
  - `title` (String)
  - `description` (Text)
  - `due_date` (Timestamp)
  - `priority` (Enum: LOW, MEDIUM, HIGH)
  - `status` (Enum: PENDING, COMPLETED)
  - `source` (Enum: MANUAL, AI_EXTRACTED)

---

# 7. API REQUIREMENTS

- **GET `/api/v1/tasks`** (Supports filtering by date range and status)
- **POST `/api/v1/tasks`**
- **PUT `/api/v1/tasks/:id`**
- **DELETE `/api/v1/tasks/:id`**

---

# 8. SECURITY & PRIVACY

- **RLS:** `Task` table MUST have RLS policies ensuring `user_id == auth.uid()`.
- Planner data is `Private Data` but not strictly restricted like medical data.

---

# 9. ANALYTICS

- `planner_task_created` (Include `source: manual|ai`)
- `planner_task_completed`
- `planner_task_deleted`
