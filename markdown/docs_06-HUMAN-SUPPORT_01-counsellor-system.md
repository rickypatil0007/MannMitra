# Counsellor System

## 1. Purpose
The Counsellor System serves as the human bridge within the MannMitra platform. It allows trained professionals to connect with students who need support beyond automated AI capabilities, providing a safe, managed, and structured environment for professional mental health support.

## 2. Scope
This system covers the onboarding, role management, dashboard interface, and communication tools available to registered counsellors within the platform. It does not replace professional therapy outside the institution but facilitates accessible early intervention.

## 3. Actors
- **Student**: Requests support or is matched with a counsellor.
- **Counsellor**: Manages cases, views permitted student wellness data, and communicates securely.
- **Platform Admin**: Verifies and provisions counsellor accounts.

## 4. Requirements
- Counsellors must be verified by the institution before account activation.
- The system must provide a secure, isolated dashboard for counsellors (`/counsellor/dashboard`).
- Counsellors can only access student wellness data if the student has explicitly granted consent.
- All communications between students and counsellors must be encrypted and logged for audit purposes, adhering to local privacy laws.

## 5. User Flow
1. **Verification**: Counsellor is invited by the institution and completes identity/credential verification.
2. **Dashboard Access**: Counsellor logs in and views their active caseload, pending requests, and upcoming appointments.
3. **Case Acceptance**: A student requests support; the counsellor reviews the high-level reason and accepts the case.
4. **Interaction**: Counsellor and student communicate via secure messaging or scheduled video/in-person appointments.
5. **Case Closure**: Upon resolution, the case is closed, but records are retained securely according to policy.

## 6. UI / UX Behavior
- **Visuals**: Clean, professional interface with a calming color palette (White and Deep Green).
- **Dashboard Cards**: Quick glance cards for "New Requests", "Active Students", "High Priority Alerts".
- **Data Privacy**: Blurry or hidden fields for sensitive student data until explicit access is verified.

## 7. Functional Behavior
- **Status Toggles**: Counsellors can toggle their status (Available, Busy, Offline) which updates the student-facing directory in real-time.
- **Notes**: Private case notes can be added by the counsellor, which are entirely invisible to the student and institution.

## 8. Data Requirements
- `CounsellorProfile`: Bio, credentials, availability schedule, specialization.
- `Caseload`: Mapping of `counsellor_id` to `student_id` with a `status` (active, pending, closed).

## 9. Security / Privacy
- **Strict Isolation**: Institutional faculty cannot view counsellor-student messages or case notes.
- **Consent Gate**: A "Consent Check" middleware must validate student permission before loading detailed wellness trends for a counsellor.

## 10. Error Handling
- If a counsellor tries to access a revoked profile, display: "The student has restricted access to this profile. You may request access directly via secure message."

## 11. Edge Cases
- **Counsellor Unavailable**: If a student requests a specific counsellor who goes offline, the system must prompt the student to select another available professional or fall back to a general queue.

## 12. Testing
- Verify that a counsellor cannot load `/student/wellness-summary` for a student who has not granted consent.
- Verify that case notes are encrypted at rest.
