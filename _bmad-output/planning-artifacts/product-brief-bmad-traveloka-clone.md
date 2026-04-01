---
title: "Product Brief: TravelClone"
status: "complete"
created: "2026-04-01"
updated: "2026-04-01"
inputs:
  - "_bmad-output/brainstorming/brainstorming-session-20260401-0634.md"
  - "Web research: SEA/AU travel market, competitor analysis"
---

# Product Brief: TravelClone

## Executive Summary

TravelClone is a travel booking platform for budget-conscious young travelers in Australia, offering flights and hotels through a radically simplified experience. While incumbent platforms bury users in 6+ step booking flows, opaque pricing, and dark-pattern upsells, TravelClone leads with transparent promotions, a 3-step booking flow, and the lowest commission fees in the market.

Australia's domestic travel market exceeds $45B annually, yet no dominant digital-native platform serves young travelers (18-35). Qantas loyalty skews older, Webjet is utilitarian, and Traveloka's Australian presence is minimal. Meanwhile, 45% of users report frustration with booking site usability and 39% cite misleading pricing as their top pain point. TravelClone attacks both: promotion-first UX with absolute price anchoring ("flights from $189") and a collapsed booking funnel that respects the user's time.

This is an internal MVP phase — proving the UX thesis and core platform before public launch. Data sourced via Amadeus API for realistic flight/hotel inventory. The goal: validate the promotion-first experience, achieve strong engagement metrics, and build the foundation for a public launch targeting 100 bookings in week one.

## The Problem

Planning a trip today is painful. The average traveler visits 28 websites across 53 days and 76 sessions to book one trip. Incumbent platforms are bloated with upsells, hidden fees, and multi-step flows designed to maximize extraction, not user satisfaction.

**For budget-conscious young Australian travelers:**
- Pricing is opaque — percentage discounts on inflated base prices feel dishonest
- Booking flows are 6+ steps with mandatory add-on screens (insurance, seat selection, baggage)
- No simple answer to "I have $500, where can I go this weekend?"
- Mobile experiences are afterthoughts despite 70%+ of bookings happening on phones
- No platform speaks to their generation — existing tools feel like enterprise software for travel agents

The result: young travelers tolerate bad UX because they have no better alternative.

## The Solution

TravelClone is a mobile-first travel booking platform built for speed and transparency:

- **Promotion-first homepage** — Land on deals, not a search bar. Location-aware promotions show "Flights from Sydney from $189" instantly, using geolocation without requiring login.
- **3-step booking** — Search → Select + Details → Payment. No insurance upsells, no seat selection screens, no friction.
- **Absolute price anchoring** — Show the real price, not "40% off." Budget travelers think in dollars, not percentages.
- **Bundle intelligence** — Flight + hotel combos with visible savings ("Save $120 vs booking separately"), priced via admin-curated bundles with fixed discount logic.
- **Budget-first discovery** — "I have $500 and 3 days. Where can I go?" A minimal version on the homepage surfaces weekend getaways under a user-set budget from their city. Reverses the search paradigm entirely.

The platform is a responsive PWA — one codebase serving desktop and mobile with home-screen install. This gives a 10x cost advantage over maintaining separate iOS/Android/web codebases, enabling faster iteration than any incumbent.

## What Makes This Different

1. **Anti-dark-pattern brand** — No drip pricing, no mandatory upsells, no manufactured discounts. In a post-ACCC scrutiny era, leading with transparent pricing is both ethical and a market positioning advantage.
2. **Radically simplified UX** — 3 steps vs 6+. The booking flow respects the user's time and attention.
3. **Promotion-first, not search-first** — The homepage IS the deal. Most platforms assume you know where you're going. We assume you want to see what's available.
4. **Curated inventory** — Amadeus-sourced data displayed through intentional curation means every route and hotel shown meets quality and margin standards, unlike aggregators that display everything.
5. **Budget-first discovery** — "Where can I go for $500?" is a category-defining feature no incumbent offers. It's the product's north star.
6. **Lowest commission model** — The Costco model for travel: volume economics, supplier preference, and membership-grade trust. Win on retention, not per-transaction margin.

