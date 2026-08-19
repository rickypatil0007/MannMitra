# 01 Design System
# MANNMITRA — DESIGN SYSTEM

Status: Approved
Version: 1.0
Platform: Responsive Web Application
Design Direction: Light-First Premium Human-Centered Interface

---

# 1. DESIGN SYSTEM OBJECTIVE

The MannMitra interface must feel like a premium modern consumer
product rather than a conventional healthcare dashboard.

The visual language should communicate:

- trust
- calm
- intelligence
- privacy
- warmth
- simplicity
- precision
- emotional safety

The interface should feel technologically advanced without feeling
clinical, robotic, childish, or visually noisy.

---

# 2. PRIMARY VISUAL DIRECTION

MannMitra uses a LIGHT-FIRST visual system.

The default experience must use:

- white backgrounds
- soft neutral surfaces
- subtle green accents
- restrained shadows
- minimal borders
- generous whitespace
- elegant typography
- precise icons
- subtle glass surfaces
- smooth micro-interactions

The interface should visually resemble the level of refinement
associated with premium products such as:

- Apple
- Tesla
- Linear
- Stripe
- Notion
- modern premium SaaS products

These products are references for design quality and principles only.

Do NOT copy their layouts, branding, proprietary components, or
visual identity.

MannMitra must have its own visual identity.

---

# 3. DESIGN PERSONALITY

The interface should feel:

CALM
PREMIUM
HUMAN
INTELLIGENT
SPACIOUS
TRUSTWORTHY
QUIET
MODERN

It must NOT feel:

CLINICAL
CHILDISH
GAMIFIED
NEON
OVERLY COLORFUL
ROBOTIC
CORPORATE
DENSE
GENERIC AI DASHBOARD

---

# 4. COLOR SYSTEM

## 4.1 Primary Background

Primary background:

#FFFFFF

Use pure white primarily for major page surfaces.

---

## 4.2 Soft Background

Use an extremely subtle neutral surface for separation.

Suggested:

#F7F9F7

This should remain visually close to white.

Do not create large gray blocks.

---

## 4.3 Primary Brand Green

MannMitra green should communicate:

- wellbeing
- progress
- trust
- positive action
- identity

Primary:

#2F7D5B

Use this primarily for:

- primary CTA
- active states
- selected navigation
- key indicators
- links where appropriate
- brand accents

Do NOT flood the interface with green.

---

## 4.4 Dark Green

Use for strong text or emphasis when required:

#1F5C43

---

## 4.5 Soft Green

Use for:

- wellness cards
- selected states
- subtle backgrounds
- positive indicators

Suggested:

#EAF5EF

---

## 4.6 Very Soft Green

Suggested:

#F4FAF6

Use sparingly.

---

## 4.7 Primary Text

Primary:

#171A18

Text should feel nearly black but not harsh.

---

## 4.8 Secondary Text

#66706A

Use for:

- descriptions
- metadata
- secondary labels

---

## 4.9 Muted Text

#8A938D

Use carefully.

Do not use low-contrast text for important information.

---

## 4.10 Borders

Primary border:

#E7ECE8

Borders must be subtle.

Avoid strong gray outlines.

---

## 4.11 Warning

Use amber/orange carefully.

Warning should mean:

"Pay attention."

It should not mean:

"You are in danger."

---

## 4.12 Error

Use a restrained red system.

Red must be reserved for:

- actual errors
- destructive actions
- safety-critical alerts

Do not use red for ordinary wellness states.

---

# 5. COLOR USAGE RULE

The interface should visually follow approximately:

70–80%
White / soft neutral

10–15%
Text / dark neutral

5–10%
Green and semantic accents

Green is an accent.

Green is NOT the background of the entire application.

---

# 6. TYPOGRAPHY

Typography must feel premium, clean and highly readable.

Preferred font:

Inter

Fallback:

system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

If the implementation environment provides a high-quality equivalent,
maintain the same visual characteristics.

---

# 7. TYPOGRAPHY HIERARCHY

## Display

Large page introductions.

Weight:
600

Use sparingly.

---

## H1

Primary page title.

Weight:
600

Large but not oversized.

---

## H2

Section title.

Weight:
600

---

## H3

Card or subsection title.

Weight:
600

