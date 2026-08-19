# MANNMITRA — STRESS FORECAST

Document: `03-STUDENT/08-stress-forecast.md`
Status: Production Specification
Version: 1.0
Audience: Students, AI Engineers, Frontend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

The Stress Forecast is a preventive feature that analyzes a student's upcoming academic workload (deadlines, exams) against their historical stress patterns to predict periods of high pressure. It aims to help students prepare rather than react.

---

# 2. SCOPE

**In Scope (Phase 2):**
- Simple text-based forecast summary.
- Flagging specific upcoming days/weeks as "High Workload" or "High Pressure."
- Mitra proactively suggesting planning sessions for forecasted high-stress periods.

**Future Scope:**
- Advanced ML models trained on anonymized cohort data to predict stress spikes before tasks are even assigned.

---

# 3. USER FLOW

```text
Student views Planner or Wellness dashboard
    ↓
System displays a calm forecast notice (e.g., "Next week looks heavier than usual.")
    ↓
Student clicks for details
    ↓
System highlights the 3 deadlines causing the spike
    ↓
Provides CTA: "Plan with Mitra" to break down the tasks
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-08-01: Forecast Generation
- The system MUST calculate workload density by summing task priorities and deadlines within a rolling 14-day window.
- The system MUST overlay this with the student's historical stress data (e.g., if a student usually reports high stress when they have >3 tasks due).

## STU-08-02: Presentation
- The forecast MUST be presented as an *estimate* or *possibility*, not a medical prediction.
- Language MUST be supportive (e.g., "You have a lot on your plate next week," NOT "You will experience severe stress next week.").

## STU-08-03: Actionability
- A forecast MUST ALWAYS be accompanied by a practical action (e.g., "Break down tasks," "Schedule quiet time").

---

# 5. UI / UX REQUIREMENTS

- **Visuals:** Should appear as a subtle insight card on the Dashboard or Wellness page. Use a soft background color.
- **Avoid:** Do not use line charts projecting stress into the future, as this can cause anticipatory anxiety. Stick to text-based insights.

---

# 6. DATA REQUIREMENTS

- Relies on `Task`, `Event`, and `WellnessRecord` tables.
- Calculation is performed server-side or by the AI Orchestrator.

---

# 7. API REQUIREMENTS

- **GET `/api/v1/wellness/forecast`**
  - **Purpose:** Returns the calculated workload density and a generated text insight for the next 7-14 days.

---

# 8. SECURITY & PRIVACY

- Forecasts are generated using `Private Data`. They MUST NOT be shared with the institution or peers.

---

# 9. ANALYTICS

- `stress_forecast_viewed`
- `stress_forecast_action_taken`
