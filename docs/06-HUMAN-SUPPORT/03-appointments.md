# Appointments

## 1. Purpose
To manage the scheduling, modification, and tracking of one-on-one sessions (virtual or in-person) between students and counsellors.

## 2. Scope
Includes calendar integration, availability management for counsellors, booking interfaces for students, and automated reminders.

## 3. Actors
- **Student**: Books, reschedules, or cancels appointments.
- **Counsellor**: Sets availability slots, approves/declines bookings.
- **System**: Sends notifications and reminders.

## 4. Requirements
- Counsellors must be able to define their recurring availability (e.g., Mon-Wed 10 AM - 2 PM).
- The system must handle time zone conversions if the institution supports remote learning across regions.
- Reminders must be sent 24 hours and 1 hour before the appointment.

## 5. User Flow
1. **Browsing**: Student selects a counsellor and views their calendar slots.
2. **Booking**: Student selects an open slot, chooses the format (Online/In-person), and confirms.
3. **Approval**: Counsellor receives the request and confirms (or it auto-confirms based on counsellor settings).
4. **Reminders**: Both parties receive push/email notifications prior to the session.
5. **Execution**: The session occurs (if online, a secure meeting link is generated and displayed).

## 6. UI / UX Behavior
- **Calendar View**: Visual grid representation of available slots, ensuring mobile responsiveness (e.g., a horizontal scrolling date picker).
- **Confirmation State**: A calming success animation upon booking to reduce booking anxiety.

## 7. Data Requirements
- `Appointment` entity: `id`, `student_id`, `counsellor_id`, `start_time`, `end_time`, `status` (scheduled, completed, cancelled, no-show), `meeting_link`.
- `Availability` entity for counsellors to block out times.

## 8. Security / Privacy
- The appointment schedule of a student is private and cannot be viewed by peers or faculty.

## 9. Error Handling
- Double-booking prevention: If a slot is taken during the booking process, gracefully inform the user and refresh the available slots immediately.

## 10. Testing
- Test the concurrency of two students attempting to book the exact same slot simultaneously. The database transaction must serialize and reject one gracefully.
