# Institution Endpoints

## 1. Purpose
Details the Custom Edge API routes utilized by University Deans and System Administrators to view macro-level analytics and manage the platform.

## 2. Scope
Covers aggregated dashboards, broadcast messaging, and role management.

## 3. Endpoints

### 3.1 Fetch Campus Analytics
- **Method**: `GET`
- **Path**: `/api/v1/institution/analytics/campus`
- **Auth Required**: Yes (`role: admin` or `role: faculty`)
- **Query Params**: `?date_range=last_30_days&department_id=uuid`
- **Behavior**: Connects using the `SERVICE_ROLE` key to query the protected `analytics.daily_cohort_stress` table. Returns highly aggregated, k-anonymized data suitable for charting.

### 3.2 Send Broadcast Message
- **Method**: `POST`
- **Path**: `/api/v1/institution/actions/broadcast`
- **Auth Required**: Yes (`role: admin`)
- **Payload**: `{ "target_cohort_id": "uuid", "message": "The wellness center is open late tonight.", "link": "https..." }`
- **Behavior**: Inserts a notification into the `notification_queue` for all students belonging to the target cohort.

### 3.3 Provision Staff Account
- **Method**: `POST`
- **Path**: `/api/v1/institution/staff`
- **Auth Required**: Yes (`role: admin`)
- **Payload**: `{ "email": "dr.smith@uni.edu", "assign_role": "counsellor" }`
- **Behavior**: Calls the Supabase Admin API to create a user account, injects the custom `role` into their `app_metadata` JWT claims, and sends an invitation email.

## 4. Security / Privacy
- The Analytics endpoint is the most dangerous read endpoint in the system. It must strictly validate the query parameters and ensure the SQL queries never `JOIN` against the raw `mitra_messages` or `personal_notes` tables.

## 5. Testing
- Attempt to call `/api/v1/institution/staff` using a JWT with a `counsellor` role and assert it throws a `403 Forbidden` (only `admin` can create new staff accounts).
