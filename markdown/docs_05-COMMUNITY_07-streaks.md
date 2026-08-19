# MANNMITRA — COMMUNITY STREAKS

Document: `05-COMMUNITY/07-streaks.md`
Status: Production Specification
Version: 1.0
Audience: Product, Frontend Engineers
Platform: Responsive Web Application

---

# 1. PURPOSE

To reward positive, constructive participation in the community without encouraging addictive or excessive use. It supports Feature 24 (Community Streaks).

---

# 2. MECHANICS

Unlike typical social media streaks that reward *opening* the app, MannMitra's streak is based on *constructive action*.

**Actions that maintain a streak:**
- Clicking "Support" on a peer's post.
- Logging a stress check-in.
- Saving a reflection.

**Actions that DO NOT affect the streak:**
- Simply opening the app.
- Endless scrolling in the community feed.

---

# 3. UI / UX

- **Display:** A subtle icon (e.g., a small flame or growing plant) in the user profile or header.
- **Messaging:** "3-Day Wellness Streak. Great job taking care of yourself and others."
- **Failure State:** If a streak is broken, DO NOT use negative language (e.g., "You lost your streak!"). Use: "Welcome back. Let's start fresh today."

---

# 4. DATA REQUIREMENTS

- Maintained in the `User` or `Profile` table as `current_streak_days` and `last_streak_action_date`.

---

# 5. PRIVACY

- Streak length is strictly `Private Data`. It MUST NOT be displayed on anonymous community posts. Competitive wellness is counterproductive.
