# MANNMITRA — AGGREGATED ANALYTICS

Document: `07-INSTITUTION/02-aggregated-analytics.md`
Status: Production Specification
Version: 1.0
Audience: Backend Engineers, Database Architects
Platform: Backend

---

# 1. PURPOSE

To define how the backend calculates the metrics displayed on the Institution Dashboard efficiently and securely, ensuring no PII leaks into the analytical pipeline.

---

# 2. IMPLEMENTATION STRATEGY

Generating live aggregations over thousands of `WellnessRecord` rows on every dashboard load is expensive and risks accidental data exposure if RLS fails.

**Materialized Views / Cron Jobs:**
- A nightly cron job runs a secure aggregation query.
- It groups data by `department`, `year`, and `date`.
- It averages the `stress_level`.
- It saves this non-PII data into a new table: `AggregatedInstitutionalMetrics`.

---

# 3. DATA MODEL

- `AggregatedInstitutionalMetrics`:
  - `id` (UUID)
  - `institution_id` (UUID)
  - `department` (String)
  - `date` (Date)
  - `average_stress` (Decimal)
  - `sample_size` (Integer)

---

# 4. K-ANONYMITY ENFORCEMENT

During the cron job execution:
```sql
IF count(user_id) < 10 THEN
  -- DO NOT INSERT THIS ROW INTO AggregatedInstitutionalMetrics
END IF;
```
This guarantees that faculty cannot query a specific niche cohort and deduce an individual's stress level.
