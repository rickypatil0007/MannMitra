# Trusted Contacts

## 1. Purpose
Provides students with a secure mechanism to nominate and manage individuals (friends, family members, mentors) who can be contacted in case of emotional distress or emergency.

## 2. Scope
This module handles the addition, verification, prioritization, and management of trusted contacts. It acts as the routing logic when a student triggers the SOS system.

## 3. Actors
- **Student**: Adds and manages their trusted contacts.
- **Trusted Contact**: Receives notifications when the student triggers an alert.

## 4. Requirements
- A student can add up to 3 trusted contacts.
- Contacts must have a clear priority order (Primary, Secondary, Tertiary).
- Adding a contact requires the contact's name, relationship, and phone number/email.
- The system must verify the phone number (via OTP/SMS) to ensure emergency alerts do not bounce.

## 5. User Flow
1. **Addition**: Student navigates to Support > Trusted Contacts and clicks "Add Contact".
2. **Details**: Student enters details and selects the notification preference (SMS or Email).
3. **Verification**: An automated message is sent to the contact: "[Student Name] has added you as a trusted contact on MannMitra. No action is needed unless you receive an alert."
4. **Activation**: The contact becomes active and can be used by the SOS system.

## 6. UI / UX Behavior
- **List View**: A clear, prioritized list of contacts with visual indicators for their verification status.
- **Edit/Delete**: Simple swipe-to-delete or edit capabilities.

## 7. Functional Behavior
- **Cascade Triggering**: If the SOS system is activated and the primary contact does not acknowledge the alert within 5 minutes, the system automatically escalates to the secondary contact.

## 8. Data Requirements
- `TrustedContact` entity: `id`, `student_id`, `name`, `relationship`, `phone_number`, `email`, `priority_level`, `is_verified`.

## 9. Security / Privacy
- The identity and contact details of trusted contacts are strictly private. Institutional faculty and other students cannot view a user's trusted contacts.

## 10. Error Handling
- If SMS delivery fails during SOS, the system must immediately fall back to the next contact and simultaneously notify the institution's designated emergency service.

## 11. Testing
- Test the validation logic to ensure a student cannot set two contacts to the same priority level.
- Test the cascade logic by simulating a non-response from the primary contact during a mock SOS event.