---

## Body

Weight:
400

Comfortable line-height.

---

## Label

Weight:
500

Used for:

- inputs
- navigation
- metadata
- controls

---

## Caption

Weight:
400–500

Used for:

- timestamps
- secondary information
- helper text

---

# 8. TYPOGRAPHY RULE

Avoid excessive font weights.

Do not use:

- giant bold headings everywhere
- uppercase text everywhere
- excessive letter spacing
- decorative fonts
- childish typography

The interface should feel quiet and confident.

---

# 9. SPACING SYSTEM

Use an 8px spacing system.

Primary values:

4
8
12
16
24
32
40
48
64
80
96
128

Use spacing consistently.

Whitespace is a major component of the visual identity.

---

# 10. LAYOUT

Desktop content should use a controlled maximum width.

Recommended:

1200–1440px depending on screen.

Do not stretch content edge-to-edge unnecessarily.

Major pages should have generous horizontal padding.

---

# 11. CORNER RADIUS

Use modern but restrained rounding.

Recommended:

Small:
8px

Medium:
12px

Large:
16px

Premium surface:
20px

Modal:
24px

Avoid extremely rounded "pill everything" interfaces.

Pills should be reserved for:

- status
- tags
- compact filters
- selected states

---

# 12. CARDS

Cards should be used to create hierarchy, not to place every element
inside a box.

Preferred:

white surface
+
subtle border
+
very soft shadow where needed
+
16–20px radius
+
generous padding

Avoid:

heavy shadows
dark borders
multiple nested cards
excessive glass effects

---

# 13. GLASSMORPHISM

Glassmorphism is allowed but must be subtle.

Use it primarily for:

- floating navigation
- command surfaces
- overlays
- floating assistant controls
- modal layers
- selected premium surfaces

Glass should use:

- high transparency
- soft blur
- minimal border
- low visual noise

Do NOT make every card glass.

The default content surface remains clean white.

---

# 14. SHADOWS

Use shadows extremely lightly.

Shadow should communicate:

elevation

not:

decoration.

Avoid large dramatic shadows.

---

# 15. BUTTONS

## Primary Button

- MannMitra green background
- white text
- subtle hover transition
- 10–12px radius
- comfortable height
- strong focus state

---

## Secondary Button

White or soft-neutral background.

Subtle border.

Dark text.

---

## Tertiary Action

Text or icon action.

Use for low-priority actions.

---

## Destructive Button

Use restrained red.

Never use destructive styling for ordinary cancellation.

---

# 16. INPUTS

Inputs should feel:

- spacious
- calm
- clean
- obvious

Default:

white background
subtle border
12px radius

Focus:

green border / focus ring

Do not use giant glowing focus effects.

---

# 17. ICONOGRAPHY

Icons must feel precise and consistent.

Preferred characteristics:

- minimal
- thin-to-medium stroke
- rounded geometry
- simple silhouette

Avoid:

- cartoon icons
- emoji as primary UI icons
- inconsistent icon families
- decorative AI-generated icons

Use a consistent icon library.

Lucide-style iconography is preferred.

---

# 18. ICON RULE

Icons must support understanding.

Do not add icons merely because empty space exists.

Every icon must have:

- purpose
- consistent sizing
- accessible label when required

---

# 19. NAVIGATION

Navigation should feel extremely clean.

Desktop:

- compact left navigation or refined top navigation depending on
  screen context

Mobile:

- bottom navigation for primary destinations

Navigation should never dominate the screen.

---

# 20. DASHBOARD DESIGN

The dashboard must NOT look like a traditional analytics dashboard.

Prioritize:

1. Greeting / contextual state
2. Today's most important action
3. Wellness check
4. Upcoming responsibilities
5. Mitra support
6. Secondary insights

The student should understand the dashboard in seconds.

---

# 21. AI CHAT DESIGN

Mitra should feel like a calm conversational environment.

Avoid:

- robotic chat bubbles everywhere
- excessive gradients
- "AI" branding everywhere
- flashy animations

Use:

- spacious conversation area
- subtle message hierarchy
- calm composer
- contextual actions
- lightweight status indicators

---

# 22. WELLNESS VISUALIZATION

Charts must be:

- simple
- readable
- calm
- non-clinical

