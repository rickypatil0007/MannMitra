# MANNMITRA — AI PLANNING ASSISTANCE

Document: `04-AI/07-ai-planning.md`
Status: Production Specification
Version: 1.0
Audience: AI Engineers, Backend Engineers
Platform: Backend AI Service

---

# 1. PURPOSE

To help students break down overwhelming workloads into manageable steps. This goes beyond simple task extraction by actively suggesting schedules and sub-tasks based on the student's available time and stress levels.

---

# 2. CAPABILITIES

- **Task Decomposition:** Breaking a large task ("Write History Essay") into smaller chunks ("Outline", "Draft Introduction", etc.).
- **Workload Balancing:** If the user has 3 exams in one week, suggesting they start studying for the hardest one earlier.
- **Contextual Awareness:** The AI is provided with the user's existing calendar and tasks for the next 7 days, so it doesn't suggest scheduling a study session during an existing class.

---

# 3. PROMPT ARCHITECTURE

When the Orchestrator identifies `PLANNING` intent, it uses a specific system prompt extension:

> "You are helping the student plan. You have access to their calendar for the next 7 days. Do not suggest completing more than 3 major tasks in a single day. If they seem overwhelmed, suggest breaking tasks down rather than working longer hours."

---

# 4. REQUIRED TOOLS

- `get_upcoming_schedule(days: integer)`: Fetches tasks and events to inject into context.
- `create_multiple_tasks(tasks: array)`: Allows the AI to save an entire study plan at once.

---

# 5. SAFETY & BOUNDARIES

- The AI MUST NOT act as an academic advisor (e.g., telling a student to drop a class).
- If the student expresses that the workload is completely unmanageable and causing severe distress, the AI MUST suggest human support rather than just making a color-coded schedule.
