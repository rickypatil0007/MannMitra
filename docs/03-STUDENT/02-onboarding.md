# 02 Onboarding
# MANNMITRA — STUDENT ONBOARDING

Document: 03-STUDENT/02-onboarding.md
Status: Production Specification
Version: 1.0
Audience: Students
Platform: Responsive Web Application

---

# 1. PURPOSE

The MannMitra onboarding experience personalizes the student's
experience immediately after account creation.

The onboarding must:

- understand the student's context
- understand their priorities
- configure relevant MannMitra experiences
- establish initial preferences
- introduce Mitra
- establish trust
- prepare the personalized dashboard

Onboarding must NOT feel like an institutional registration form.

---

# 2. CORE PRINCIPLE

Registration creates the account.

Onboarding creates the relationship.

The student should feel:

"You're getting to know how I want MannMitra to help me."

Not:

"You're collecting a lot of information about me."

---

# 3. ONBOARDING PHILOSOPHY

Follow these principles:

- progressive disclosure
- minimum necessary information
- one question at a time where appropriate
- visible progress
- ability to skip non-essential questions
- clear explanation for sensitive questions
- calm language
- no judgment
- no forced emotional disclosure
- no unnecessary data collection

---

# 4. ONBOARDING LENGTH

Target:

3–5 minutes maximum.

Preferred:

5–7 meaningful steps.

Do not create a 15–20 screen questionnaire.

---

# 5. ONBOARDING FLOW

Recommended flow:

Welcome

↓

Student context

↓

Academic context

↓

Current priorities

↓

Support preferences

↓

Mitra preferences

↓

Notification preferences

↓

Privacy explanation

↓

Personalized experience ready

↓

Dashboard

---

# 6. VISUAL DIRECTION

Follow:

/docs/02-UX-UI/01-design-system.md

The onboarding must use:

- white-first background
- MannMitra green
- soft sage surfaces
- charcoal typography
- generous whitespace
- subtle borders
- restrained shadows
- premium typography
- minimal iconography
- subtle motion

The experience must feel like a premium modern consumer product.

---

# 7. ONBOARDING LAYOUT

Desktop:

Centered content container.

Maximum readable width:

700–800px

Do not use a dense dashboard layout.

Mobile:

Single-column.

Generous horizontal padding.

---

# 8. PROGRESS INDICATOR

The student must understand where they are in onboarding.

Use a subtle progress indicator.

Example:

1 of 6

or

A minimal progress bar.

Avoid:

large multi-step wizard UI.

---

# 9. SKIP BEHAVIOR

Optional questions should have:

"Skip for now"

The skip action must be visually secondary.

Skipping should never make the student feel guilty.

Example:

"You can change this later."

---

# 10. STEP 1 — WELCOME

Headline:

"Welcome to MannMitra."

Supporting text:

"Let's personalize your experience. This will only take a few minutes."

Primary CTA:

"Let's begin"

Secondary:

"Skip setup"

---

# 11. STEP 2 — STUDENT CONTEXT

Goal:

Understand basic academic context.

Possible information:

- university / institution
- course / program
- year of study
- department

Only collect fields required for the deployment.

---

# 12. INSTITUTION

If institution selection is required:

Label:

"Where do you study?"

Use:

searchable selection

Do not force students to scroll through hundreds of institutions.

Allow search.

---

# 13. COURSE / PROGRAM

Label:

"What are you studying?"

Allow:

- searchable selection
- predefined options
- custom entry where appropriate

---

# 14. YEAR OF STUDY

Example:

Which year are you in?

Options:

1st year
2nd year
3rd year
4th year
Postgraduate
Other

Use large accessible selection controls.

---

# 15. STEP 3 — CURRENT PRIORITIES

Goal:

Understand what the student wants from MannMitra.

Headline:

"What would you like help with?"

Allow multiple selections.

Possible options:

- Managing academic workload
- Planning my time
- Staying focused
- Managing stress
- Understanding how I'm feeling
- Building healthier routines
- Talking things through
- Finding someone to talk to
- Getting support when things feel difficult
- Something else

Do not assume the student is experiencing a mental-health problem.

---

# 16. SELECTION UX

Use selectable cards or buttons.

Selected state:

- subtle MannMitra green
- soft green background
- clear check/selected indicator

Avoid excessive visual effects.

---

# 17. STEP 4 — ACADEMIC ROUTINE

Goal:

Understand the student's general schedule.

Possible questions:

"When is your day usually busiest?"

Options:

Morning
Afternoon
Evening
Late night
It varies

Optional.

---

# 18. STUDY PATTERN

Optional question:

"When do you usually prefer to study?"

Options:

Morning
Afternoon
Evening
Night
No preference

This information may later personalize planner recommendations.

---

# 19. STEP 5 — SUPPORT PREFERENCES