Do not use frightening dashboards.

Avoid unnecessary red/yellow/green traffic-light systems.

---

# 23. EMPTY STATES

Empty states should be:

- reassuring
- useful
- action-oriented

Example:

"You haven't added anything yet."

Follow with:

"Start with one small thing."

Then provide a clear CTA.

---

# 24. ERROR STATES

Error messages must be:

- human
- concise
- actionable

Never blame the user.

Example:

"Something didn't load. Try again."

Not:

"Invalid request."

---

# 25. LOADING STATES

Prefer:

- skeletons
- subtle progress indicators
- streaming AI responses

Avoid full-screen spinners unless absolutely necessary.

---

# 26. MOTION

Motion should be:

- subtle
- smooth
- purposeful

Default duration:

150–250ms

Large transitions:

300–500ms

Avoid:

- bouncing cards
- excessive scaling
- flashy page transitions
- constant motion

---

# 27. VISUAL HIERARCHY

Every screen should answer:

What is this page?

What is most important?

What should I do next?

What can I ignore?

If everything is emphasized, nothing is emphasized.

---

# 28. RESPONSIVE DESIGN

The design system must work across:

- mobile
- tablet
- laptop
- desktop
- large desktop

Mobile is not a compressed desktop.

Mobile requires deliberate prioritization.

---

# 29. ACCESSIBILITY

Target:

WCAG 2.2 AA

Requirements include:

- keyboard navigation
- focus visibility
- accessible labels
- sufficient contrast
- reduced motion
- semantic structure
- screen-reader support

---

# 30. FINAL VISUAL RULE

If a design decision makes the interface:

more complicated
more colorful
more animated
more crowded
more decorative

ask whether it actually improves the student's experience.

If not:

REMOVE IT.

MannMitra should feel:

"quietly premium."
# 2. PREMIUM PRODUCT EXPERIENCE STANDARD

MannMitra must be designed to the quality standard of leading modern
consumer technology products.

Apple and Tesla may be used as references for:

- visual restraint
- typography
- spacing
- hierarchy
- product storytelling
- interaction quality
- animation quality
- responsive behavior
- attention to detail
- simplicity

Additional references for modern web-product quality include:

- Linear
- Stripe
- Notion
- Vercel
- Arc
- Raycast
- modern Apple web experiences

These are DESIGN QUALITY REFERENCES only.

DO NOT copy:

- logos
- branding
- proprietary layouts
- exact components
- proprietary animations
- exact color systems
- visual identities

MannMitra must have its own distinctive identity.

---

# 3. CURRENT-GENERATION WEB EXPERIENCE

The product must not look like a traditional college portal,
healthcare dashboard, template-based SaaS application, or
AI-generated website.

The interface should feel like a current-generation premium
web application.

Prioritize:

- clean composition
- generous whitespace
- excellent typography
- precise alignment
- strong visual hierarchy
- subtle depth
- sophisticated responsive behavior
- smooth micro-interactions
- contextual controls
- intelligent information density
- fast perceived performance
- polished loading states
- polished empty states
- polished error states
- polished success states

Every interaction should feel intentional.

---

# 4. PREMIUM VISUAL PRINCIPLES

## 4.1 LESS BUT BETTER

Do not add UI elements simply because there is available space.

Every element must have a purpose.

---

## 4.2 WHITESPACE IS A FEATURE

Use generous whitespace to separate concepts.

Do not fill empty areas with:

- illustrations
- decorative gradients
- unnecessary cards
- statistics
- icons
- promotional elements

Empty space should create calm.

---

## 4.3 TYPOGRAPHY-LED DESIGN

Typography should establish hierarchy before cards,
borders, colors, or illustrations do.

Use:

- strong page titles
- concise supporting text
- restrained font weights
- comfortable line heights
- consistent alignment

---

## 4.4 CONTENT-FIRST DESIGN

The interface should emphasize the student's current need.

Do not build screens around components.

Build screens around user goals.

---

## 4.5 DEPTH WITHOUT VISUAL NOISE

Use subtle:

- borders
- shadows
- blur
- transparency
- layering

Depth should be felt rather than announced.

---

# 5. GLASSMORPHISM STANDARD

Glassmorphism is a SUPPORTING visual technique.

