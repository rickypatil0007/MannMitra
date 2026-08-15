# Aggregated Analytics

## 1. Purpose
To define the mathematical, statistical, and data-engineering rules for how raw student data is transformed into the safe, aggregated metrics displayed on institutional dashboards.

## 2. Scope
Covers the ETL (Extract, Transform, Load) processes, real-time aggregation queries, and the specific metrics calculated by MannMitra.

## 3. Core Metrics

### A. Academic Pressure Index (API)
- **Calculation**: A weighted average of total planner tasks, proximity to deadlines, and self-reported stress levels related to academic categories.
- **Use**: Identifies if a specific course's workload is objectively heavier than institutional norms.

### B. Platform Utilization Rate
- **Calculation**: (DAU / Total Enrolled Students) * 100.
- **Use**: Proves ROI of the platform to the institution.

### C. SOS Trigger Frequency
- **Calculation**: Count of Level 2 escalations per 1,000 students per month.
- **Use**: A critical metric for institutional risk management and sizing the counselling staff.

### D. Burnout Indicator
- **Calculation**: Detection of high task-completion failure rates combined with "Very High" self-reported stress over a continuous 14-day period across a cohort.

## 4. Requirements
- Aggregation logic must run asynchronously to prevent slowing down the student-facing application.
- The logic must strictly exclude data marked by students as "Private Journal" or specific chat utterances. Only structured metadata (tags, categories, numeric scores) is aggregated.

## 5. Functional Behavior
- **Nightly Rollups**: A cron job runs at 2:00 AM local time to compute `DailyDepartmentAggregates` and store them in a reporting table.

## 6. Data Requirements
- Dedicated reporting schema in PostgreSQL (`analytics`).
- Tables: `daily_cohort_stress`, `weekly_campus_utilization`.

## 7. Security / Privacy
- The analytics database role has read-only access to the primary schema, and cannot read the `conversations` or `journal_entries` tables at all.

## 8. Edge Cases
- **Sparse Data**: In summer semesters where enrollment is low, the k-anonymity filters must still aggressively hide data if a cohort drops below the threshold.

## 9. Testing
- Verify the ETL script correctly ignores deleted accounts and opted-out users when calculating the API metric.
