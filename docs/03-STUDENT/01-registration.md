# 01 Registration
# MANNMITRA — STUDENT REGISTRATION

Document: 03-STUDENT/01-registration.md
Status: Production Specification
Version: 1.0
Audience: Students
Platform: Responsive Web Application

---

# 1. PURPOSE

The MannMitra registration experience is the first interaction between
the student and the product.

Its purpose is to:

- create a secure student account
- establish trust
- minimize friction
- communicate privacy clearly
- prepare the student for onboarding

Registration must feel extremely simple.

The student should never feel like they are filling out a
large institutional form.

---

# 2. CORE EXPERIENCE PRINCIPLE

Registration should answer three questions immediately:

1. What is MannMitra?
2. Why do I need an account?
3. Is my information safe?

The interface should communicate:

"You're in a safe place. Let's get you started."

---

# 3. VISUAL DIRECTION

Follow:

/docs/02-UX-UI/01-design-system.md

The registration screen must use the MannMitra premium visual system.

Primary visual characteristics:

- white background
- MannMitra green accent
- charcoal typography
- subtle sage surfaces
- generous whitespace
- restrained rounded corners
- minimal borders
- subtle shadows
- precise iconography
- premium typography
- smooth micro-interactions

Do NOT use:

- dark backgrounds
- neon colors
- large gradients
- excessive glassmorphism
- stock mental-health imagery
- cartoon illustrations
- excessive decorative elements
- generic AI dashboard styling

---

# 4. REGISTRATION EXPERIENCE

Registration should be a focused experience.

Do not display the complete application navigation.

The student should remain focused on creating their account.

Recommended layout:

Desktop:

LEFT:
Brand / short value proposition

RIGHT:
Registration form

Mobile:

Single-column centered registration experience.

---

# 5. DESKTOP LAYOUT

Recommended maximum content width:

1100–1200px

Use a two-column layout.

Approximate structure:

------------------------------------------------

MANNMITRA                     CREATE ACCOUNT

Your wellbeing,               [ Registration ]
your way.

Short supporting             form
statement.

Privacy reassurance

------------------------------------------------

The left side should remain visually calm.

Do not fill it with excessive illustrations.

---

# 6. MOBILE LAYOUT

Mobile must be first-class.

Recommended order:

MannMitra logo

Create your account

Supporting text

Registration form

Privacy reassurance

Sign-in link

No unnecessary side panel.

---

# 7. BRAND PRESENTATION

Use the official MannMitra wordmark/logo.

Logo should be:

- clean
- correctly aligned
- appropriately sized
- visually restrained

Do not generate a decorative replacement logo.

Do not use random AI-generated icons.

---

# 8. HEADLINE

Recommended:

"Create your MannMitra account"

Alternative:

"Let's get you started."

The headline should be short.

---

# 9. SUPPORTING COPY

Recommended:

"Create a private space to plan, reflect, and get support throughout
your student journey."

Keep the supporting text concise.

Do not use marketing-heavy language.

---

# 10. INFORMATION COLLECTION

Registration should collect only information necessary to create
and secure the account.

Do NOT collect extensive wellbeing information during registration.

Wellbeing-related information belongs in onboarding.

This separation is important.

Registration = Account creation.

Onboarding = Personalization.

---

# 11. REQUIRED REGISTRATION INFORMATION

Recommended fields:

## Full Name

Label:

Full name

Placeholder:

Enter your name

Purpose:

Used to personalize the MannMitra experience.

---

## Email

Label:

Email address

Placeholder:

you@example.com

Purpose:

Account authentication and communication.

---

## Password

Label:

Password

Purpose:

Secure account authentication.

Requirements should be clearly communicated.

---

## Confirm Password

Label:

Confirm password

Purpose:

Prevent accidental password mismatch.

---

# 12. OPTIONAL STUDENT IDENTIFICATION

If institutional verification is required, it must be handled separately
from the primary registration flow.

Do not make students enter unnecessary:

- enrollment numbers
- department codes
- institutional IDs
- academic details

unless required by the deployment institution.

The registration system should support institution-specific
configuration.

---

# 13. PASSWORD UX

Password creation should feel modern and helpful.

Provide:

- show/hide password control
- password requirement visibility
- real-time validation
- accessible error states

Do not expose passwords.

---

# 14. PASSWORD REQUIREMENTS

