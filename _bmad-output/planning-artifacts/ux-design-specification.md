---
title: "UX Design Specification: TravelClone"
status: "complete"
created: "2026-04-01"
updated: "2026-04-01"
stepsCompleted:
  - executive-summary
  - core-user-experience
  - emotional-response
  - design-inspiration
  - design-system-foundation
  - visual-design-foundation
  - design-directions
  - user-journey-wireframes
  - component-strategy
  - ux-patterns
  - responsive-accessibility
  - page-layout-specifications
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/product-brief-bmad-traveloka-clone.md"
---

# UX Design Specification: TravelClone

**Author:** UX Design Specialist
**Date:** 2026-04-01
**Product:** TravelClone — Travel Booking PWA
**Target Market:** Young Australian budget travelers, 18–35

---

## 1. Executive Summary

### Project Vision

TravelClone exists to answer one question better than any incumbent: "How can I travel on a budget, right now?" The interface is not a search tool — it is a discovery engine where deals surface before users know what they want. Every design decision traces back to three commitments: radical transparency, brutal simplicity, and instant trust.

### Target Users

**Primary — Young Budget Traveler (18–35, Australia)**
Digitally native, phone-first, price-sensitive but experience-hungry. Browses during lunch breaks and commutes. Makes decisions emotionally (deal excitement), confirms rationally (price trust). Primary device: iOS Safari on iPhone or Chrome on Android. Spending authority: $150–$600 per trip. Decision horizon: same day to 2 weeks out. Comparison behavior: 2–3 platforms simultaneously. Key friction points: hidden fees, too many steps, interfaces that feel like enterprise software.

**Secondary — Platform Operator (Admin)**
Single operator managing inventory, promotions, and bookings. Needs high-density data views, fast search/filter, and action-oriented workflows. Uses desktop exclusively. Aesthetic fit-for-purpose: clarity over beauty.

### Key Design Challenges

1. **Trust without track record** — A new platform with no brand equity must earn payment trust at the moment of checkout, with no prior relationship.
2. **Promotion-first without feeling pushy** — Deals must feel curated and relevant, not spam. Geographic personalization is essential.
3. **3-step booking flow completeness** — Removing 3+ standard booking steps (seat selection, insurance, baggage) requires compensatory clarity at each remaining step.
4. **Budget-first discovery UX** — No established pattern exists. Must invent a query-to-destination-card flow that feels natural, not a spreadsheet.
5. **PWA vs. native app gap** — Users arriving from Google or social expect app-quality feel. PWA install prompt timing and offline behavior must be polished.

### Design Opportunities

- **Emotional anchoring at deal cards** — Each deal card is a micro-ad: destination, price, mood. First impression of the brand happens here.
- **Price as design element** — Large, prominent, absolute price figures ("$189") function as visual anchors and trust signals simultaneously.
- **Progress clarity in booking flow** — 3-step indicator can feel like a feature, not overhead, if designed as reassurance.
- **Post-booking delight** — Confirmation screens are the most underdesigned surface in travel. A clean, shareable confirmation creates organic word-of-mouth.

---

## 2. Core User Experience

### The Core Action: Booking

Everything in the interface exists to enable or accelerate a single action: completing a booking. All secondary surfaces (account management, admin dashboard, my bookings) are support infrastructure. Navigation hierarchy, visual weight, and information architecture all subordinate themselves to: **see deal → select → confirm → pay → done**.

### Platform Strategy: PWA Mobile-First

The PWA strategy is not a compromise — it is a constraint that produces better design. Mobile-first forces hierarchy. One column forces prioritization. Touch targets force adequate sizing. Every design decision is validated first at 375px, then expanded for larger viewports. Desktop is an enhancement, not the baseline.

PWA capabilities surface as: web app manifest enabling home screen install, service worker caching the shell for near-instant reload, and install prompt shown contextually (post-first-booking or on 3rd visit) rather than on first load.

### Effortless Interactions

- Geolocation runs passively on homepage load; deals update without user action
- Google OAuth eliminates form-based registration; one tap from account choice
- Pre-filled forms from saved account data (name, email) at passenger detail step
- Date pickers default to next weekend (Friday to Sunday), reducing decision load
- Auto-format on form inputs: passport numbers, phone numbers, card numbers
- One-tap bundle selection: "Add hotel — save $45" button at flight selection step

### Critical Success Moments

| Moment | Design Response |
|--------|----------------|
| First homepage load (< 5s) | Deal cards visible before any interaction; geo-personalized title "Getaways from Sydney" |
| Deal card tap | Instant skeleton-to-content transition; price is the hero element |
| Booking step 3 (payment) | Total cost breakdown is full-width, above payment form; no surprises |
| Post-payment confirmation | Clean confirmation card with reference number, itinerary summary, "Add to Calendar" CTA |
| Cancellation confirmation | Refund amount and timeline shown immediately; trust preserved |

### Experience Principles

1. **Price first, always** — No interaction required to see real prices. Prices are absolute (AUD), never percent-off.
2. **3 steps, not a step more** — Every flow either fits in 3 steps or is redesigned until it does.
3. **Curated, not aggregated** — Fewer options, each shown with confidence. No infinite scroll dumps.
4. **Mobile-native, not mobile-tolerant** — Bottom navigation, thumb-reachable CTAs, 44px minimum tap targets.
5. **Honest empty states** — When no results exist, explain why and offer a next action. Never show a dead end.

---

## 3. Emotional Response Design

Emotional design is not decoration — it is behavioral architecture. Each phase of the user journey has a target emotional state that the visual design, copy, and interaction pattern must produce.

### Discovery Phase — Target Emotion: Excited Curiosity

**Context:** User lands on homepage, possibly with no destination in mind.
**Design response:** High-contrast deal card images with destination photography (not stock travel clichés), bold price anchors, urgency signals used sparingly ("This weekend only" on max 2 deals). Color warmth from orange accent on price elements. Headline copy is active: "Getaways from Sydney" not "Find cheap flights."
**Avoid:** Anxiety-inducing "Only 3 seats left!" countdown timers that trigger regret aversion rather than genuine excitement.

### Search Phase — Target Emotion: Confident Control

**Context:** User has selected a destination and is viewing search results.
**Design response:** Clean list with consistent information hierarchy. Filter controls are visible but not dominant. Price is right-aligned and the largest text element per row. Selected state uses primary blue fill with high contrast. Visual density is medium — enough options to feel choice, not so many as to trigger decision paralysis. Show 4–8 results on mobile, 8–12 on desktop.
**Avoid:** Infinite scroll on flight results (creates anxiety about missing the best option). Prefer paginated or "show more" at count = 8.

### Booking Phase — Target Emotion: Secure Trust

**Context:** User is entering personal details and payment information.
**Design response:** Minimum distractions on booking step pages — no promotional banners, no deal notifications. Progress indicator shows "Step 2 of 3" with clear labeling. SSL/security indicators visible near payment form. Stripe's hosted input elements inherit the design system's border-radius and color scheme. Cost summary is a fixed element at the bottom of mobile viewport, always visible. Logos of accepted payment methods (Visa, Mastercard, American Express) displayed.
**Avoid:** Any interface element that could distract from form completion. Modal popups during checkout are prohibited.

### Post-Booking Phase — Target Emotion: Relieved Satisfaction