The honest moat is execution speed and UX quality. A small team shipping a beautiful, fast product can capture a niche before defenders react.

## Who This Serves

**Primary: The Young Budget Traveler (18-35, Australia)**
Weekend trip planners, regional explorers, backpackers. They browse on their phone during lunch, compare across apps, and choose the one that gives them confidence in the price. The "aha moment": seeing a deal for their exact city, at a price they trust, and booking in under 2 minutes.

**Secondary (Post-MVP): The Frequent Business Traveler**
Sales managers and consultants who need flexible cancellation, invoices, and loyalty rewards. Infrastructure designed for but not built in V1.

## Success Criteria (Internal MVP)

| Metric | Target | Timeframe |
|--------|--------|-----------|
| End-to-end booking flow works | Complete | MVP launch |
| Booking completion rate | 40%+ | Internal testing |
| Average booking time | < 2 minutes | Internal testing |
| Homepage deal engagement | 60%+ CTR | Internal testing |
| Lighthouse performance score | 90+ | MVP launch |
| Mobile responsiveness | All breakpoints | MVP launch |

**Post-launch targets (public release):** 100 bookings/week 1, 500 WAU month 1, 25%+ 30-day retention, NPS 50+.

## Scope

**MVP (V1) — Internal Release:**
- Flight search and booking (Amadeus API data, real routes/airlines/airports)
- Hotel search and booking (Amadeus API data, real locations/amenities)
- Promotion-first homepage with location-aware and time-aware deals
- Budget-first discovery (minimal version: "getaways under $X from your city")
- 3-step booking flow (search → select+details → payment)
- Bundle deals (flight + hotel) with visible savings
- User accounts with Google OAuth (Better Auth)
- Stripe payment (test mode)
- Post-booking flow: confirmation page, email notification, booking management, cancellation
- Admin dashboard (React Admin/Refine) for inventory, promotions, user management
- Responsive PWA (mobile-first, desktop-capable)
- Docker Compose + Nginx deployment (local + production)
- English + AUD currency

**Explicitly Out of Scope (V1):**
- Buses, trains, car rentals, activities, restaurants
- Multi-city trip builder
- Seat selection, travel insurance
- Loyalty points / referral program
- In-app chat support
- Multi-language / multi-currency
- Native mobile apps (iOS/Android)
- User-generated reviews
- Map-based hotel search
- Real payment processing (test mode only for MVP)

## Growth Strategy (Post-MVP)

- **SEO route pages** — Auto-generated "Sydney to Bali flights from $299" pages for high-intent search traffic
- **Shareable booking cards** — Instagram/TikTok-native cards ("I just booked Melbourne for $189") turn bookings into organic social proof
- **Referral program** — "Give $20, get $20" for the price-sensitive demographic
- **University partnerships** — Co-branded portals for 200K+ Australian students traveling annually
- **BNPL integration** — Afterpay/Zip checkout to remove upfront payment barrier (15-25% conversion lift)
- **Neobank partnerships** — Up, Revolut AU co-branded travel savings features

## Vision

**Year 1:** Prove the UX thesis with internal MVP. Launch publicly. Capture the young Australian budget traveler niche. 10,000+ bookings/month. Secure pre-seed funding with real traction data.

**Year 2:** Expand to business travelers (multi-city, invoicing, loyalty tiers). Integrate real-time APIs. Launch map-based hotel search. Expand to New Zealand.

**Year 3:** Dominate the young Australian travel market. Expand to Southeast Asia. AI-powered travel assistant ("plan my trip"). Become the platform where young travelers start every trip — not just book, but discover.

## Technical Approach

| Layer | Choice |
|-------|--------|
| Frontend | Next.js (App Router), shadcn/ui or Ant Design |
| Backend | NestJS (TypeScript) |
| Database | PostgreSQL + Redis |
| ORM | Prisma |
| Auth | Better Auth |
| Payments | Stripe (test mode) |
| Data Source | Amadeus Self-Service API |
| Email | Mailtrap (dev) |
| Monorepo | Turborepo |
| CI/CD | GitHub Actions |
| Deployment | Docker Compose + Nginx |
| Search | PostgreSQL full-text |
| Storage | Server disk (local) |
