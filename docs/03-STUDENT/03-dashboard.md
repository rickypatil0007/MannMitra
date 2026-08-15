# MANNMITRA — STUDENT DASHBOARD

Document: `03-STUDENT/03-dashboard.md`
Status: Production Specification
Version: 1.0
Audience: Students, Frontend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

The Dashboard is the student's primary landing experience after authentication. It provides immediate clarity on their current academic and wellness state without feeling overwhelming.

It must answer:
- What is most important today?
- How am I feeling?
- What are my upcoming responsibilities?
- How can Mitra help?

---

# 2. SCOPE

**In Scope (MVP):**
- Personalized greeting
- Primary focus card (highest priority task/event)
- Minimal wellness check-in (mood/stress)
- Condensed task/deadline view
- Mitra AI quick-start card

**Future Scope:**
- Advanced stress forecasting insights directly on dashboard
- Dynamic widgets based on time of day (e.g., Evening reflection prompt)

---

# 3. USER FLOW

```text
Authentication / App Open
    ↓
Dashboard Loads (skeleton state)
    ↓
Display Greeting + Context
    ↓
User reviews Today's Focus
    ↓
User performs quick Wellness Check
    ↓
User navigates to Planner, Mitra, or Specific Task
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-03-01: Greeting & Context
- The dashboard MUST display a personalized greeting (e.g., "Good morning, [Name]").
- The greeting MUST include a secondary contextual statement based on workload (e.g., "Let's make today manageable.").

## STU-03-02: Today's Focus Card
- The system MUST identify the single most important academic/wellness item for the day (e.g., an exam tomorrow, a high-priority overdue task).
- If no critical items exist, suggest a wellness action or light planning task.
- Must include a primary CTA routing to the relevant detail page.

## STU-03-03: Quick Wellness Check-in
- Must provide a frictionless way to record current mood/stress.
- Must use calm, non-clinical language ("How are you feeling today?").
- On submission, must save the record and subtly transition to a "Thank you" state.

## STU-03-04: Upcoming Tasks Summary
- MUST display a maximum of 3-5 upcoming tasks or deadlines.
- Must order by urgency/priority.
- Must provide a link to the full Planner.

## STU-03-05: Mitra Quick-Start
- Must provide a compact entry point to the Mitra AI chat.
- Should include 1-2 contextual prompt suggestions (e.g., "Help me plan my week").

---

# 5. UI / UX REQUIREMENTS

Follow the guidelines in `/docs/02-UX-UI/01-design-system.md`.

- **Visuals:** White background, minimal borders, subtle shadows. Do NOT use dense analytics styling.
- **Hierarchy:**
  1. Greeting
  2. Focus Card
  3. Wellness Check
  4. Tasks Summary
  5. Mitra Entry
- **Empty States:** If there are no tasks, show a calm illustration-free empty state (e.g., "Your schedule is clear. Enjoy the quiet.").
- **Loading:** Use soft skeleton loaders. Avoid blocking the whole page with a spinner.

---

# 6. DATA REQUIREMENTS

**Required Data Entities:**
- `User`: For name and basic preferences.
- `Task`/`Event`: For the Focus Card and Upcoming Tasks summary.
- `WellnessRecord`: To check if a check-in was already performed today.

---

# 7. API REQUIREMENTS

- **GET `/api/v1/dashboard/summary`**
  - **Purpose:** Fetches the aggregated dashboard data (focus item, tasks, check-in status) in a single request to minimize latency.
  - **Auth:** Bearer token required.

- **POST `/api/v1/wellness/check-in`**
  - **Purpose:** Submits the quick dashboard check-in.
  - **Payload:** `{ stressLevel: number, mood: string }`

---

# 8. SECURITY & PRIVACY

- **RLS:** All dashboard data queries MUST enforce Row-Level Security (RLS) to ensure students only retrieve their own tasks, events, and wellness data.
- **Privacy:** Wellness check-ins from the dashboard are strictly private (`Restricted Data`) and must never be exposed to the community feed.

---

# 9. ANALYTICS

- `dashboard_viewed`
- `dashboard_focus_card_clicked`
- `dashboard_wellness_checkin_completed`
- `dashboard_mitra_quick_prompt_clicked`

*Note: Do not log the actual wellness values submitted in analytics.*
