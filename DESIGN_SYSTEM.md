# Design System & Component Patterns

## Overview
This project uses a **dark-themed, modern design system**. All future edits should maintain consistency with these principles.

---

## Color Palette

### Primary Colors
- **Accent/Primary Blue**: `#38bdf8` (Sky 400) - Used for interactive elements, highlights, and primary actions
- **Light Accent**: `#7dd3fc` (Sky 300) - Hover states and softer accents
- **Background Dark**: `#0a0a0a` - Main page background
- **Surface**: `#1a1a1a` - Headers, footers, elevated surfaces
- **Border**: `#2a2a2a` - Subtle borders and dividers

### Text Colors
- **Primary Text**: `#f9fafb` (Gray 50) - Headings and primary content
- **Secondary Text**: `#e5e7eb` (Gray 200) - Body text and descriptions
- **Tertiary Text**: `#d1d5db` (Gray 300) - Muted labels and secondary info
- **Muted Text**: `#9ca3af` (Gray 400) - Footnotes and very subtle text

---

## Typography

### Heading Hierarchy
- **H1**: 2.25rem, color: `#f9fafb`
- **H2**: 1.5rem, font-weight: 600, margin-top: 2rem, color: `#f9fafb`
- **H3**: 1.25rem, font-weight: 600, margin-top: 1.5rem, color: `#f9fafb`

### Body Text
- **Default**: 1rem, color: `#e5e7eb`
- **Muted**: 0.85-0.95rem, color varies based on context
- **Links**: `#38bdf8` with underline, hover to `#7dd3fc`

---

## Component Patterns

### 1. **Cards** (`.landing-card`, `.uses-tier`)
- **Border**: 1px solid `#2a2a2a`
- **Border Radius**: 0.75-0.9rem
- **Background**: `rgba(26, 26, 26, 0.35)` or `rgba(26, 26, 26, 0.28)`
- **Padding**: 1rem-1.1rem
- **Hover Effect**: 
  - `transform: translateY(-2px)` OR `translateY(-1px)`
  - `border-color: rgba(56, 189, 248, 0.55)`
  - `background: rgba(26, 26, 26, 0.55)` (brightens slightly)
- **Transition**: `0.1s ease` for transform, `0.15s ease` for color changes

### 2. **Buttons**
#### Primary Button (`.landing-button-primary`)
- **Background**: `#38bdf8`
- **Color**: `#0a0a0a`
- **Font**: 1rem, weight: 700
- **Padding**: 0.8rem 1.1rem
- **Border Radius**: 999px (fully rounded)
- **Box Shadow**: `0 10px 25px rgba(56, 189, 248, 0.12)`
- **Hover**: 
  - Background: `#7dd3fc`
  - Transform: `translateY(-1px)`

#### Secondary Button (`.landing-button-secondary`)
- **Background**: `rgba(26, 26, 26, 0.35)`
- **Color**: `#e5e7eb`
- **Border**: 1px solid `#2a2a2a`
- **Hover**:
  - Background: `rgba(56, 189, 248, 0.1)`
  - Color: `#7dd3fc`
  - Box Shadow: `0 10px 25px rgba(0, 0, 0, 0.35)`

#### Chips (`.landing-chip`)
- **Similar to secondary buttons**
- **Smaller padding**: 0.5rem 0.75rem
- **Font size**: 0.9rem

### 3. **Accordion/Collapsible Sections** (`.uses-tier`)
- **Header**: Full-width button with flexbox
- **Chevron**: Uses `▾` character, rotates 180° when open
- **Body**: Max-height animation with `cubic-bezier(0.2, 0.9, 0.2, 1)`
  - Closed: `max-height: 0`
  - Open: `max-height: 2000px`
- **Transition Duration**: 320ms for max-height
- **Border top** on first child in open state: 1px solid `rgba(42, 42, 42, 0.9)`

### 4. **Hero Sections** (`.landing-hero`)
- **Background**: Radial gradient + linear gradient
- **Border**: 1px solid `#2a2a2a`, border-radius: 1rem
- **Glow Effect**: 
  - Uses CSS variables: `--glow-x`, `--glow-y`, `--glow-opacity`, `--glow-size`
  - `::before` pseudo-element with radial gradient
  - Mouse tracking via JavaScript
- **Hover State**: Increases glow opacity and size
- **Responsive Grid**: `grid-template-columns: 1.1fr 0.9fr` on desktop

### 5. **Metric Cards** (`.landing-metric-card`)
- **Background**: `rgba(10, 10, 10, 0.65)`
- **Padding**: 1rem
- **Border**: 1px solid `#2a2a2a`, border-radius: 0.75rem
- **Value font size**: 1.5rem, weight: 800
- **Sub text**: 0.95rem, color: `#d1d5db`

### 6. **Navigation**
- **Active Link**: `background: #38bdf8`, `color: #0a0a0a`, `font-weight: 600`
- **Hover State**: `background-color: rgba(56, 189, 248, 0.1)`, `color: #38bdf8`
- **Nav Highlight**: Animated background element with smooth transitions

---

## Spacing & Layout

### Padding Standards
- **Components**: 1rem to 1.1rem (internal)
- **Sections**: 2rem top margin
- **Page margin**: 2rem top, 1.5rem sides, 3rem bottom

### Gap Standards
- **Flex containers**: 0.5rem to 1.5rem (context-dependent)
- **Grid layouts**: 0.75rem to 1rem (tight), 1.5rem (generous)

### Responsive Breakpoint
- **Mobile**: 768px and below
- **Grid layouts collapse** from 3 columns to responsive
- **Padding adjusts** slightly on mobile (0.95rem → 1rem)

---

## Animation & Transitions

### Timing Functions
- **Standard easing**: `0.15s ease` (color changes)
- **Transform easing**: `0.1s ease` (hover effects)
- **Smooth opens**: `220ms cubic-bezier(0.2, 0.9, 0.2, 1)` (accordions)
- **Chevron rotation**: `180ms ease`

### Common Patterns
- **Hover lift**: `transform: translateY(-1px)` or `translateY(-2px)`
- **Color transitions**: All color properties animate smoothly
- **Pointer-events**: Disabled on overlay/pseudo elements to maintain interactivity

---

## Accessibility Notes

- **ARIA labels** on major sections and interactive areas
- **Keyboard navigation** supported throughout
- **Focus indicators** should be consistent with the design (use outline or border)
- **Semantic HTML**: `<button>`, `<article>`, `<section>` used appropriately
- **Text contrast**: All text meets WCAG AA standards

---

## Key Styling Rules for Future Development

1. **Always use the established color palette** - Don't introduce new colors
2. **Maintain the border/radius consistency**: `#2a2a2a` borders, 0.75-1rem radius
3. **Hover states must include**:
   - Subtle background lightening
   - Text color shift to lighter blue (`#7dd3fc`)
   - Small translateY lift (±1-2px)
4. **Transitions should be fast** (0.1-0.15s) for perceived responsiveness
5. **Backgrounds use rgba overlays** on base colors for depth
6. **Glow/gradient effects** use the cyan/sky blue palette
7. **Spacing is generous** but intentional - don't crowd components

---

## File Structure
- `App.jsx` - Main component with page logic and interactive elements
- `App.css` - All styling (1000+ lines, well-organized by section)
- Interactive chart component uses SVG with gradient filters
- Dark theme established throughout with no light mode

