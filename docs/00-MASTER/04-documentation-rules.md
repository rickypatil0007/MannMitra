# MANNMITRA — DOCUMENTATION RULES

**Status:** Approved

---

# 1. PURPOSE

The `/docs` directory is the source of truth for MannMitra.

Production implementation must follow the documentation.

---

# 2. SOURCE OF TRUTH HIERARCHY

When documents conflict, resolve them according to this priority:

1. Safety
2. Security
3. Privacy
4. Product Master
5. Product Requirements
6. Feature Specifications
7. UX/UI Specifications
8. API Specifications
9. Database Specifications
10. Technical Specifications
11. Agent Instructions

Implementation convenience must never override safety, security,
privacy, or explicit product requirements.

---

# 3. NO SILENT INVENTION

Do not invent major product behavior when it is not documented.

If something is missing:

1. Identify the missing requirement.
2. Make the smallest reasonable assumption if implementation must continue.
3. Document the assumption.
4. Keep the decision reversible where possible.
5. Never invent safety-critical behavior.

---

# 4. DOCUMENT CONSISTENCY

All documentation must use consistent:

- feature names
- user roles
- entity names
- terminology
- navigation names
- API conventions
- database conventions
- design tokens

---

# 5. FEATURE IMPLEMENTATION

Before implementing a feature, inspect the relevant:

- product document
- UX/UI document
- API document
- database document
- security document
- privacy document
- testing document
- AI document if applicable

---

# 6. PRODUCTION STANDARD

A feature specification must consider:

- normal behavior
- loading
- empty state
- error state
- validation
- permissions
- privacy
- security
- accessibility
- responsive behavior
- edge cases
- analytics
- logging
- testing

---

# 7. PRIVACY RULE

Sensitive student information must be private by default.

Never expose sensitive information through:

- URLs
- client-side logs
- analytics events
- public APIs
- community content
- institution dashboards
- browser storage unless explicitly approved

---

# 8. SECURITY RULE

Never:

- hardcode secrets
- expose private keys
- trust client-side authorization
- bypass RLS
- expose service credentials
- log sensitive user content unnecessarily

---

# 9. AI RULE

AI must follow the dedicated AI and safety specifications.

AI must not:

- diagnose
- claim medical certainty
- pretend to be a professional
- encourage emotional dependency
- manipulate users
- discourage professional help

---

# 10. UI RULE

All interface work must follow:

`02-UX-UI/01-design-system.md`

Do not introduce arbitrary:

- colors
- typography
- spacing
- shadows
- border radii
- icons
- animations

---

# 11. DESIGN NORTH STAR

MannMitra is:

LIGHT-FIRST
+
WHITE / SOFT NEUTRAL
+
CALM GREEN
+
PREMIUM
+
MINIMAL
+
SPACIOUS
+
HUMAN
+
ACCESSIBLE

Apple/Tesla/Linear/Stripe/Notion may be used as design inspiration,
but MannMitra must have its own visual identity.

---

# 12. CHANGE MANAGEMENT

When a requirement changes:

1. Identify affected documents.
2. Update dependent documents.
3. Check UI implications.
4. Check API implications.
5. Check database implications.
6. Check security implications.
7. Check privacy implications.
8. Update tests.

---

# 13. DOCUMENT METADATA

Each document should contain:

Status:
Draft / Approved / Implemented / Deprecated

Last Updated:

Dependencies:

---

# 14. FEATURE COMPLETION

A feature is not complete because its UI works.

Completion requires appropriate:

- frontend
- backend
- database
- authorization
- privacy
- security
- accessibility
- error handling
- testing
- documentation

---

# 15. TRACEABILITY

Major product requirements should map:

Requirement
→ Feature
→ UI
→ API
→ Database
→ Security
→ Test

---

# 16. AGENT BEHAVIOR

The implementation agent must:

- read relevant documentation before coding
- follow established conventions
- avoid unnecessary rewrites
- preserve working functionality
- avoid introducing undocumented features
- test changes
- report assumptions
- report unresolved conflicts

---

# 17. QUALITY BAR

The objective is production-grade software.

Do not optimize documentation or implementation for merely making
a visual prototype appear functional.

Prefer:

correctness
→ safety
→ privacy
→ maintainability
→ accessibility
→ performance
→ visual polish

over shortcuts.