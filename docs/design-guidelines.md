# TravelClone Design Guidelines

**Last Updated:** April 1, 2026
**Status:** MVP Design System

---

## Design Philosophy

TravelClone's design philosophy balances inspiration from market leaders with a unique identity tailored to budget-conscious Australian travelers.

### Core Principles

**Promotion-First**: Deals and discounts are hero elements on every page. Savings are quantified and visually prominent.

**Radical Transparency**: All-inclusive pricing at every step. No hidden fees, no surprise charges. Break the trust-breaking pattern of legacy booking sites.

**Brutal Simplicity**: Every element serves a purpose. Ruthlessly eliminate cognitive load. 3-step checkout, not 8.

**Mobile-Centric**: Design for thumb navigation, small screens, and 3G networks. Progressive enhancement from mobile → tablet → desktop.

**Emotional Journey**: Different emotions at different stages (discovery → excitement, booking → trust, confirmation → relief).

---

## Design References

**Traveloka** (Southeast Asian leader)
- Card-based layout for deals
- Bright blue (#0064D2 family) + orange accent palette
- Promotion carousel as homepage hero
- Floating action buttons for quick booking

**Airbnb** (UX & spacing mastery)
- Generous whitespace (16px+ layouts)
- Sans-serif typography (Inter, not serif)
- Inclusive imagery (diverse travelers, destinations)
- Micro-interactions (hover states, transitions)

**Skyscanner** (Flight-specific UX)
- Tab-based search (one-way / round-trip / multi-city)
- Filter sidebar that sticks on scroll
- Price graph visualization for date flexibility
- "Whole month" mode for budget exploration

**Google Flights** (Simplicity)
- Single search bar for 80% of use case
- Minimal distractions above the fold
- Instant results as you type
- Map view for geographic discovery

---

## Color System

### Primary Blue (#0064D2)

Used for primary CTAs, navigation, links, focused states.

- **Base**: `#0064D2` — Primary buttons, active links, brand color
- **Hover**: `#0052A8` — Darken on hover/press
- **Light**: `#DBEAFE` — Background fills, secondary states
- **Very Light**: `#F0F9FF` — Disabled, very subtle backgrounds

**Usage:**
- Primary "Book Now" buttons
- Navigation active states
- Link colors
- Loading indicators
- Focus rings on form inputs

### Accent Orange (#FF6B00)

Used for promotions, discounts, savings badges, secondary CTAs.

- **Base**: `#FF6B00` — Promotion badges, accent CTAs, deals
- **Hover**: `#D45800` — Darken on hover
- **Light**: `#FFF7ED` — Background fills, promotion highlight backgrounds
- **Very Light**: `#FFF7ED` → `#FEFCE8` — Subtle promotion callouts

**Usage:**
- Savings badges ("Save $150")
- "Limited Time" promotions
- Price discount strikethrough
- Special offers carousel
- Secondary CTAs (Add to Wishlist, Share)

### Semantic Colors

**Success** (Booking Confirmed)
- Base: `#16A34A`
- Light: `#DCFCE7`

**Warning** (Action Required)
- Base: `#D97706`
- Light: `#FEF3C7`

**Error** (Failed Payment, etc.)
- Base: `#DC2626`
- Light: `#FEE2E2`

### Neutral Grayscale

| Shade | Hex | Use |
|-------|-----|-----|
| Text Primary | `#0F172A` | Body text, headings |
| Text Secondary | `#475569` | Helper text, placeholders |
| Text Tertiary | `#94A3B8` | Disabled text, hints |
| Border | `#E2E8F0` | Input borders, dividers |
| Background Light | `#F8FAFC` | Page background, section separators |
| Card | `#FFFFFF` | Card backgrounds, modals |
| Overlay | `#000000` (20% opacity) | Modal backdrops |

---

## Typography

### Font Family

**Primary Font**: Inter (Variable Weight)
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

**Why Inter?**
- Highly legible at small sizes (important for mobile)
- Excellent variable font support (granular weight control)
- Professional yet approachable
- Free and self-hosted (no Google Fonts external request)

### Type Scale

Responsive scaling: Base size 16px on mobile, 18px on desktop.

| Level | Mobile | Desktop | Weight | Use |
|-------|--------|---------|--------|-----|
| **4xl** (Hero) | 32px | 48px | 700 bold | Homepage hero, page titles |
| **3xl** | 28px | 36px | 700 bold | Section headers, modal titles |
| **2xl** | 24px | 30px | 700 bold | Card titles, promotion headers |
| **xl** | 20px | 24px | 600 semibold | Subheadings, filter labels |
| **lg** | 18px | 20px | 600 semibold | Flight/hotel name, booking step titles |
| **base** | 16px | 16px | 400 regular | Body text, descriptions |
| **sm** | 14px | 14px | 400 regular | Helper text, secondary info |
| **xs** | 12px | 12px | 400 regular | Meta info, timestamps, disclaimers |

### Price Display (Special Case)

Price is a key UI element. Special treatment:
- Size: 32px, font-weight 800 (extrabold)
- Color: `#FF6B00` (accent orange) for prominent pricing
- Format: `AUD $599` with superscript "AUD"
- Strikethrough original price when discounted (text-decoration: line-through, opacity 0.6)

**Example:**
```
AUD $599 (original)
↓
~~AUD $899~~ AUD $599 (with discount)
Save $300 (in orange)
```

### Line Height & Spacing

- Headings: 1.2 (compact, strong)
- Body text: 1.6 (readable, comfortable)
- Form inputs: 1.5 (slightly compact, dense)

### Font Weight Usage

- **700 (Bold)**: Headings, CTAs, emphasis
- **600 (Semibold)**: Subheadings, labels, secondary emphasis
- **400 (Regular)**: Body, descriptions, helper text
- Avoid: 300 (light) for body text; hard to read on mobile

---

## Spacing System

### Base Unit: 4px

All spacing uses multiples of 4px for consistency and alignment.

| Unit | Pixels | Use |
|------|--------|-----|
| xs | 4px | Border radius variations, icon-to-label gaps |
| sm | 8px | Component internal padding, small icons |
| md | 12px | Form inputs, button internal padding |
| lg | 16px | Card padding, layout sections, modal padding |
| xl | 20px | Major section spacing |
| 2xl | 24px | Page margins, container padding |
| 3xl | 32px | Between major sections |
| 4xl | 40px | Hero section spacing |
| 5xl | 48px | Page-level margins |

### Component-Level Spacing

**Buttons:**
- Padding: 12px (vertical) × 16px (horizontal)
- Icon-to-text gap: 8px
- Line height: 20px

**Form Inputs:**
- Height: 44px (mobile touch target minimum)
- Padding: 12px vertical, 16px horizontal
- Label-to-input gap: 8px
- Input-to-helper gap: 4px

**Cards:**
- Padding: 16px (all sides)
- Content gap: 12px
- Shadow: `0 1px 3px rgba(0,0,0,0.12)`

**Sections:**
- Top padding: 24px
- Bottom padding: 24px
- Horizontal padding: 16px (mobile), 32px (desktop)

---

## Border Radius

Consistent rounding with a subtle, modern feel. Avoid excessive curves.

| Size | Pixels | Use |
|------|--------|-----|
| default | 8px | Buttons, inputs, cards, most UI |
| lg | 12px | Large modals, hero sections |
| xl | 16px | Image corners, promotion cards |
| full | 9999px | Badges, avatar circles, pill buttons |

---

## Component Library

### shadcn/ui Implementation

TravelClone uses shadcn/ui (Radix UI + Tailwind CSS) as the foundation.

**Registry Components Available:**

| Component | Use |
|-----------|-----|
| Button | Primary/secondary CTAs, form submission |
| Input | Text fields (email, name, date, etc.) |
| Select | Dropdowns (origin, destination, passenger count) |
| Dialog | Modals (confirm actions, promotions) |
| Sheet | Mobile bottom sheet (filters, booking summary) |
| Calendar | Date picker (check-in, check-out) |
| Badge | Tags, status labels, promotions |
| Card | Content containers, deal cards, hotel listings |
| Skeleton | Loading placeholders (flight list, hotel grid) |
| Toast | Notifications (booking confirmed, error alerts) |
| Progress | Multi-step form indicator |
| Avatar | User profile pictures |
| Tabs | Grouped filters (one-way / round-trip) |

### Custom Components

**DealCard**
- Displays promotional offer with savings badge
- Image, title, description, original price, discount price, CTA
- Orange accent color, shadow hover effect

**FlightCard**
- Flight itinerary (airline, times, duration, stops, price)
- Used in search results and booking review
- Blue primary color for selected state

**HotelCard**
- Hotel thumbnail with image, name, rating, price per night
- Clickable to expand details (map, amenities, reviews)

**PriceDisplay**
- Shows original and discounted prices with strikethrough
- Emphasizes savings in orange

**BookingStepIndicator**
- Visual progress for 3-step checkout (step 1/2/3)
- Connected dots or numbered line
- Color: blue for completed, gray for pending

**BudgetDiscoveryWidget**
- Interactive range slider (min $0, max $1000)
- Real-time result count ("See 42 flights")
- Budget preset buttons (Under $300, $300-600, etc.)

**BookingConfirmation**
- Success state after payment
- Booking reference, itinerary summary, receipt link
- Email confirmation sent notification

---

## Responsive Design

**Mobile-first**: Design for 375px (iPhone SE), enhance for 768px (tablet), 1024px+ (desktop).

**Mobile (375px–767px):** Single column, bottom sheet, sticky header, floating CTA, full-width cards (16px margin).
**Tablet (768px–1023px):** Two-column (sidebar + content), 2-column card grid, modal dialogs.
**Desktop (1024px+):** Three-column (sidebar filters + results + booking panel), 3–4 column grid, sticky filters.

---

## Interactive States

### Button States

**Default:** `#0064D2`, 12px shadow
**Hover:** Darken to `#0052A8`, increase shadow (16px)
**Active/Press:** Darken further, no shadow
**Disabled:** Gray `#94A3B8`, 0 shadow, opacity 0.5, cursor not-allowed
**Loading:** Spinner animation, text hidden or replaced with "Loading…"

### Form Input States

**Idle:** Gray border `#E2E8F0`, white background
**Focus:** Blue border `#0064D2`, subtle blue background `#DBEAFE`
**Filled:** Gray text `#0F172A`, gray border `#E2E8F0`
**Error:** Red border `#DC2626`, light red background `#FEE2E2`
**Disabled:** Gray background `#F8FAFC`, gray text `#94A3B8`, no interaction

### Card Hover Effects

**Default:** Subtle shadow, no lift
**Hover:** Increase shadow (12px), slight translation (2px up), cursor pointer
**Tap (Mobile):** Brief scale animation (0.98×), no hover (no pointer)

### Transitions

- Default duration: 200ms (fast, responsive)
- Easing: `ease-in-out` (natural motion)
- Properties: `color`, `background`, `border`, `box-shadow`, `transform`

**Disabled transitions on:** `opacity`, `pointer-events` (instant)

---

## Accessibility (WCAG 2.1 AA)

**Color Contrast:** Large text (18px+) 3:1, normal text 4.5:1, icons 3:1.

**Keyboard:** Tab navigation for all buttons/inputs. Blue focus ring: `2px solid #0064D2`.

**Forms:** Label with `for` attribute. Error messages via `aria-describedby`. Icons with `aria-label`.

**Images:** All require `alt` text. Decorative: `alt=""`. Example: ✅ "Flight SYD–MEL return, $599" instead of ❌ "image".

**Motion:** Respect `prefers-reduced-motion`. No flashing. Carousels must have pause button.

---

## Emotional Design Phases

**Discovery** (Homepage): Excited curiosity. Large destination imagery, blue CTAs, orange promos, whitespace. Tone: "Where do you want to go?"

**Search** (Results): Confident control. Sticky filters, price compare, real-time counts, confidence cues. Tone: "Compare and choose."

**Booking** (Checkout): Secure trust. Step indicator (1/3), transparent pricing, green states, "TOTAL" prominent, trust badges. Tone: "Complete safely."

**Post-Booking** (Confirmation): Relief + anticipation. Green checkmark, booking ref, email reminder, next actions. Tone: "You're all set!"

**Cancellation** (If needed): Fairness. Policy summary, refund amount, timeline, support contact, rebook option. Tone: "We understand. Here's next."

---

## Visual Examples

**Promotion Card:** Image → Title (lg semibold) → ~~$899~~ $599 → "Save $300" (orange) → "Book Now" CTA (blue)

**Flight Card:** Airline + flight number → Route (SYD ── 2h 15m ── MEL) → Times (08:00–10:15) → Price (right-aligned) → "Select" CTA

**3-Step Indicator:** Step 1: Select ● ─── / Step 2: Details ● ─── / Step 3: Payment ○ (current=light blue, future=gray)

---

## Loading States

Use skeleton placeholders (gray bars matching component shape) with shimmer animation. Loading spinner: 24px inline, 48px center screen, primary blue, 1s rotation loop.

Empty state: Icon + encouraging copy (e.g., "No results for SYD → JFK — Try different dates or budget range")

---

---

**Last Updated:** April 1, 2026
