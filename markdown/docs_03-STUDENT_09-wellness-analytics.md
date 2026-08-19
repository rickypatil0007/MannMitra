# MANNMITRA — WELLNESS ANALYTICS

Document: `03-STUDENT/09-wellness-analytics.md`
Status: Production Specification
Version: 1.0
Audience: Students, Frontend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

Wellness Analytics provide the student with a high-level view of their self-reported wellbeing over time. The goal is to help them recognize patterns (e.g., "I always feel anxious on Thursdays") without turning their mental health into a rigid clinical dashboard.

---

# 2. SCOPE

**In Scope (Phase 2):**
- 7-day and 30-day stress trend lines.
- Most frequently reported moods.
- AI-generated plain-text summary of the past week/month.

**Future Scope:**
- Correlation analysis (e.g., identifying that late-night study sessions correlate with next-day anxiety).

---

# 3. USER FLOW

```text
Student navigates to Wellness section
    ↓
Views the Analytics tab
    ↓
Sees a clean, simple chart of their stress levels over the last 30 days
    ↓
Reads a short AI summary of the trends
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-09-01: Visual Trends
- MUST display a simple historical chart of `stress_level` over time.
- MUST aggregate mood data to show the top 3 moods for the selected period.

## STU-09-02: Text Summarization
- The system SHOULD use AI to generate a 1-2 sentence summary of the data (e.g., "Your stress levels peaked during midterms last week, but have steadily decreased since.").
- Summaries MUST NOT diagnose.

---

# 5. UI / UX REQUIREMENTS

- **Charts:** Must be extremely clean. No gridlines, minimal axes. Use smooth, curved lines rather than sharp, jagged edges.
- **Colors:** Use the soft sage and MannMitra green palette.
- **Accessibility:** Charts MUST include a text-based alternative (the AI summary serves this purpose well).

---

# 6. DATA REQUIREMENTS

- Queries `WellnessRecord` data grouped by date.

---

# 7. API REQUIREMENTS

- **GET `/api/v1/wellness/analytics`**
  - **Query Params:** `timeframe` (e.g., `7d`, `30d`)
  - **Response:** Aggregated data points and the AI summary text.

---

# 8. SECURITY & PRIVACY

- Analytics are strictly `Private Data` for the student's eyes only.

---

# 9. ANALYTICS

- `wellness_analytics_viewed`
- `wellness_analytics_timeframe_changed`
