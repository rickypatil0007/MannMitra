# Institution Dashboard

## 1. Purpose
Provides university administrators, deans, and the head of student welfare with a macro-level view of the entire institution's mental wellness and academic stress landscape.

## 2. Scope
This is the highest level of data aggregation in MannMitra. It tracks systemic issues across departments, years, and campuses, facilitating large-scale policy decisions.

## 3. Actors
- **Institution Admin / Dean**: Analyzes macro trends and allocates resources.

## 4. Requirements
- Must provide cross-departmental comparisons (e.g., Engineering vs. Arts stress levels).
- Must track the utilization rate of the MannMitra platform itself (e.g., active users, number of SOS triggers per month).
- Must identify temporal hotspots (e.g., systemic burnout detected in Week 8 of the semester).

## 5. User Flow
1. **Access**: Admin logs into the portal.
2. **Macro View**: Views the "Campus Health Score" and weekly platform engagement metrics.
3. **Department Analysis**: Clicks into the "Engineering Dept" to see why aggregate stress spiked.
4. **Action Planning**: Uses insights to recommend a "reading week" or deploy extra counselling resources.

## 6. UI / UX Behavior
- **Complex Visualizations**: Heatmaps of stress across the academic calendar, bubble charts comparing department workloads.
- **Executive Summary**: An AI-generated weekly text summary summarizing the massive data set into 3 bullet points for busy administrators.

## 7. Functional Behavior
- **Predictive Alerts**: The system flags future calendar weeks that are predicted to cause severe systemic stress based on historical data and overlapping departmental deadlines.

## 8. Data Requirements
- Campus-wide aggregate views materialized nightly to ensure fast dashboard load times.
- Entities: `MaterializedCampusStats`, `DepartmentAggregate`, `SystemicAlerts`.

## 9. Security / Privacy
- Same strict k-anonymity rules as the Faculty dashboard, but applied at a much larger scale. Zero access to individual student records, chat logs, or personal diaries.

## 10. Error Handling
- Timeout fallbacks: If the real-time aggregate query takes >5 seconds, fallback to the nightly materialized view and show a "Data as of [Date]" badge.

## 11. Testing
- Test the performance of the aggregation queries across a mocked dataset of 10,000 students. Ensure the dashboard loads in under 2 seconds.