**Context:** Payment confirmed, user sees confirmation screen.
**Design response:** Full-width success state using success green (#16A34A) as accent. Booking reference in large, monospaced font for easy screenshot/sharing. Checklist-style itinerary (flight time, hotel dates, total paid) in a card format designed to be screenshot-shareable. "Add to Calendar" and "Share" CTAs secondary to reference number. The word "Confirmed" in 32px bold is the visual anchor.
**Avoid:** Upsells on the confirmation screen. One optional "Add hotel?" prompt is acceptable only if no hotel was booked and it is positioned below the full confirmation content.

### Cancellation Phase — Target Emotion: Understood and Fairly Treated

**Context:** User is cancelling a booking, which implies disappointment.
**Design response:** Cancellation flow uses neutral color palette (no red until the destructive "Confirm Cancel" button). Refund amount displayed prominently before the confirmation action. Cancellation policy shown in plain English, not legal copy. After confirmation, refund timeline is specific ("5–7 business days to your card ending 4242"). Avoid any interface friction designed to discourage cancellation — this is an anti-dark-pattern brand commitment.

---

## 4. Design Inspiration

### Primary Reference: Traveloka

Traveloka's design language provides the foundational vocabulary: blue-dominant primary palette communicating trust and reliability, orange accent creating energy on price/CTA elements, card-heavy layout that compartmentalizes deals into scannable units, and a promotion banner system at the top of category pages. The card system creates a marketplace feel — each card is a mini-ad with contained visual identity.

**Adopt from Traveloka:**
- Card-grid deal layout on homepage
- Blue/orange color split (primary navigation vs. price/CTA elements)
- Sticky bottom navigation on mobile
- Prominent price display style with currency prefix and large numerals

**Reject from Traveloka:**
- Visual complexity (too many badges, labels, and secondary text per card)
- Cluttered header with too many navigation options
- Small touch targets on filter chips
- Aggressive promotional banners that feel spammy

### Secondary References

**Airbnb — Spatial Breathing**
Airbnb demonstrates that premium quality signals come from whitespace, not decoration. Card spacing of 16–24px. Content padding of 16–24px inside cards. Photography as the primary carrier of desire. Result listings that feel like editorial, not a database dump.

**Skyscanner — Search UX Clarity**
Skyscanner's departure/arrival airport selector with type-ahead and IATA code display is the industry benchmark for flight search UX. The date grid picker (showing prices by day) is a desirable post-MVP pattern. Filter sidebar behavior (sticky, with instant result updates) sets the standard.

**Google Flights — Radical Simplicity**
Google Flights proves that a search interface can be a single clean form with excellent auto-complete without sacrificing power. The "Price graph over time" is a benchmark for transparency. The overall visual restraint — minimal chrome, data-forward content — is the aspiration for TravelClone's search results pages.

**Design Synthesis:** Traveloka's deal architecture + Airbnb's spatial quality + Skyscanner's search precision + Google Flights' data transparency = TravelClone's design language.

---

## 5. Design System Foundation

### Component Library: shadcn/ui with Tailwind CSS

**Decision: shadcn/ui over Ant Design**

| Criteria | shadcn/ui + Tailwind | Ant Design |
|----------|---------------------|------------|
| Bundle size | ~15KB core + cherry-pick | 250KB+ even with tree-shaking |
| Custom theming | CSS variables — trivial to retheme | Theme tokens — verbose overrides |
| Mobile optimization | Headless, design-system-agnostic | Desktop-first component defaults |
| TypeScript | Full type safety, modern patterns | Types available but API surface large |
| Community velocity | Rapid updates, RSC support | Conservative release cadence |
| Traveloka-inspired theming | Straightforward via CSS var overrides | Requires component-level overrides |

**Rationale:** TravelClone's visual identity is a custom Traveloka-inspired theme, not a generic UI library aesthetic. shadcn/ui provides unstyled but accessible component primitives (Dialog, Select, Sheet, Popover, Command) that receive the design system's tokens directly via Tailwind config. Zero fighting the library for pixel-level control. Ant Design would impose its design opinions at every override.

### Customization Strategy

shadcn/ui components receive a custom Tailwind theme via `tailwind.config.ts` CSS variable mapping:

```
--primary         → #0064D2  (Traveloka blue)
--primary-foreground → #FFFFFF
--accent          → #FF6B00  (Traveloka orange)
--accent-foreground → #FFFFFF
--background      → #F8FAFC  (off-white page background)
--card            → #FFFFFF  (pure white card surface)
--border          → #E2E8F0  (light gray border)
--radius          → 8px      (default border radius)
```

All shadcn/ui components reference these CSS variables. Changing the theme means changing 12 variable values — not hunting through component files. This enables future dark mode, partner white-labeling, and A/B testing of color variants with zero component-level changes.

### Component Sourcing Strategy

- **From shadcn/ui registry:** Button, Input, Select, Dialog, Sheet, Popover, Calendar, Command, Badge, Card, Separator, Skeleton, Toast, Progress, Avatar, DropdownMenu, NavigationMenu, Tabs
- **Custom-built (design-system primitives):** DealCard, FlightCard, HotelCard, PriceDisplay, BookingStepIndicator, BudgetDiscoveryWidget, PromotionBanner, BookingConfirmation
- **Third-party:** Stripe Elements (payment inputs), React Hook Form (form state), date-fns (date formatting), lucide-react (icons)

---

## 6. Visual Design Foundation

### 6.1 Color System

#### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-600` | `#0064D2` | Primary buttons, active nav states, links, selected states |
| `primary-700` | `#0052A8` | Primary button hover state |
| `primary-500` | `#2980E8` | Focus rings, secondary interactive elements |
| `primary-100` | `#DBEAFE` | Primary color backgrounds (badge backgrounds, input focus tints) |
| `primary-50`  | `#EFF6FF` | Very light tint backgrounds |

#### Accent Colors (Traveloka Orange)

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-600` | `#FF6B00` | Price display, promotional badges, CTA highlights |
| `accent-700` | `#D45800` | Accent hover states |
| `accent-100` | `#FFF7ED` | Warm tint backgrounds behind prices |
| `accent-50`  | `#FFF8F1` | Subtle warm backgrounds |

#### Semantic Colors

| Token | Hex | Role | Usage |
|-------|-----|------|-------|
| `success-600` | `#16A34A` | Confirmed, paid, success | Booking confirmation, payment success, available status |
| `success-100` | `#DCFCE7` | Success background | Confirmation page tint |
| `warning-600` | `#D97706` | Alert, time-sensitive | Cancellation fee warnings, price validity countdowns |
| `warning-100` | `#FEF3C7` | Warning background | Warning banners |
| `error-600`   | `#DC2626` | Error, destructive | Form validation errors, cancellation confirm button |
| `error-100`   | `#FEE2E2` | Error background | Inline error states |
| `info-600`    | `#0284C7` | Informational | Policy explanations, helper text |
| `info-100`    | `#E0F2FE` | Info background | Info callouts |

#### Neutral / Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-900` | `#0F172A` | Primary body text, headings |
| `neutral-700` | `#334155` | Secondary text, labels |
| `neutral-500` | `#64748B` | Placeholder text, disabled labels |
| `neutral-300` | `#CBD5E1` | Dividers, disabled borders |
| `neutral-200` | `#E2E8F0` | Card borders, separator lines |
| `neutral-100` | `#F1F5F9` | Subtle background fills |
| `neutral-50`  | `#F8FAFC` | Page background |
| `white`       | `#FFFFFF` | Card surfaces, modal backgrounds |

#### Dark Mode (Future/Optional)

The CSS variable architecture supports dark mode via a `.dark` class on the `<html>` element. Dark palette swaps: page background `#0F172A`, card `#1E293B`, border `#334155`, text `#F8FAFC`. Not required for MVP but zero-cost to add later.

### 6.2 Typography

#### Font Selection

**Font: Inter (variable font)**
Rationale: Inter is engineered for screen readability at small sizes. At 14px body copy it outperforms alternatives in legibility on mobile screens. Variable font format (single file, multiple weights) eliminates multi-weight font loading. Google Fonts CDN delivery achieves cache hits across devices. The font is neutral enough to feel brand-aligned without being distinctive enough to distract.

**Implementation:**
```
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

#### Type Scale (4px baseline)

| Name | Size | Weight | Line Height | Letter Spacing | Usage |
|------|------|--------|-------------|----------------|-------|
| `text-xs` | 12px | 400/500 | 16px | +0.02em | Legal text, fine print, metadata |
| `text-sm` | 14px | 400/500 | 20px | 0 | Secondary text, form labels, captions |
| `text-base` | 16px | 400/500 | 24px | 0 | Body copy, card descriptions, input text |
| `text-lg` | 18px | 500/600 | 28px | -0.01em | Card headings, section titles |
| `text-xl` | 20px | 600 | 28px | -0.01em | Page section headings |
| `text-2xl` | 24px | 700 | 32px | -0.02em | Page titles (mobile) |
| `text-3xl` | 32px | 700 | 40px | -0.03em | Hero prices, confirmation numbers |
| `text-4xl` | 48px | 800 | 52px | -0.04em | Hero headlines (desktop only) |

**Price Display Typography**
Prices receive special treatment: `text-3xl` (32px), `font-extrabold` (800), `text-accent-600` (#FF6B00) with the currency symbol (`AUD`) as `text-sm` superscript in `text-neutral-700`. This creates visual hierarchy that anchors the user's eye to the price before secondary information.

### 6.3 Spacing System

**Base unit: 4px.** All spacing values are multiples of 4. An 8px grid governs component internal spacing. A 16px grid governs layout composition.

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Icon-text gap, tight inline spacing |
| `space-2` | 8px | Compact padding, chip internal spacing, icon margins |
| `space-3` | 12px | Form element internal padding (vertical) |
| `space-4` | 16px | Card internal padding, standard gap between elements |
| `space-6` | 24px | Section internal padding, gap between cards in grid |
| `space-8` | 32px | Section-to-section spacing, modal padding |
| `space-12` | 48px | Major section breaks, hero padding |
| `space-16` | 64px | Page-level vertical rhythm, footer padding |

**Layout Grid:**
- Mobile: 16px page margins, 8px column gutter, 1-column content
- Tablet: 24px page margins, 16px column gutter, 2-column content
- Desktop: 40px page margins (max-width 1200px, centered), 24px column gutter, 3–4 column content

### 6.4 Border Radius System

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Badges, chips, tags |
| `rounded` | 8px | Cards (DealCard, FlightCard, HotelCard), form inputs, buttons |
| `rounded-lg` | 12px | Modals, bottom sheets, filter panels, date picker |
| `rounded-xl` | 16px | Large promotional banners, hero cards |
| `rounded-full` | 9999px | Avatar, toggle switches, pill buttons, circular icons |

**Button border radius: 8px** — Not pill-shaped (too casual) but with sufficient rounding to feel approachable rather than corporate.

### 6.5 Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Inputs on hover, inactive cards |
| `shadow` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Default card elevation |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | Card on hover, dropdown menus |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modal dialogs, bottom sheet |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` | Active sticky header on scroll |

### 6.6 Icon System

**Library: lucide-react** — 24px default, 20px compact, 16px inline. Stroke width: 1.5px (default). Icons always paired with text labels on primary actions; standalone icons only for universally understood symbols (close, search, chevron).

---

## 7. Design Directions

### 7.1 Card-Heavy Deal Layout

The homepage deal section is a 2-column grid on mobile, 3-column on tablet, 4-column on desktop. Each DealCard contains:
- Full-bleed destination photography (aspect ratio 4:3, lazy-loaded)
- Destination city name overlay (bottom of image, gradient scrim for legibility)
- Price anchor below image: "from AUD $189" in orange accent
- Optional badge: "Bundle" / "Flash Sale" / "This Weekend" (orange, top-left of image)
- Flight duration or "Flight + Hotel" indicator
- Tap target: entire card

The card grid creates a marketplace aesthetic — comparable to an editorial travel magazine but with transactional intent. Cards are equal-sized, no hero asymmetry, to signal equal editorial curation across all deals (no pay-to-play prominence).

### 7.2 Promotion Banners

Promotion banners appear below the deal grid (not between cards). Horizontal scroll on mobile, full-width on desktop. Banner anatomy:
- Background: gradient from `primary-600` to `primary-700` or themed by promotion type
- Destination photography on right side (desktop) or as transparent overlay (mobile)
- Headline: bold, short ("Easter Flash Sale — 20% Off All Flights")
- Subtitle: validity and terms ("Valid Apr 18–21 · Applied at checkout")
- CTA button: accent orange "Shop Now" button
- Countdown timer (optional, only for truly time-limited promotions)

### 7.3 Clean Search Interface

The search bar on homepage occupies a white card with subtle shadow, positioned below the hero section on mobile, or as a floating card on a photographic hero on desktop. Tab system selects between Flights, Hotels, Bundles. Each tab reveals contextually appropriate inputs:

- **Flights tab:** From [city] → To [city] | Departure [date] Return [date] | [N] passengers
- **Hotels tab:** Destination [city] | Check-in [date] → Check-out [date] | [N] guests, [N] rooms
- **Bundles tab:** From [city] → To [city] | [dates] | [passengers/guests]

All inputs use the shadcn/ui Command component with type-ahead airport/city search. IATA codes shown as metadata next to airport names. Date inputs use a mobile-optimized popover calendar with swipe-between-months.

### 7.4 Step-Indicator Booking Flow

The booking flow uses a horizontal step indicator fixed at the top of booking pages (below the site header). Three steps, always visible:

```
[1 Search] ——— [2 Details] ——— [3 Payment]
   ●                ○                ○
```

Visual states: completed step = filled blue circle with checkmark; current step = filled blue circle with step number; future step = empty circle with step number in neutral-500. Step labels visible on desktop; only numbers visible on mobile (space constraint).

The step indicator is sticky on desktop, static on mobile (scrolls with content). Tapping a completed step navigates back without data loss (React state preserved).

---

## 8. User Journey Wireframes

### 8.1 Homepage

**Layout Structure (Mobile):**
```
┌─────────────────────────────────┐
│ [Logo]          [Sign In] [Menu]│  ← Header 56px, white, shadow on scroll
├─────────────────────────────────┤
│                                 │
│  "Getaways from Sydney"         │  ← Geo-personalized H1, 24px bold
│  "Where will you go next?"      │  ← Subtitle, 16px neutral-500
│                                 │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ [Flights] [Hotels] [Bundles]│ │  ← Search card, white, shadow-md, 8px radius
│ │                             │ │
│ │ From [Sydney ▾] To [______] │ │
│ │ [Fri Apr 5] → [Sun Apr 7]   │ │
│ │ [1 Adult ▾]                 │ │
│ │                             │ │
│ │    [Search Flights →]       │ │  ← Primary blue button, full-width
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│                                 │
│ ┌──────────┐ ┌──────────┐      │  ← Budget Discovery Widget
│ │  Where   │ │  $500    │      │    Teal/blue card, prominent CTA
│ │  can I   │ │ budget   │      │
│ │  go?     │ │ [Find →] │      │
│ └──────────┘ └──────────┘      │
│                                 │
├─────────────────────────────────┤
│ "Hot Deals"          [See all]  │  ← Section heading
│                                 │
│ ┌────────────┐ ┌────────────┐  │  ← 2-col deal card grid
│ │[IMG:GC]    │ │[IMG:Melb]  │  │
│ │Gold Coast  │ │Melbourne   │  │
│ │$149 →     │ │$129 →     │  │
│ └────────────┘ └────────────┘  │
│                                 │
│ ┌────────────┐ ┌────────────┐  │
│ │[IMG:Bali]  │ │[IMG:Cairns]│  │
│ │Bali Bundle │ │Cairns      │  │
│ │$299 →     │ │$220 →     │  │
│ └────────────┘ └────────────┘  │
│                                 │
├─────────────────────────────────┤
│ [Promotion Banner: Easter Sale] │  ← Full-width, horizontal scroll on mobile
├─────────────────────────────────┤
│ [✈] [🏨] [📦] [👤] [☰]        │  ← Bottom navigation 56px
└─────────────────────────────────┘
```

**Homepage — Desktop (1024px+):**
Hero section with full-width destination photography background (blur + gradient overlay). Search card floats over hero, 3-column form layout. Deal grid below hero in 4-column layout. Budget discovery widget in full-width card. Promotion banners in horizontal row.

**Key interactions:**
- Geolocation fires on load; "from [city]" in heading updates without reload
- Deal card hover shows subtle scale-up (1.02) with shadow increase
- Search form auto-saves last search to localStorage
- Budget discovery widget: clicking "Find" navigates to budget results page

### 8.2 Flight Search Results

**Layout Structure (Mobile):**
```
┌─────────────────────────────────┐
│ ← [SYD → MEL, Fri Apr 5, 1P]  │  ← Compact header with search summary
├─────────────────────────────────┤
│ [Sort: Cheapest ▾] [Filter ≡]  │  ← Sort and filter row
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Qantas QF401               │ │  ← FlightCard
│ │ 6:00am → 7:25am  1h 25m   │ │
│ │ Non-stop                   │ │
│ │                     $149 ▶ │ │  ← Price right-aligned, accent orange
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Virgin VA839               │ │
│ │ 8:30am → 9:50am  1h 20m   │ │
│ │ Non-stop                   │ │
│ │                     $169 ▶ │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Jetstar JQ401              │ │
│ │ 2:15pm → 3:40pm  1h 25m   │ │
│ │ 1 stop via BNE  3h 10m    │ │
│ │                     $109 ▶ │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Show 5 more results]           │  ← Paginated load more
├─────────────────────────────────┤
│ [✈] [🏨] [📦] [👤] [☰]        │
└─────────────────────────────────┘
```

**Filter Panel (Bottom Sheet on mobile, side panel on desktop):**
- Stop count: Non-stop / 1 stop / 2+ stops (checkbox group)
- Airlines (checkboxes with logo)
- Departure time: Morning / Afternoon / Evening (segmented control)
- Price range slider: min/max within visible results
- Duration: Max duration slider
- [Clear Filters] [Apply — N results] button row

**Desktop Layout:**
- Left sidebar 280px: filter panel (sticky, always visible)
- Main content: flight list with header showing "12 flights found, sorted by price"
- Results update in real-time as filters applied (no "Apply" button needed on desktop)

### 8.3 Hotel Search Results

**Layout Structure (Mobile):**
```
┌─────────────────────────────────┐
│ ← [Gold Coast, Apr 5-7, 2G]   │
├─────────────────────────────────┤
│ [List ≡] [Grid ⊞]  [Sort▾] [≡]│  ← View toggle + sort/filter
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ [Hotel Photo 16:9 ratio]   │ │  ← HotelCard in list view
│ │                             │ │
│ │ Surfers Paradise Hotel ★★★ │ │
│ │ 0.3km from beach           │ │
│ │ WiFi · Pool · Parking       │ │
│ │ Per night:        $90 →   │ │
│ │ 2 nights total:   $180     │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ [Hotel Photo]               │ │
│ │ Meridian Hotel ★★★★        │ │
│ │ 0.1km from beach           │ │
│ │ WiFi · Pool · Spa · Parking │ │
│ │ Per night:       $145 →   │ │
│ │ 2 nights total:  $290      │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Grid View (Mobile 2-col, Desktop 3-col):**
Compact cards, photography dominant (2:3 portrait aspect ratio), hotel name + star rating + price per night only. No amenity chips in grid view — tapping opens a quick-view sheet with full details before committing to select.

**Hotel Filter Options:**
- Star rating: 1★ to 5★ (toggle buttons)
- Price per night: range slider
- Amenities: WiFi / Pool / Parking / Restaurant / Gym (checkboxes)
- Distance from center: slider
- Property type: Hotel / Apartment / Resort / Hostel

### 8.4 Booking Flow

#### Step 1 — Search (Entry Point)

The search forms described in §8.1 are Step 1. Submitting the form is the action that transitions to Step 2. The step indicator appears from Step 2 onward.

#### Step 2 — Select + Details

**Sub-step 2a: Flight/Hotel Selection (already covered in §8.2/8.3)**
After selecting a flight from search results, the step indicator appears and the page shows:

```
┌─────────────────────────────────┐
│ ← Back         Step 2 of 3    │
│ ●——●——○                        │  ← Progress: steps 1+2 active
├─────────────────────────────────┤
│ SELECTED FLIGHT                 │
│ ┌─────────────────────────────┐ │
│ │ QF401 · Qantas             │ │
│ │ SYD 6:00am → MEL 7:25am   │ │
│ │ Fri Apr 5 · Non-stop       │ │
│ │                     $149   │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ ADD HOTEL? (Save $45)          │  ← Optional hotel upsell (single row, not modal)
│ ┌─────────────────────────────┐ │
│ │ [Hotel suggestion for MEL] │ │
│ │               $180 [Add +] │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ PASSENGER DETAILS               │
│                                 │
│ First Name *                    │
│ [________________________]      │
│                                 │
│ Last Name *                     │
│ [________________________]      │
│                                 │
│ Email *                         │
│ [________________________]      │
│                                 │
│ Phone                           │
│ [+61 ___________________]      │
│                                 │
│ Date of Birth *                 │
│ [DD / MM / YYYY]               │
├─────────────────────────────────┤
│ TOTAL: $149      [Continue →]   │  ← Sticky bottom CTA bar
└─────────────────────────────────┘
```

Form pre-fills from account data (name, email, phone) if logged in. Field-level validation on blur (not on keystroke). Error messages appear immediately below the field in `text-error-600`.

#### Step 3 — Payment

```
┌─────────────────────────────────┐
│ ← Back         Step 3 of 3    │
│ ●——●——●                        │  ← All steps active
├─────────────────────────────────┤
│ ORDER SUMMARY                   │
│                                 │
│ Flight SYD → MEL (QF401)        │
│ Fri Apr 5 · 1 passenger  $149  │
│                                 │
│ ─────────────────────────────── │
│ TOTAL                    $149  │  ← Large, bold, clear
│ No hidden fees           ✓     │  ← Trust signal
├─────────────────────────────────┤
│ PAYMENT                         │
│                                 │
│ Card Number                     │
│ [Stripe Element_______________] │  ← Stripe hosted input
│                                 │
│ Expiry           CVV            │
│ [MM/YY________] [___]          │
│                                 │
│ Name on Card                    │
│ [________________________]      │
│                                 │
│ [🔒] [Visa] [MC] [Amex]        │  ← Security + payment logos
├─────────────────────────────────┤
│         [Pay $149 →]            │  ← Full-width, accent button, 52px height
└─────────────────────────────────┘
```

No promotional elements. Single focused action. Stripe Elements styled to match design system (border-radius 8px, border-color neutral-300, focus border primary-600).

#### Confirmation Screen (Post-Step 3)

```
┌─────────────────────────────────┐
│                                 │
│  ✓ Booking Confirmed!          │  ← Success green, 32px, center-aligned
│                                 │
│  REF: TCL-2024-00847           │  ← Monospace, 20px, neutral-900
│                                 │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ ITINERARY SUMMARY           │ │
│ │                             │ │
│ │ ✈ SYD → MEL               │ │
│ │   QF401 · Fri Apr 5        │ │
│ │   6:00am → 7:25am          │ │
│ │                             │ │
│ │ Passenger: Mia Johnson      │ │
│ │ Total Paid: $149 AUD        │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ [Add to Calendar] [Share]       │
│                                 │
│ Confirmation email sent to:     │
│ mia@example.com                 │
│                                 │
│ [View My Bookings →]            │
└─────────────────────────────────┘
```

### 8.5 Budget-First Discovery

```
┌─────────────────────────────────┐
│ ← Back                         │
│ WHERE CAN I GO?                 │
├─────────────────────────────────┤
│ From city                       │
│ [Melbourne ____________________]│
│                                 │
│ My budget (AUD total)           │
│ [$ 500 _____________________]  │
│                                 │
│ Trip length                     │
│ [3 days ▾]                     │
│                                 │
│ When (optional)                 │
│ [Any time ▾]                   │
│                                 │
│    [Find Destinations →]        │
├─────────────────────────────────┤
│ DESTINATIONS WITHIN $500        │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ [IMG: Bali]                 │ │
│ │ Bali, Indonesia             │ │
│ │ Flight $280 + Hotel $140    │ │
│ │ TOTAL: $420                 │ │  ← Bold, accent orange, prominent
│ │ 3 nights from Apr 12        │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ [IMG: Adelaide]             │ │
│ │ Adelaide, Australia         │ │
│ │ Flight $130 + Hotel $180    │ │
│ │ TOTAL: $310                 │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

Results sorted by total cost ascending. Each destination card taps through to a pre-filtered flight+hotel combination. "Adjust budget" allows inline slider edit without full re-query; debounced re-query on slider release.

### 8.6 My Bookings

```
┌─────────────────────────────────┐
│ ← Back                         │
│ MY BOOKINGS                     │
├─────────────────────────────────┤
│ [Upcoming] [Past] [Cancelled]   │  ← Tab filter
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ UPCOMING                    │ │
│ │ ─────────────               │ │
│ │ ✈ SYD → GC (QF401)         │ │
│ │ Fri Apr 5 · 6:00am         │ │
│ │ Ref: TCL-2024-00847        │ │
│ │ Status: ● Confirmed         │ │  ← Green dot
│ │ Total: $149                 │ │
│ │ [View Details] [Cancel]     │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ✈ MEL → BNE + 🏨 Hotel     │  ← Bundle indicator
│ │ Sat Mar 15 · 9:30am        │ │
│ │ Ref: TCL-2024-00631        │ │
│ │ Status: ● Confirmed         │ │
│ │ Total: $284                 │ │
│ │ [View Details] [Cancel]     │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

Status badges use semantic colors: "Confirmed" = success-600, "Pending" = warning-600, "Cancelled" = neutral-500, "Refund Processing" = info-600. Each booking card taps to full detail view showing complete itinerary and cancellation policy.

### 8.7 Admin Dashboard

**Layout (Desktop only — no mobile-optimized admin):**

```
┌──────────┬─────────────────────────────────────────────────────┐
│          │ [Header: Admin Dashboard]       [Alex ▾] [Logout]   │
│ SIDEBAR  ├─────────────────────────────────────────────────────┤
│          │                                                       │
│ Overview │ OVERVIEW                                             │
│ Bookings │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│ Flights  │ │ 47       │ │ 3        │ │ 12       │ │ $8,420 │ │
│ Hotels   │ │ Bookings │ │ Pending  │ │ Active   │ │ Revenue│ │
│ Bundles  │ │ this wk  │ │ Refunds  │ │ Promos   │ │ this wk│ │
│ Promos   │ └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│ Users    │                                                       │
│ Settings │ RECENT BOOKINGS                   [Search] [Filter]  │
│          │ ┌─────────────────────────────────────────────────┐ │
│          │ │ Ref          User      Route    Date    Amount   │ │
│          │ │ TCL-0847  mia@...  SYD→MEL  Apr 5   $149  ✓   │ │
│          │ │ TCL-0846  jake@...  MEL→BNE  Apr 5   $284  ✓   │ │
│          │ │ TCL-0845  sam@...  SYD→PER  Apr 4   $220  ⏳  │ │
│          │ └─────────────────────────────────────────────────┘ │
│          │                                                       │
│          │ PROMOTION STATUS                      [New Promo +]  │
│          │ ┌─────────────────────────────────────────────────┐ │
│          │ │ Name         Target  Valid Until  Status         │ │
│          │ │ Easter Flash  SYD    Apr 21       ● Active  [✎]│ │
│          │ │ Winter Sales  All    May 31       ○ Draft   [✎]│ │
│          │ └─────────────────────────────────────────────────┘ │
└──────────┴─────────────────────────────────────────────────────┘
```

Admin sidebar width: 220px. Admin uses shadcn/ui DataTable with TanStack Table for all list views. Actions (edit, delete, resend email, process refund) available via row-level dropdown menus. Breadcrumb navigation for nested admin pages (e.g., Bookings > TCL-0847 > Timeline).

---

## 9. Component Strategy

### Core Component Inventory

#### DealCard
- **Purpose:** Homepage deal grid unit
- **Props:** `destination`, `imageUrl`, `priceFrom`, `currency`, `badgeText?`, `badge variant?` (`sale` | `bundle` | `new`), `flightDuration?`, `onClick`
- **Dimensions:** 160px wide (mobile 2-col), full responsive. Image aspect-ratio 4:3.
- **States:** default, hover (scale 1.02 + shadow-md), loading (Skeleton)
- **A11y:** `role="button"`, `aria-label="Book {destination} from {price}"`, keyboard focusable

#### FlightCard
- **Purpose:** Flight search result row
- **Props:** `airline`, `airlineCode`, `flightNumber`, `departure`, `arrival`, `origin`, `destination`, `duration`, `stops`, `price`, `isSelected`, `onClick`
- **Layout:** Airline logo (24px) + name left; times + duration center; price right with select arrow
- **States:** default, hover, selected (blue border 2px, light primary-50 background), loading skeleton
- **A11y:** Full flight info in `aria-label`, `role="radio"` within a group

#### HotelCard
- **Purpose:** Hotel search result item (list or grid view)
- **Props:** `name`, `starRating`, `imageUrl`, `distanceLabel`, `amenities[]`, `pricePerNight`, `totalPrice`, `nights`, `isSelected`, `viewMode` (`list` | `grid`), `onClick`
- **List view:** 16:9 image left, details right (72px image height on mobile)
- **Grid view:** Full-width image top, compact details below

#### SearchForm
- **Purpose:** Multi-tab search entry (Flights/Hotels/Bundles)
- **Sub-components:** `AirportInput` (Command + type-ahead), `DateRangePicker` (Calendar popover), `PassengerSelector` (stepper popover)
- **State:** Active tab selection, form field values, validation state
- **Form library:** React Hook Form with Zod schema validation

#### BookingStepIndicator
- **Purpose:** Progress display in booking flow
- **Props:** `currentStep` (1|2|3), `completedSteps[]`
- **Visual:** Horizontal steps with connecting line, circle nodes, step labels below
- **Behavior:** Completed steps are tappable (navigate back); future steps are inert

#### BudgetDiscoveryWidget
- **Purpose:** "Where can I go?" entry widget on homepage
- **Props:** `defaultCity`, `onSearch(query)` callback
- **Fields:** City autocomplete, budget number input (AUD), trip duration select, date range optional
- **Validation:** Budget must be positive integer; city must be valid airport/city
- **Loading state:** Skeleton cards while awaiting results

#### PriceDisplay
- **Purpose:** Consistent price formatting throughout the app
- **Props:** `amount`, `currency` (default AUD), `size` (`sm`|`md`|`lg`), `prefix?` (e.g., "from"), `strikethrough?` (original price for bundles)
- **Renders:** Currency prefix in small neutral text, amount in accent orange at requested size, "AUD" label
- **Accessibility:** `aria-label="Price: {amount} Australian dollars"`

#### PromotionBanner
- **Purpose:** Full-width promotion showcase
- **Props:** `headline`, `subtitle`, `ctaText`, `ctaUrl`, `imageUrl?`, `validUntil?`, `backgroundColor` (defaults to primary gradient)
- **Layout:** Text left, image right (desktop), text over image (mobile)
- **Animation:** Fade-in on first render; no auto-rotation (single banner per viewport)

#### BookingConfirmation
- **Purpose:** Post-payment success screen
- **Props:** `bookingRef`, `flightDetails?`, `hotelDetails?`, `totalPaid`, `passengerName`, `email`
- **Sections:** Success header, reference number, itinerary summary card, CTA row (Calendar + Share + My Bookings)
- **Design for shareability:** Card section within confirmation designed at 375px to screenshot cleanly

#### NavigationBar
- **Mobile (bottom):** 5 tabs — Flights, Hotels, Deals, My Bookings, Account. Icons + labels. Active tab = primary-600 with filled icon. Height: 56px + safe area inset.
- **Desktop (top):** Logo left, nav links center (Flights, Hotels, Deals, My Bookings), Sign In / Account avatar right. Height: 64px, white background, border-bottom on scroll.
- **Shared state:** Active route determines active tab/nav item.

#### Footer (Desktop only)
- **Sections:** Quick links (About, Contact, Terms, Privacy), Legal text (ATOL, licensing), Social links, Copyright
- **Layout:** 3-column grid at 1024px+
- **Mobile:** Footer not displayed below main content; bottom nav handles primary navigation

---

## 10. UX Patterns

### 10.1 Navigation Patterns

**Mobile Bottom Navigation**
5-item persistent bottom nav. Maximum items: 5 (per platform conventions). All items show icon + label (16px label, 24px icon). Tapping active tab scrolls page to top. "Deals" item links to homepage deal section. "My Bookings" deep links to bookings list (prompts auth if not logged in).

**Desktop Top Navigation**
Full top nav with logo, 4 primary links, and account/auth button. Mega menu not used (complexity not warranted for MVP). Sticky header with shadow on scroll (`shadow-xl`). Active page link underlined with `primary-600` 2px bottom border.

**Back Navigation**
Every page except homepage and authentication has a back chevron in the header. Back action uses browser history (no custom navigation stack). Scroll position preserved on back navigation (React state management).

### 10.2 Form Patterns

**Inline Validation**
- Validate on blur (field loses focus), not on keystroke
- Error appears immediately below the field in `text-sm text-error-600`
- Error icon (`AlertCircle` 16px) inline before error text
- Field border changes to `border-error-600` on error state
- On correction, error clears immediately (reactive validation after first error)

**Auto-fill and Pre-fill**
- Browser autofill attributes on all standard fields (`autocomplete="given-name"`, `autocomplete="email"`, etc.)
- Logged-in users: name, email, phone pre-filled from profile at booking step 2
- Last search saved to localStorage, pre-populates search form on return visit
- IATA airport codes resolve to full names in type-ahead but submit IATA code to API

**Date Picker**
- Mobile: native date input with styled wrapper (avoid library pickers on mobile for performance)
- Desktop: shadcn/ui Calendar popover with range selection, month navigation, "This Weekend" and "Next Weekend" quick-select chips
- Dates in the past are disabled. Return date must be after departure date (enforced in state).

**Search Type-Ahead (Airport/City)**
- Debounce: 150ms after keystroke
- Minimum characters: 2
- Shows: City name, country, IATA code — "Sydney, Australia (SYD)"
- Popular airports shown on empty state (no input yet): Sydney, Melbourne, Brisbane, Perth, Adelaide
- Loading indicator: subtle spinner in right side of input during fetch

### 10.3 Loading States

**Skeleton Screens**
All content cards (DealCard, FlightCard, HotelCard) have skeleton variants using `animate-pulse` on `bg-neutral-200` shapes matching the content layout. Skeleton displayed for minimum 300ms to avoid flash on fast connections.

**Page Loading**
Next.js loading.tsx files provide route-level skeleton screens. Booking flow steps never show blank pages — skeleton versions of forms appear while data fetches.

**Search Results Loading**
While flight/hotel results are fetching: 4 FlightCard skeletons displayed. If results take > 5 seconds, show a "Taking longer than usual... checking live prices" message.

**Button Loading States**
Async action buttons (Search, Pay, Confirm Cancellation) enter loading state on click: text replaced by spinner, button disabled, minimum loading duration 400ms to prevent jarring instant responses.

### 10.4 Error Handling

**Inline Form Errors**
Field-level errors under input fields. Never show all form errors at once at page top (overwhelming). Show global form error only for cross-field validation ("Return date must be after departure date").

**Toast Notifications**
Used for: async success messages ("Cancellation confirmed"), async error messages ("Payment failed — please try again"), non-blocking info ("Prices updated — refresh for latest"). Position: top-right (desktop), top-center (mobile). Duration: 4s for success, 6s for error, persistent until dismissed for critical errors. Built with shadcn/ui Toast + Sonner.

**API Error States**
- Search fails: Full-page error state with "We couldn't load flights right now. Try again →" and a secondary "Browse deals instead →" link
- Payment fails: Inline error below payment form with Stripe error message (never expose raw API error messages; map to user-friendly copy)
- Network offline: Toast notification with "You're offline. Check your connection." Booking flow pages prevent action while offline.

**Empty States**
Every list that can be empty has a designed empty state:
- No search results: Illustration (no flights icon) + "No flights found for this route. Try nearby dates or different airports." + date adjustment quick-picks
- No bookings: "You haven't booked anything yet. Start exploring deals →" with link to homepage
- Admin: no bookings this week: Neutral empty state, no illustration needed (data-oriented context)

### 10.5 Modals and Sheets

**Bottom Sheet (Mobile)**
Used for: filter panels, passenger selectors, date pickers, hotel quick-view. Standard heights: half-screen (50vh) for simple selectors, full-screen (90vh) for rich content. Always includes drag handle and close button.

**Dialog (Desktop)**
Used for: cancellation confirmation, delete confirmation in admin, photo lightbox. Max-width 480px. Always requires explicit confirm/cancel buttons (no dismiss by backdrop click on destructive actions).

**Never use modals for:**
- Booking flow steps (full page only)
- Error messages that require reading long text
- Forms with more than 4 fields

---

## 11. Responsive & Accessibility

### 11.1 Breakpoints

| Breakpoint | Token | Width | Behavior |
|------------|-------|-------|----------|
| Mobile | `sm` | 375px+ | 1 column, bottom nav, touch-optimized |
| Mobile-L | `md` | 480px+ | Slightly wider cards, 2-col deal grid |
| Tablet | `lg` | 768px+ | 2-col content, sidebar filters appear |
| Desktop | `xl` | 1024px+ | Full desktop layout, top nav, 4-col deals |
| Wide | `2xl` | 1280px+ | Max-width content container (1200px centered) |

**Mobile-First Implementation:**
All Tailwind classes written mobile-first. Desktop variations added with `lg:` prefix. No `max-sm:` or `max-md:` overrides — these indicate design-first mobile layout was not implemented correctly.

### 11.2 Touch Optimization

- Minimum tap target: **44×44px** for all interactive elements (WCAG 2.5.5)
- Buttons: min-height 44px, min-width 44px
- Bottom nav items: equal width, full height of nav bar (56px)
- Deal cards: entire card is tap target
- Table rows in admin: 48px height for easy row-level action access
- Spacing between adjacent tap targets: 8px minimum
- Swipe gestures: booking step back = swipe right (implemented with Framer Motion); bottom sheet dismiss = swipe down

### 11.3 WCAG 2.1 AA Compliance

**Color Contrast:**
- Normal text (< 18pt): minimum 4.5:1 ratio
  - `neutral-900` on `white`: 16:1 — pass
  - `neutral-700` on `white`: 9.7:1 — pass
  - `primary-600` on `white`: 4.6:1 — pass (borderline, verify in contrast checker)
  - `accent-600` on `white`: 3.1:1 — **FAIL for text** — use only for large text (18pt+) or decorative elements; use `accent-700` (#D45800) for text on white backgrounds
- Large text (≥ 18pt or 14pt bold): minimum 3:1 ratio
- UI components and graphical elements: minimum 3:1 against adjacent colors

**Keyboard Navigation:**
- All interactive elements reachable via Tab key
- Tab order follows visual reading order (left-to-right, top-to-bottom)
- Focus indicator: 2px solid `primary-600` ring with 2px offset (visible against all background colors)
- Skip navigation link: `<a href="#main-content">Skip to main content</a>` first element in DOM (visible on focus)
- Booking flow: all form fields, buttons, and interactive elements keyboard accessible
- Search type-ahead: arrow keys navigate results; Enter selects; Escape closes

**Screen Reader Support:**
- Semantic HTML first: `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<article>`, `<h1>`–`<h6>` hierarchy
- All images: descriptive `alt` text ("Gold Coast beach destination, flights from $149"); decorative images: `alt=""`
- Flight cards: `aria-label` combines all relevant info ("Qantas flight QF401, Sydney to Melbourne, Friday April 5th, 6am to 7:25am, non-stop, $149 Australian dollars")
- Form inputs: `<label>` explicitly associated via `htmlFor`/`id`, never relying on placeholder alone
- Error messages: `aria-describedby` connecting input to error element; `aria-invalid="true"` on invalid inputs
- Live regions: `aria-live="polite"` on search result count updates; `aria-live="assertive"` on payment success/failure
- Modal dialogs: `role="dialog"`, `aria-modal="true"`, focus trapped inside modal while open, focus returns to trigger on close
- Bottom navigation: `role="navigation"`, `aria-label="Main"`, active item has `aria-current="page"`

**Reduced Motion:**
All animations respect `prefers-reduced-motion: reduce`. Skeleton pulse animation disabled; transitions reduced to opacity changes; swipe gesture animations suppressed.

### 11.4 Internationalization Readiness

While MVP is English-only with AUD currency, the architecture accommodates future localization:
- All user-facing strings in translation-ready format (no string concatenation for sentence fragments)
- Currency formatting via `Intl.NumberFormat` (not string templates)
- Date formatting via `date-fns/locale` with locale prop pattern
- RTL layout support via Tailwind's `rtl:` modifier (not implemented but structurally possible)

---

## 12. Page Layout Specifications

### 12.1 Homepage

**Layout:** Single-column mobile. Two-section desktop: hero (full-width) + content grid (max-width 1200px centered).

**Key Components:** NavigationBar, SearchForm, BudgetDiscoveryWidget, DealCard grid, PromotionBanner, Footer (desktop)

**Information Hierarchy (mobile, top to bottom):**
1. Header with logo and auth
2. Geo-personalized headline
3. Search form card (Flights default tab active)
4. Budget discovery widget (horizontal card, 80px height)
5. "Hot Deals" section with deal card 2-column grid (6 cards, "See all" link)
6. Promotion banner (horizontal scroll of 2–3 banners)
7. Bottom navigation

**Desktop Variations:**
- Hero section: full-width photographic background (1440px wide, 500px tall), search form card centered overlaying bottom portion of hero, headline white text over hero
- Deal grid: 4-column layout
- Budget discovery widget: inline with deal section as a featured card at grid position 1 or below section heading
- Promotion banners: horizontal row of 2–3 equal-width cards

**Interaction Patterns:**
- Geolocation fires on mount; `window.navigator.geolocation.getCurrentPosition()`; on success updates "from [city]" in heading and pre-fills "From" in search form; on failure/decline uses IP geolocation fallback (server-side)
- Search form submission triggers router.push to `/flights?...` or `/hotels?...` with URLSearchParams
- Deal card tap navigates to pre-seeded search results for that deal
- Budget discovery form submit navigates to `/discover?budget=500&from=MEL&days=3`

**Responsive Behavior:**
- 375px: 2-col deal grid, compact search form, small header (56px)
- 768px: 2-col deal grid expands to 3-col, search form tabs wider
- 1024px: Hero photo background, 4-col deal grid, full footer, top navigation

### 12.2 Flight Search Results Page

**Layout:** Single-column list on mobile. Sidebar (280px) + main content (flex-1) on desktop.

**Key Components:** FlightCard, FilterPanel (Sheet/sidebar), SortDropdown, SearchSummaryBar, PaginationControl

**Information Hierarchy:**
1. Compact search summary bar with "Modify Search" link
2. Sort + filter controls row
3. Result count ("12 flights found")
4. FlightCard list (8 per page on mobile, 12 on desktop)
5. Load more / pagination

**Filter State Management:**
Filter state lives in URL query params (`?stops=0&airline=QF&sort=price`). Enables sharing filtered results and browser back navigation preserving filters. Desktop: filters update results in real-time via React state. Mobile: filter sheet has "Apply" button that closes sheet and scrolls to top.

**Responsive Behavior:**
- 375px: Full-width cards, filter as bottom sheet triggered by "Filter" button
- 768px: 2 FlightCards side-by-side (uncommon pattern — keep as single column for flight list)
- 1024px: Left sidebar with always-visible filters; main content width ~720px

**Empty States:**
- No results: Illustration + "No flights found. Try adjusting your dates or filters." + date quick-adjust widget
- API error: "Search unavailable. Try again →"
- Loading: 6 FlightCard skeletons

### 12.3 Hotel Search Results Page

**Layout:** Identical structure to flight results. Additional view toggle (List/Grid) in sort bar.

**Key Components:** HotelCard (list and grid variants), FilterPanel, ViewToggle, SortDropdown

**Grid View Spec (desktop):** 3-column grid. HotelCard height: 320px. Image: 180px. Content: 140px. Hotel name (text-lg), star rating (star icons), price per night (text-xl accent), total price (text-sm neutral-700).

**List View Spec:** HotelCard horizontal. Image: 120×90px left. Content right: name, location tag, amenity chips (max 3 visible, "+ N more"), price block right-aligned.

### 12.4 Booking Flow Pages (Steps 2–3)

**Layout:** Single-column, max-width 600px, centered. No sidebar. Minimal header (logo + step indicator only, no full navigation).

**Rationale for reduced header:** Removing the full nav during checkout reduces exit rate. Users who reach Step 2 have high purchase intent; removing distractions increases completion rate.

**Sticky Elements:**
- Step indicator: sticky at top (mobile and desktop)
- Cost summary bar: sticky at bottom (mobile only, showing total and "Continue →")
- On desktop: cost summary in right-column (2-col layout at 1024px+: form left, summary right)

**Validation Behavior:**
- Form submission blocked while any field has error
- On submit attempt with errors: all invalid fields show errors simultaneously; page scrolls to first error
- "Continue →" button shows "Saving..." spinner during async validation

### 12.5 Budget Discovery Page

**Layout:** Top query form (full-width card), results below in destination card grid (1-col mobile, 2-col tablet, 3-col desktop).

**Key Components:** BudgetDiscoveryWidget (expanded form), DestinationResultCard, SortBar

**DestinationResultCard:**
- Destination photography (full-bleed, 2:1 aspect ratio)
- City name + country overlay
- Flight + hotel cost breakdown (2 rows)
- Total cost (large, accent orange)
- Date range (smallest available dates within query)
- Tap: navigates to itinerary detail view for that destination

**Empty/Error States:**
- No destinations within budget: "No destinations found for $300 from Sydney. Try increasing your budget or extending your dates." + budget adjustment slider
- Too many results (> 20): show top 8, "Sorted by value — see all →"

### 12.6 My Bookings Page

**Layout:** Tab bar (Upcoming/Past/Cancelled) + booking card list. Full-width, max-width 700px centered.

**Booking Card Structure:**
- Header row: route/destination + booking type icon (flight, hotel, bundle)
- Date and time
- Reference number (monospace)
- Status badge (semantic color)
- Total paid
- Action buttons: "View Details" (primary) + "Cancel" (secondary, only on upcoming cancellable bookings)

**Booking Detail Page (nested):**
- Full itinerary breakdown
- Cancellation policy card (collapsible)
- "Cancel Booking" button at bottom (destructive, requires confirmation dialog)

### 12.7 Admin Dashboard

**Layout:** Fixed left sidebar (220px) + main content (full remaining width). Top header bar (64px) with admin branding, user menu, logout.

**Sidebar Navigation Items:**
Overview | Bookings | Flights | Hotels | Bundles | Promotions | Users | Settings

**Data Table Standard:**
All admin list pages use a consistent DataTable pattern:
- Header row: title + primary action button ("+ New Promotion")
- Search input (filters visible rows client-side for < 1000 rows; server-side for larger datasets)
- Column headers sortable (click to toggle asc/desc, indicator arrow)
- Row hover: subtle `neutral-50` background, actions column reveals edit/delete/action buttons
- Pagination: 25 rows per page, page number display, prev/next controls
- Empty state: contextual message + primary action button

**Admin Form Pages (Create/Edit):**
- Side-panel (Sheet) approach for simple forms (< 6 fields): promotion create/edit, user role change
- Full-page form for complex entities (flight create, hotel create): 2-column layout at desktop

**Admin Booking Detail:**
- Booking timeline as vertical stepper: Created → Payment Initiated → Payment Confirmed → Booking Confirmed → (Cancellation Requested → Refund Processed → Cancelled)
- Action panel: Resend Email, Process Refund, Manual Status Override (with reason field)

---

## Appendix A: Design Token Quick Reference

```css
/* Core tokens — customize here to retheme the entire app */
:root {
  --primary: 214 100% 41%;          /* #0064D2 */
  --primary-foreground: 0 0% 100%;   /* white */
  --accent: 24 100% 50%;             /* #FF6B00 */
  --accent-foreground: 0 0% 100%;    /* white */
  --background: 210 40% 98%;         /* #F8FAFC */
  --card: 0 0% 100%;                 /* white */
  --border: 214 32% 91%;             /* #E2E8F0 */
  --input: 214 32% 91%;              /* #E2E8F0 */
  --radius: 0.5rem;                  /* 8px */
  --success: 142 72% 36%;            /* #16A34A */
  --warning: 38 92% 50%;             /* #F59E0B */
  --error: 0 72% 51%;                /* #DC2626 */
  --info: 199 89% 48%;               /* #0284C7 */
}
```

## Appendix B: Component File Structure

```
src/
  components/
    ui/              ← shadcn/ui primitives (auto-generated, do not edit)
    travel/          ← TravelClone domain components
      DealCard.tsx
      FlightCard.tsx
      HotelCard.tsx
      HotelCard.grid.tsx
      SearchForm.tsx
      SearchForm.flights.tsx
      SearchForm.hotels.tsx
      BookingStepIndicator.tsx
      BudgetDiscoveryWidget.tsx
      PriceDisplay.tsx
      PromotionBanner.tsx
      BookingConfirmation.tsx
    layout/
      NavigationBar.tsx
      NavigationBar.mobile.tsx
      NavigationBar.desktop.tsx
      Footer.tsx
    admin/
      DataTable.tsx
      BookingTimeline.tsx
      AdminSidebar.tsx
```

## Appendix C: Accessibility Audit Checklist (Pre-Launch)

- [ ] All images have `alt` text; decorative images have `alt=""`
- [ ] Color contrast audit passes for all text/background combinations using axe DevTools
- [ ] Entire booking flow completed via keyboard only (no mouse)
- [ ] Screen reader test: VoiceOver (iOS Safari) completes booking flow
- [ ] Screen reader test: NVDA (Chrome Windows) completes booking flow
- [ ] Focus trap verified on all modals and bottom sheets
- [ ] Skip navigation link visible on keyboard focus
- [ ] All form inputs have associated `<label>` elements
- [ ] Error messages announced by screen reader on form submission
- [ ] Payment confirmation announced as success region (`aria-live="assertive"`)
- [ ] Lighthouse accessibility score: 90+ on all key pages
