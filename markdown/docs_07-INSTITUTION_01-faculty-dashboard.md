# Faculty Dashboard

## 1. Purpose
Provides professors and teaching staff with an overview of academic stress patterns related specifically to the cohorts or classes they teach, without exposing individual student identities or personal mental health data.

## 2. Scope
Covers the UI, data aggregation logic, and insights presented to faculty members who log into the MannMitra platform.

## 3. Actors
- **Faculty / Professor**: Views aggregated class-level insights.
- **System**: Aggregates and anonymizes data from student interactions and planners.

## 4. Requirements
- The dashboard must NEVER display individual student names, IDs, or specific chat logs.
- Data must only be displayed if a minimum threshold of students is met (e.g., at least 5 students in a class must report data for it to be visible) to prevent de-anonymization via deduction (k-anonymity).
- The dashboard focuses on *academic* pressure (e.g., "Assignment 3 is causing high stress") rather than *personal* issues.

## 5. User Flow
1. **Login**: Faculty logs in via SSO.
2. **Overview**: Views a high-level summary of their current courses.
3. **Course Drill-down**: Selects "CS 301" and views a timeline of aggregate stress levels mapped against the syllabus schedule.
4. **Insight Review**: Reviews an AI-generated insight: "70% of students in CS 301 who use the planner have scheduled an all-nighter for the upcoming mid-term."

## 6. UI / UX Behavior
- **Visuals**: Professional, data-heavy but clean. Utilizes the White and Deep Green palette. Avoids alarming colors (like bright red) unless an institutional threshold is breached.
- **Charts**: Smooth area charts for stress trends, bar charts for workload distribution.

## 7. Functional Behavior
- **Data Filtering**: Faculty can filter by week, month, or specific assignment deadlines.
- **Export**: Ability to export anonymized aggregate PDF reports for departmental review.

## 8. Data Requirements
- Aggregation query joining `User` (filtered by cohort), `StressRecord`, and `PlannerTask`.
- `FacultyProfile` mapping professors to specific course cohorts.

## 9. Security / Privacy
- **Hard Constraint**: The API endpoint serving this dashboard must group by cohort and return averages/counts. It must explicitly strip all UUIDs and PII at the database level before responding.

## 10. Error Handling
- If the k-anonymity threshold is not met, the UI displays: "Insufficient data to display trends for this cohort while preserving student privacy."

## 11. Testing
- Verify the k-anonymity rule: Create 4 student records with high stress for a class and assert the API returns an empty/insufficient data response. Add a 5th record and assert the aggregate data appears.
