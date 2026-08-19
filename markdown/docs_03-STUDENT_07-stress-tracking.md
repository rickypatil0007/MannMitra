# MANNMITRA — STRESS TRACKING

Document: `03-STUDENT/07-stress-tracking.md`
Status: Production Specification
Version: 1.0
Audience: Students, Frontend Engineers, Backend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

The Stress Tracking feature allows students to self-report their current stress levels and mood. It creates a historical record that helps the student recognize patterns in their wellbeing, while providing baseline data for the AI's contextual support and forecasting.

---

# 2. SCOPE

**In Scope (MVP):**
- Simple daily or ad-hoc check-in interface.
- 5-point scale for stress.
- Mood selection.
- Basic historical log view.

**Future Scope:**
- Integration with wearables (Apple Health, Google Fit) for physiological stress indicators.

---

# 3. USER FLOW

```text
Student is prompted via Dashboard (or navigates to Wellness)
    ↓
Selects a stress level (e.g., 1-5 scale)
    ↓
Selects a mood descriptor
    ↓
Submits the check-in
    ↓
System saves the record and provides a calm acknowledgment
    ↓
Record appears in the student's wellness history
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-07-01: Check-in Mechanism
- MUST allow the student to log their stress level (1 = Very Low, 5 = Very High).
- MUST allow the student to select a primary mood (e.g., Calm, Anxious, Exhausted, Focused).
- Optional: Allow a short text note attached to the check-in.

## STU-07-02: Safety Guardrails
- If a student consistently logs maximum stress (e.g., 5/5 for 3 consecutive days), the system MUST gently suggest human support or a conversation with Mitra.
- The system MUST NOT diagnose the student based on these inputs.

## STU-07-03: Historical Log
- MUST provide a list or simple calendar view showing past check-ins.

---

# 5. UI / UX REQUIREMENTS

- **Visuals:** Keep it extremely simple and non-clinical. Do NOT use alarming red colors for high stress. Use neutral tones or a soft gradient that doesn't imply failure.
- **Language:** Use supportive language. Instead of "Severe Stress," use "High Pressure."
- **Empty State:** "You haven't logged how you're feeling yet today."

---

# 6. DATA REQUIREMENTS

**Required Data Entities:**
- `WellnessRecord`:
  - `id` (UUID)
  - `user_id` (UUID)
  - `stress_level` (Integer 1-5)
  - `mood` (String)
  - `note` (Text, optional)
  - `created_at` (Timestamp)

---

# 7. API REQUIREMENTS

- **POST `/api/v1/wellness/records`**
- **GET `/api/v1/wellness/records`** (Supports pagination and date filtering)

---

# 8. SECURITY & PRIVACY

- **Privacy:** Stress tracking data is strictly `Restricted Data`.
- **Anonymization:** If used for institutional analytics, data MUST be aggregated and anonymized (e.g., "Average stress level in the Engineering department"). Individual records MUST NOT be visible to faculty.
- **RLS:** Only the user can read/write their own `WellnessRecord`s.

---

# 9. ANALYTICS

- `stress_checkin_completed`
- `stress_history_viewed`
