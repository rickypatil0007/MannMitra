# Counsellor Endpoints

## 1. Purpose
Details the Custom Edge API routes utilized by institutional counsellors and therapists to manage their caseload and view consented student data.

## 2. Scope
Covers data aggregation, appointment management, and consent verification.

## 3. Endpoints

### 3.1 Fetch Student Wellness Summary
- **Method**: `GET`
- **Path**: `/api/v1/counsellor/students/:student_id/summary`
- **Auth Required**: Yes (`role: counsellor`)
- **Behavior**:
  1. The server checks the `consent_logs` table.
  2. If active consent exists, the server queries the `stress_logs` and `tasks` tables for the past 30 days.
  3. The server invokes a lightweight LLM call to summarize the raw data into a readable paragraph (e.g., "Student has been struggling with high academic pressure for 2 weeks").
  4. Returns the AI-generated summary to the counsellor.

### 3.2 Request Data Access
- **Method**: `POST`
- **Path**: `/api/v1/counsellor/students/:student_id/consent/request`
- **Auth Required**: Yes (`role: counsellor`)
- **Payload**: `{ "scope": ["stress_trend", "planner_activity"], "duration_days": 14 }`
- **Behavior**: Creates a `PENDING` record in `consent_logs` and triggers an in-app notification to the student asking them to approve or deny the request.

### 3.3 Create Appointment
- **Method**: `POST`
- **Path**: `/api/v1/counsellor/appointments`
- **Auth Required**: Yes (`role: counsellor`)
- **Payload**: `{ "student_id": "uuid", "start_time": "...", "end_time": "...", "mode": "virtual" }`
- **Behavior**: Schedules the appointment and dispatches calendar invites via Email.

## 4. Security / Privacy
- If a counsellor attempts to call `/api/v1/counsellor/students/:student_id/summary` without an active consent log, the API MUST return a `403 Forbidden` and log the unauthorized access attempt in `audit_logs`.

## 5. Testing
- Create a test where the counsellor role tries to access an invalid `student_id`. Assert it returns a 404/403 rather than leaking that the student exists.
