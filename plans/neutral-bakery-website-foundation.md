# Plan: Neutral Bakery Website Foundation

> Source PRD: Create a Neutral Bakery Website Foundation

## Architectural Decisions

Durable decisions that apply across all phases:

- **Route**: The initial foundation targets the home page only.
- **Rendering**: Use server components by default; introduce client components only if interaction requires browser-side behavior.
- **Styling**: Use Tailwind CSS for styling and keep the visible design strictly grayscale and neutral.
- **Component base**: Use shadcn primitives as the reusable UI foundation, then extend them only where the project has a concrete need.
- **Content scope**: Build a navbar, hero section, and one supporting information section.
- **Data and backend**: No backend, persistence, API, CMS, auth, or external service integration is needed for this slice.
- **Verification**: Use lint, production build, responsive inspection, starter-content removal checks, and grayscale visual review as the quality bar.

---

## Phase 1: Neutral Shell Replaces Starter

**User stories**: 1, 5, 7, 10

### What to build

Replace the generated starter experience with a minimal neutral shell for the bakery website. Establish the global styling baseline, clean up starter metadata, and leave the home page rendering an intentional foundation that is ready for the real page sections.

### Acceptance Criteria

- [ ] Starter copy, starter links, and starter imagery are removed from the visible page.
- [ ] Metadata no longer uses generated starter defaults.
- [ ] The page renders a deliberate neutral foundation at the home route.
- [ ] Global styling remains Tailwind-based and strict grayscale/neutral.
- [ ] The app still passes lint and production build checks.

---

## Phase 2: shadcn Foundation Is Installed and Proven

**User stories**: 6, 7, 8, 10

### What to build

Add shadcn as the component base and prove it inside the actual page foundation with a small, useful primitive. Keep the setup compatible with the current Next and Tailwind versions, and keep the resulting UI neutral.

### Acceptance Criteria

- [ ] shadcn is configured for the project.
- [ ] At least one shadcn-based primitive is used in the visible foundation.
- [ ] The component setup follows the project's Tailwind approach.
- [ ] The component styling stays strict grayscale/neutral.
- [ ] The app still passes lint and production build checks.

---

## Phase 3: Navbar and Hero Become the First Complete Slice

**User stories**: 2, 3, 5, 8, 9

### What to build

Build the first complete page experience: a simple navbar and focused hero that establish the bakery website's structure, typography, spacing, and responsive behavior. The result should be visually reviewable on desktop and mobile without depending on final brand colors.

### Acceptance Criteria

- [ ] The navbar is visible, simple, and ready for future navigation expansion.
- [ ] The hero clearly communicates the bakery identity and primary offer.
- [ ] Typography hierarchy and spacing feel intentional in grayscale.
- [ ] The layout works on desktop and mobile widths.
- [ ] Calls to action, if present, use neutral styling only.
- [ ] No brand colors, gradients, or decorative color treatments are introduced.

---

## Phase 4: Supporting Information Section Completes the Foundation

**User stories**: 4, 8, 9

### What to build

Add one concise supporting information section below the hero. The section should validate page rhythm and extensibility while keeping the site intentionally small and restrained.

### Acceptance Criteria

- [ ] One supporting information section appears below the hero.
- [ ] The section gives useful context without expanding into a full marketing page.
- [ ] The section layout remains responsive and visually balanced.
- [ ] The section follows the same neutral styling system as the navbar and hero.
- [ ] The page can accept future sections without needing structural rework.

---

## Phase 5: Quality Pass and Verification

**User stories**: 5, 9, 10

### What to build

Perform a focused quality pass across the finished foundation. Verify the implementation against the PRD's restraint requirements, framework expectations, and responsive behavior.

### Acceptance Criteria

- [ ] Lint passes.
- [ ] Production build passes.
- [ ] Desktop and mobile layouts are manually inspected.
- [ ] Starter content is fully absent from the visible page.
- [ ] The visible UI remains strict grayscale and neutral.
- [ ] Navbar, hero, and information section do not overlap or break on small screens.
- [ ] shadcn components render correctly in the current Next and Tailwind setup.