It must NOT become the primary visual language.

Use glass primarily for:

- floating navigation
- sticky navigation
- command surfaces
- floating controls
- overlays
- selected contextual panels

Default content surfaces remain:

WHITE
or
VERY LIGHT NEUTRAL

Avoid:

- glass on every card
- excessive blur
- strong transparency
- colorful glass
- glowing borders

The result should feel sophisticated rather than futuristic.

---

# 6. MODERN NAVIGATION EXPERIENCE

Navigation should feel lightweight.

Desktop navigation may use:

- refined sidebar
- floating sidebar
- compact top navigation
- contextual navigation

depending on the screen.

Navigation must not consume unnecessary screen space.

When appropriate, use subtle:

- sticky behavior
- backdrop blur
- translucent surfaces
- active-state transitions

Mobile navigation must be deliberately designed rather than
being a compressed desktop navigation.

---

# 7. MODERN INTERACTION QUALITY

Every interactive element must have:

DEFAULT
HOVER
FOCUS
ACTIVE
DISABLED
LOADING
ERROR

states where applicable.

Transitions should be subtle and fast.

Nothing should suddenly appear or disappear without contextual
continuity unless the interaction requires it.

---

# 8. SCROLL EXPERIENCE

Scrolling should feel smooth and intentional.

Use:

- sticky contextual elements where useful
- progressive content reveal where appropriate
- subtle section transitions
- preserved scroll position

Do NOT use excessive scroll animations.

Do NOT make the user wait for animations before accessing content.

---

# 9. RESPONSIVE QUALITY STANDARD

Responsive design must feel native at every viewport.

Do not simply:

desktop → shrink everything.

Instead:

desktop
tablet
mobile

must each have intentional layouts.

The mobile experience must be treated as a first-class product.

---

# 10. PREMIUM COMPONENT QUALITY

Every component should look production-ready.

Components must have:

- consistent spacing
- consistent radius
- consistent typography
- predictable interaction
- responsive behavior
- accessibility states

Do not mix component styles from different design systems.

---

# 11. VISUAL CONSISTENCY

The following must remain consistent throughout the entire product:

- typography
- spacing
- colors
- iconography
- radius
- shadows
- buttons
- inputs
- cards
- navigation
- motion

A component must never look like it came from another application.

---

# 12. ANTI-TEMPLATE RULE

Do NOT produce a generic:

"AI SaaS dashboard"

visual style.

Avoid:

- excessive gradient hero sections
- glowing green/purple blobs
- floating 3D objects everywhere
- excessive glass cards
- giant AI robot imagery
- meaningless statistics
- dashboard cards everywhere
- neon gradients
- excessive rounded pills
- random decorative icons
- generic stock illustrations

MannMitra should feel like a carefully designed product,
not a generated template.

---

# 13. ANTI-AI-GENERATED-UI RULE

The UI must NOT contain visual patterns commonly associated
with low-quality AI-generated interfaces.

Avoid:

- random gradients
- inconsistent icon styles
- excessive cards
- arbitrary decorative shapes
- fake complexity
- meaningless charts
- excessive badges
- excessive "AI" labels
- inconsistent spacing
- inconsistent border radii
- text overflowing components
- icons that appear decorative rather than functional

Every element must appear intentionally designed.

---

# 14. PRODUCT-LEVEL POLISH

Before considering any screen complete, verify:

1. Is the hierarchy immediately understandable?
2. Is the primary action obvious?
3. Is there enough whitespace?
4. Are unnecessary elements removed?
5. Are typography sizes consistent?
6. Are icons from one consistent family?
7. Are interactive states implemented?
8. Does the mobile version feel intentional?
9. Does the screen feel calm?
10. Does it feel premium without being flashy?

If the answer to any of these is NO,
the screen is not finished.

---

# 15. MANNMITRA VISUAL IDENTITY

The product should ultimately be recognizable as MannMitra.

Core visual language:

WHITE
+
MANNMITRA GREEN
+
SOFT SAGE
+
CHARCOAL
+
SUBTLE DEPTH
+
PREMIUM TYPOGRAPHY
+
GENEROUS WHITESPACE

The result should communicate:

"Technology that feels human."

Not:

"Technology trying to look futuristic."