Headline:

"How would you like MannMitra to support you?"

Possible preferences:

- Help me plan
- Help me reflect
- Help me stay focused
- Give me gentle reminders
- Let me talk things through
- Help me find human support

Allow multiple selections.

---

# 20. SUPPORT STYLE

Optional question:

"What kind of support feels most helpful?"

Options:

Gentle and encouraging

Direct and practical

Short and simple

Detailed and thoughtful

The selection should personalize Mitra's communication style.

---

# 21. IMPORTANT SAFETY RULE

Do NOT use onboarding to diagnose the student.

Do NOT ask questions such as:

"Are you depressed?"

"Do you have anxiety?"

"Rate your mental illness."

"Do you have a psychiatric disorder?"

Unless a future clinically validated workflow explicitly requires
such information and the appropriate safety, consent and clinical
framework exists.

General wellbeing personalization belongs here.

Clinical assessment belongs in a separate controlled workflow.

---

# 22. STEP 6 — MITRA INTRODUCTION

Introduce the AI assistant.

Headline:

"Meet Mitra."

Supporting text:

"Mitra is here to help you plan, reflect, talk things through,
and find the right support when you need it."

---

# 23. MITRA EXPECTATIONS

Clearly communicate:

Mitra is an AI support companion.

Mitra is not a replacement for a qualified mental-health
professional or emergency service.

For serious or urgent situations, human support should be available.

Do not make this disclaimer visually overwhelming.

---

# 24. MITRA PERSONALIZATION

Allow the student to select communication preference.

Example:

"How should Mitra talk to you?"

Options:

Gentle

Practical

Balanced

The default should be:

Balanced

---

# 25. MITRA MEMORY EXPLANATION

Explain memory simply.

Example:

"Mitra can use information you choose to share to make future
conversations more useful."

Provide access to:

"Manage memory"

Do not hide memory behavior.

---

# 26. PRIVACY

The student must understand that personalization uses information
they provide.

Provide a concise explanation:

"Your information helps personalize your MannMitra experience.
You control your privacy settings and sharing preferences."

Link:

"Privacy controls"

---

# 27. STEP 7 — NOTIFICATION PREFERENCES

Do not immediately enable every notification.

Allow the student to choose.

Possible categories:

Planner reminders

Wellness check-ins

Mitra reminders

Appointments

Community activity

Safety-related notifications where applicable

---

# 28. NOTIFICATION FREQUENCY

For wellness-related reminders, offer:

Minimal

Balanced

Frequent

Default:

Balanced

The student can change this later.

---

# 29. QUIET HOURS

Optional.

Allow students to define times when non-critical notifications
should not be sent.

Example:

10:00 PM – 7:00 AM

Safety-critical communication must follow the appropriate
safety policy and should not be incorrectly blocked by ordinary
notification settings.

---

# 30. FINAL PERSONALIZATION SCREEN

After onboarding:

Headline:

"You're all set."

Supporting text:

"MannMitra is ready to help you make your days a little more
manageable."

Primary CTA:

"Go to my dashboard"

---

# 31. PERSONALIZED DASHBOARD INITIALIZATION

After onboarding, the system should configure:

- dashboard priorities
- planner defaults
- Mitra communication preference
- notification preferences
- relevant recommendations
- academic context
- wellness experience defaults

Do not create fake data to make the dashboard appear populated.

---

# 32. ONBOARDING DATA

Potential data categories:

## Academic Context

- institution
- course
- year
- department

## Preferences

- support goals
- communication style
- notification preferences
- study preference

## Product Preferences

- Mitra style
- reminder frequency
- quiet hours

Only collect information that has a defined product purpose.

---

# 33. DATA MINIMIZATION

Every onboarding field must answer:

Why are we collecting this?

Where will it be used?

Can the student skip it?

Can the student change it later?

If there is no clear answer:

Do not collect it.

---

# 34. SENSITIVE INFORMATION

Do not request unnecessary sensitive information during onboarding.

Avoid collecting:

- detailed medical history
- diagnoses
- medication information
- traumatic experiences
- detailed family problems
- highly sensitive personal information

unless required by a separately designed and justified workflow.

---

# 35. ONBOARDING PROGRESS

The system should persist onboarding progress.

If the student leaves midway:

They should be able to continue later.

Example:

"Continue setting up MannMitra"

Do not force them to restart.

---

# 36. SKIPPED ONBOARDING

If the student skips onboarding:

Allow them to enter the dashboard.

Show a subtle option later:

"Finish setting up your MannMitra experience"

Do not repeatedly interrupt them.

---

# 37. EDITING INFORMATION

All non-sensitive onboarding preferences should be editable later.

Relevant locations:

Profile

Settings

Mitra preferences

Notification settings

Privacy settings

---

# 38. ACCESSIBILITY

Follow:

