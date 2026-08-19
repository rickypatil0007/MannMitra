# MANNMITRA — INSTITUTION DASHBOARD

Document: `07-INSTITUTION/01-institution-dashboard.md`
Status: Production Specification
Version: 1.0
Audience: Faculty, Admins, Frontend Engineers
Platform: Desktop Web Application

---

# 1. PURPOSE

To provide university administration and faculty with a macro-level view of student wellbeing, enabling proactive institutional support without violating individual student privacy. (Supports Feature 18).

---

# 2. SCOPE

**In Scope (MVP):**
- Aggregated stress charts (Campus-wide or Department-wide).
- Peak stress period identification (correlating with exam schedules).
- High-level engagement metrics (e.g., "500 students used the quiet space this week").

**Out of Scope (Strictly Forbidden):**
- Identifying individual students who are stressed.
- Reading individual reflections or AI chats.

---

# 3. USER FLOW

```text
Professor/Admin logs in
    ↓
Views Institution Dashboard
    ↓
Sees a chart: "Computer Science Dept - Stress Levels"
    ↓
Notices a massive spike in "Very High" stress reports this week
    ↓
Admin decides to extend a major project deadline across the department
```

---

# 4. FUNCTIONAL REQUIREMENTS

## INS-01-01: Aggregation Engine
- All metrics displayed on this dashboard MUST be aggregated.
- **K-Anonymity Rule:** If a filter (e.g., "3rd Year Architecture Students") results in fewer than N students (e.g., 10), the data MUST be hidden to prevent individuals from being identified by process of elimination.

## INS-01-02: Key Metrics
- Average reported stress level (rolling 7 days).
- Top 3 reported moods.
- Total SOS activations (anonymized, for campus safety auditing).

---

# 5. UI / UX

- **Visuals:** Enterprise SaaS layout. Clean data visualization (Line charts, Heatmaps).
- **Tone:** Objective and data-driven.

---

# 6. API ENDPOINTS

- `GET /api/v1/institution/metrics/stress` (Requires Admin/Faculty role).