The exact password policy must be defined by the authentication
implementation.

The UI must clearly communicate the actual configured requirements.

Do NOT display requirements that differ from the backend.

---

# 15. PRIMARY CTA

Button:

"Create account"

The primary CTA must use MannMitra green.

It should be:

- prominent
- accessible
- full-width on mobile
- appropriately sized

---

# 16. CTA STATES

The registration button must support:

DEFAULT

HOVER

FOCUS

PRESSED

DISABLED

LOADING

SUCCESS

ERROR

---

# 17. LOADING STATE

During account creation:

Button text:

"Creating account..."

Display a subtle loading indicator.

Prevent duplicate submissions.

Do not freeze the entire page.

---

# 18. VALIDATION

Validation should happen at appropriate points.

Use:

- inline validation
- clear field-level messages
- server-side validation

Do not rely only on browser validation.

---

# 19. VALIDATION LANGUAGE

Use human language.

GOOD:

"Please enter your email address."

GOOD:

"That email address doesn't look right."

GOOD:

"Passwords don't match."

AVOID:

"Invalid input."

AVOID:

"Validation failed."

---

# 20. ERROR HANDLING

If registration fails:

Keep the student's entered information where safe.

Do not clear the entire form.

Explain what happened.

Example:

"We couldn't create your account right now. Please try again."

If the email already exists:

"An account with this email already exists."

Provide:

"Sign in"

Do not expose unnecessary backend information.

---

# 21. EMAIL VERIFICATION

If email verification is enabled:

After successful registration:

Show a dedicated verification state.

Headline:

"Check your email"

Supporting text:

"We sent a verification link to [email]."

Actions:

"Open email"

"Change email"

"Resend email"

---

# 22. RESEND EMAIL

Resend must include rate limiting.

Show a countdown when appropriate.

Example:

"Resend available in 30s"

Do not allow uncontrolled repeated requests.

---

# 23. EMAIL VERIFICATION SUCCESS

After verification:

Show a calm success state.

Example:

"You're all set."

CTA:

"Continue"

Continue should lead to onboarding.

---

# 24. SIGN IN

Existing students should always have an obvious sign-in path.

Example:

"Already have an account? Sign in"

"Sign in" should be visually secondary to registration.

---

# 25. SOCIAL AUTHENTICATION

If supported by the deployment:

Possible providers may include:

- Google
- Apple
- institutional SSO

Social authentication must follow the same visual system.

Do not make social login visually overpower email registration.

---

# 26. TERMS AND PRIVACY

Before account creation, provide clear access to:

Terms of Service

Privacy Policy

Any required consent information

Do not hide these behind tiny inaccessible text.

---

# 27. CONSENT

Consent must be:

- explicit where required
- understandable
- non-deceptive

Do not use pre-selected consent for optional purposes.

---

# 28. PRIVACY REASSURANCE

The registration screen should provide a short privacy reassurance.

Example:

"Your personal information is protected and managed according to
MannMitra's privacy policy."

Keep this concise.

Detailed privacy information belongs in:

/docs/09-SECURITY-PRIVACY/

---

# 29. ACCESSIBILITY

Registration must comply with:

WCAG 2.2 AA

Requirements:

- semantic form structure
- visible labels
- keyboard navigation
- visible focus states
- accessible errors
- screen-reader support
- sufficient contrast
- minimum comfortable touch targets
- logical tab order

---

# 30. FORM LABELS

Do not rely only on placeholders.

Every field must have a persistent accessible label.

Placeholder text is supplementary.

---

# 31. MOBILE KEYBOARD BEHAVIOR

Inputs must use appropriate input types.

Email:

email keyboard

Password:

password input

Name:

text input

The layout must remain usable when the mobile keyboard opens.

---

# 32. RESPONSIVE BEHAVIOR

Desktop:

Two-column experience.

Tablet:

Two-column or simplified centered layout depending on available width.

Mobile:

Single-column experience.

Do not simply scale the desktop layout.

---

# 33. MOTION

Registration animations must be subtle.

Allowed:

- fade-in
- subtle slide
- input focus transitions
- button state transitions
- verification state transition

Avoid:

- bouncing
- excessive scaling
- large page animations
- decorative particle effects

---

# 34. MICRO-INTERACTIONS

Inputs:

Subtle focus transition.

Buttons:

Subtle hover/pressed transition.

Password visibility:

Smooth icon state change.

Validation:

Subtle state transition.

Success:

Calm confirmation transition.

---

# 35. GLASSMORPHISM

Glass may be used for:

- floating brand/navigation element
- contextual overlay

It must NOT be used for the entire registration form.

The registration form should primarily remain a clean white surface.

---

# 36. VISUAL HIERARCHY

The screen hierarchy must be:

1. MannMitra identity
2. Registration headline
3. Supporting explanation
4. Form
5. Primary CTA
6. Privacy/terms
7. Sign-in option

Nothing else should compete with these elements.

---

# 37. NO UNNECESSARY INFORMATION

Do not show:

- feature lists
- analytics
- testimonials
- community posts
- wellness scores
- AI statistics
- unnecessary promotional banners

The student is here to create an account.

Keep the experience focused.

---

# 38. SECURITY UX

Never expose:

- passwords
- authentication tokens
- internal error messages
- database errors
- stack traces

Security implementation is defined in:

/docs/09-SECURITY-PRIVACY/

and

/docs/08-BACKEND/

---

# 39. ACCOUNT CREATION FLOW

Recommended flow:

Registration

↓

Validate information

↓

Create account

↓

Email verification if required

↓

Verification success

↓

Onboarding

↓

Student dashboard

---

# 40. RETURNING USER

If a user attempts registration with an existing account:

Do not create a duplicate account.

Provide:

"Already have an account? Sign in"

---

# 41. SESSION BEHAVIOR

After successful registration and authentication:

The application must maintain the authenticated session securely.

The student should not be required to repeatedly authenticate during
the same valid session unless security policy requires it.

---

# 42. INTERRUPTED REGISTRATION

If registration is interrupted:

The system should recover gracefully.

The student should not lose information unnecessarily.

---

# 43. PERFORMANCE

The registration page must load quickly.

Prioritize:

- minimal JavaScript
- optimized assets
- fast initial render
- accessible HTML
- lazy loading of non-essential elements

Do not load the entire application dashboard before registration.

---

# 44. SEO / METADATA

The registration page should have appropriate:

- page title
- metadata
- canonical configuration where required

Do not index private authenticated pages.

---

# 45. ANALYTICS

Track only privacy-appropriate product events.

Possible events:

registration_started

registration_validation_failed

registration_submitted

registration_completed

email_verification_sent

email_verified

registration_abandoned

Do not record:

- passwords
- sensitive personal information
- message content
- wellbeing information

---

# 46. SUCCESS CRITERIA

Registration is successful when:

- the student understands what MannMitra is
- the student understands why an account is needed
- the student can register quickly
- errors are easy to understand
- privacy expectations are clear
- the interface feels trustworthy
- the experience works on mobile
- accessibility requirements are met
- the student can continue naturally into onboarding

---

# 47. DESIGN QUALITY CHECKLIST

Before marking the registration screen complete:

[ ] White-first visual design

[ ] MannMitra green used as an accent

[ ] Premium typography

[ ] Generous whitespace

[ ] No unnecessary cards

[ ] No excessive glassmorphism

[ ] No generic AI visuals

[ ] Consistent icons

[ ] Clear primary CTA

[ ] Clear validation

[ ] Clear loading state

[ ] Clear error state

[ ] Clear email verification state

[ ] Accessible form labels

[ ] Keyboard accessible

[ ] Mobile optimized

[ ] Touch-friendly

[ ] Responsive

[ ] WCAG 2.2 AA considered

[ ] No sensitive information exposed

[ ] No unnecessary registration fields

[ ] Feels calm and premium

[ ] Feels distinctly MannMitra

---

# 48. IMPLEMENTATION RULE

Antigravity must treat this document and the global UI/UX documents
as the source of truth.

Do not invent additional registration fields.

Do not introduce a different visual system.

Do not replace the MannMitra design system with a generic SaaS
template.

If an implementation detail is not defined here, follow:

/docs/02-UX-UI/01-design-system.md

and the global product requirements.

If there is still ambiguity, choose the simplest,
most accessible and least visually intrusive solution.

---

# FINAL EXPERIENCE

The student should finish registration thinking:

"That was easy."

Not:

"I just filled out an institutional form."

MannMitra should feel like a calm, private and premium space from
the very first interaction.

