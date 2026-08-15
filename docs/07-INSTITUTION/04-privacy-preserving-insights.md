# Privacy-Preserving Insights

## 1. Purpose
To detail the specific technical and policy mechanisms MannMitra employs to guarantee that institutional insights can never be reverse-engineered to identify a specific student.

## 2. Scope
Applies to all data flowing from the Student Application (03-STUDENT) to the Institution Dashboards (07-INSTITUTION).

## 3. Core Mechanisms

### 3.1 k-Anonymity Threshold
- **Rule**: No data point is displayed if the underlying cohort size is less than `k=5`.
- **Implementation**: `HAVING COUNT(DISTINCT student_id) >= 5` is appended to all aggregate SQL queries.

### 3.2 Differential Privacy Noise (Optional/Future)
- For highly sensitive queries (e.g., exact counts of severe depression tags), the system may inject statistical noise (Laplace mechanism) so the institution knows the general trend but not the exact integer count, preventing differencing attacks.

### 3.3 Semantic Generalization
- Exact timestamps of stress reports are rounded to the nearest day or week.
- Specific assignment names mentioned in chats are generalized to "Academic Task" in the analytics pipeline unless they perfectly match an institutionally provided syllabus ID.

## 4. Requirements
- The application must clearly communicate to students exactly what is shared: "Your professors will never see your chats. They only see that '50 students in CS101 are feeling stressed this week'."
- Faculty must sign a Terms of Use agreeing not to attempt to de-anonymize data.

## 5. Security Architecture
- The frontend dashboard queries an intermediary Analytics API. This API does not have access to the raw transactional database. It only queries pre-aggregated materialized views.

## 6. Edge Cases
- **Small Seminars**: A thesis seminar with 4 students will never generate faculty insights. The professor will see "Data withheld for privacy."

## 7. Testing
- **Differencing Attack Test**: Attempt to query the stress level of a cohort of 6, then delete 1 student, and verify the query now returns 0 rows (blocked by k-anonymity).