/docs/02-UX-UI/06-accessibility.md

Requirements:

- keyboard accessible
- visible focus states
- semantic controls
- accessible selection states
- screen-reader support
- sufficient contrast
- touch-friendly controls
- logical tab order

---

# 39. MOBILE EXPERIENCE

Mobile onboarding must feel native.

Use:

- large readable question
- short supporting copy
- comfortable selection controls
- fixed or contextual bottom CTA
- visible progress
- minimal scrolling

Do not place multiple dense forms on one mobile screen.

---

# 40. DESKTOP EXPERIENCE

Desktop should use the available space for calm composition.

Do not expand the form unnecessarily.

Recommended:

centered question
+
focused answer area
+
progress
+
navigation

---

# 41. MOTION

Use subtle transitions between steps.

Preferred:

fade
+
slight horizontal movement

Duration:

180–300ms

Do not use:

- bouncing
- dramatic zooming
- particle effects
- excessive page transitions

---

# 42. BACK NAVIGATION

The student must be able to go back.

Previous answers should remain preserved.

Do not unexpectedly reset previous selections.

---

# 43. VALIDATION

Validation should happen before moving to the next step where
necessary.

Errors must be:

- concise
- human
- actionable

Example:

"Choose at least one option to continue."

If a question is optional:

Do not validate it.

---

# 44. LOADING

When saving onboarding information:

Use a lightweight loading state.

Do not block the entire application unnecessarily.

---

# 45. ERROR RECOVERY

If saving fails:

Keep the student's current selections locally/in memory where
appropriate.

Display:

"We couldn't save that just now. Try again."

Provide:

"Try again"

Do not force the student to restart onboarding.

---

# 46. TRUST PRINCIPLES

Never manipulate the student into providing more information.

Never use:

- guilt
- fear
- urgency
- misleading copy
- hidden consent
- dark patterns

---

# 47. DARK PATTERN PROHIBITION

Do not:

- hide skip buttons
- preselect optional sensitive choices
- make decline buttons difficult to find
- use confusing wording
- repeatedly ask rejected questions
- make privacy controls intentionally difficult

---

# 48. ANALYTICS

Track only privacy-appropriate product events.

Possible events:

onboarding_started

onboarding_step_viewed

onboarding_step_completed

onboarding_step_skipped

onboarding_completed

onboarding_abandoned

Do NOT log:

- sensitive answers
- free-text emotional disclosures
- private Mitra conversations
- health information

---

# 49. PERFORMANCE

Onboarding should load quickly.

Avoid loading unnecessary dashboard functionality before completion.

Use optimized assets.

Keep initial JavaScript payload reasonable.

---

# 50. SUCCESS CRITERIA

Onboarding is successful when:

- students understand why information is being requested
- students can skip optional questions
- onboarding takes only a few minutes
- students feel respected
- students understand Mitra
- students understand basic privacy expectations
- students reach a personalized dashboard
- the experience works beautifully on mobile
- no unnecessary sensitive information is collected
- accessibility requirements are satisfied

---

# 51. DESIGN QUALITY CHECKLIST

Before approving onboarding:

[ ] White-first design

[ ] MannMitra green used selectively

[ ] Apple/Tesla-level visual restraint

[ ] Premium typography

[ ] Generous whitespace

[ ] Clear progress indicator

[ ] One clear question/action per step

[ ] Optional questions can be skipped

[ ] No dark patterns

[ ] No unnecessary sensitive questions

[ ] No clinical diagnosis questions

[ ] Calm language

[ ] Clear Mitra explanation

[ ] Clear privacy explanation

[ ] Accessible controls

[ ] Mobile-first experience

[ ] Desktop responsive experience

[ ] Loading states

[ ] Error states

[ ] Back navigation

[ ] Progress persistence

[ ] Resume support

[ ] Smooth but restrained transitions

[ ] No generic AI-template styling

[ ] No excessive glassmorphism

[ ] No excessive gradients

[ ] No unnecessary illustrations

[ ] Feels distinctly MannMitra

---

# 52. IMPLEMENTATION RULE

Antigravity must treat this document as the source of truth for
student onboarding.

Do not add additional onboarding questions without a defined
product requirement.

Do not turn onboarding into a mental-health assessment.

Do not collect sensitive information simply because it may be
useful in the future.

Follow:

/docs/02-UX-UI/01-design-system.md

for all visual decisions.

Follow:

/docs/09-SECURITY-PRIVACY/

for privacy and data handling requirements.

Follow:

/docs/04-AI/

for Mitra-related behavior.

---

# FINAL EXPERIENCE

The student should finish onboarding thinking:

"MannMitra understands what I need."

Not:

"I just completed another college form."

The onboarding experience should feel:

CALM
PERSONAL
FAST
PRIVATE
PREMIUM
HUMAN

