# MANNMITRA — PEER MATCHING

Document: `03-STUDENT/16-peer-matching.md`
Status: Production Specification
Version: 1.0
Audience: Students, Backend Engineers, UX Designers
Platform: Responsive Web Application

---

# 1. PURPOSE

Peer Matching connects students who share similar academic contexts, goals, or support needs, fostering a sense of belonging. It transitions anonymous community interactions into semi-private, 1-on-1 supportive relationships.

---

# 2. SCOPE

**In Scope (Phase 2):**
- Opt-in matching system.
- Matching based on non-sensitive parameters (e.g., major, year, study preferences).
- Blind introductions (anonymized profiles).

**Future Scope:**
- AI-driven matching based on deeper contextual compatibility.

---

# 3. USER FLOW

```text
Student navigates to Community > Connect
    ↓
Opts into Peer Matching, selecting their matching preferences
    ↓
System suggests 3 anonymized profiles (e.g., "3rd Year Computer Science student who studies at night")
    ↓
Student sends a "Connection Request"
    ↓
If accepted, both students can chat directly (revealing chosen profile info)
```

---

# 4. FUNCTIONAL REQUIREMENTS

## STU-16-01: Opt-in & Preferences
- Students MUST explicitly opt-in.
- Students MUST select which profile details they are comfortable sharing upon a successful match.

## STU-16-02: Matching Engine
- The system MUST return potential matches based on overlapping academic context and support goals defined during Onboarding.
- The system MUST NOT match based on sensitive mental health data (e.g., stress levels).

## STU-16-03: Safe Messaging
- Initial messaging MUST be contained within MannMitra.
- MUST include block/report functionality in the 1-on-1 chat.

---

# 5. UI / UX REQUIREMENTS

- **Profiles:** Display clean, minimal cards focusing on shared interests rather than photos.
- **Tone:** Frame the feature as finding a "study buddy" or "peer supporter" rather than a dating app aesthetic.

---

# 6. DATA REQUIREMENTS

**Required Data Entities:**
- `PeerMatchPreference`: User ID, matching criteria.
- `ConnectionRequest`: Sender ID, Receiver ID, Status (PENDING, ACCEPTED, REJECTED).

---

# 7. API REQUIREMENTS

- **POST `/api/v1/matching/opt-in`**
- **GET `/api/v1/matching/suggestions`**
- **POST `/api/v1/matching/request`**

---

# 8. SECURITY & PRIVACY

- Real identities are only revealed when BOTH parties accept the connection request.
- Chat data is `Private Data`.

---

# 9. ANALYTICS

- `matching_opt_in`
- `connection_request_sent`
- `connection_request_accepted`
