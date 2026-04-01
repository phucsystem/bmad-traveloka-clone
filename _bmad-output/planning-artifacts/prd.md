---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-bmad-traveloka-clone.md'
  - '_bmad-output/planning-artifacts/product-brief-bmad-traveloka-clone-distillate.md'
  - '_bmad-output/brainstorming/brainstorming-session-20260401-0634.md'
workflowType: 'prd'
classification:
  projectType: 'web_app'
  domain: 'general'
  complexity: 'medium'
  projectContext: 'greenfield'
documentCounts:
  briefs: 2
  research: 0
  brainstorming: 1
  projectDocs: 0
---

# Product Requirements Document - TravelClone

**Author:** Phuc
**Date:** 2026-04-01
**Status:** Complete

## Executive Summary

TravelClone is a travel booking platform targeting young Australian budget travelers (18-35), delivering flight and hotel bookings through a promotion-first, radically simplified experience. Incumbent OTAs bury users in 6+ step booking flows, opaque pricing, and dark-pattern upsells. TravelClone reverses the paradigm — deals surface before search, prices are absolute and transparent, and the entire booking completes in 3 steps under 2 minutes.

This is an internal MVP phase validating the UX thesis before public launch. Data sourced via Amadeus Self-Service API for realistic flight and hotel inventory. The platform ships as a responsive PWA built on Next.js + NestJS with Docker Compose deployment — single codebase across mobile and desktop with 10x cost advantage over native apps.

Australia's $45B+ domestic travel market has no dominant digital-native platform for young travelers. Qantas loyalty skews older, Webjet is utilitarian, Traveloka's Australian presence is minimal. TravelClone targets this gap with the lowest commission model — the Costco approach: volume economics and trust over per-transaction margin.

### What Makes This Special

- **Promotion-first, not search-first** — Homepage is curated deals, not a search bar. Location-aware and time-aware promotions surface relevant offers via geolocation, no login required.
- **Budget-first discovery** — "I have $500 and 3 days. Where can I go?" Reverses the travel search paradigm. No competitor offers this. Product north star.
- **Anti-dark-pattern brand** — No drip pricing, no manufactured discounts, no mandatory upsells. Transparent pricing is both ethical and market positioning.
- **Curated inventory** — Amadeus-sourced data through intentional curation; every route/hotel meets quality standards.
- **3-step booking flow** — Search → Select + Details → Payment. Stripped of seat selection, insurance, baggage screens.

**Core Insight:** Young Australian travelers need fewer, better options presented honestly. Curation + transparency beats aggregation + extraction.

## Project Classification

- **Type:** Web application (PWA)
- **Domain:** Travel / E-commerce
- **Complexity:** Medium
- **Context:** Greenfield

## Success Criteria

### User Success

- Users discover relevant deals on homepage within 5 seconds of landing
- Users complete a flight or hotel booking in under 2 minutes
- Users understand total cost at every step — no surprises at payment
- Users can cancel a booking and understand refund terms without contacting support
- Budget-first discovery returns actionable destination options within 3 seconds

### Business Success (Internal MVP)

| Metric | Target | Timeframe |
|--------|--------|-----------|
| End-to-end booking flow | Functional | MVP launch |
| Booking completion rate | 40%+ | Internal testing |
| Average booking time | < 2 min | Internal testing |
| Homepage deal CTR | 60%+ | Internal testing |
| Lighthouse performance | 90+ | MVP launch |
| Mobile responsive | All breakpoints | MVP launch |

**Post-launch targets:** 100 bookings/week 1, 500 WAU month 1, 25%+ 30-day retention, NPS 50+.

### Technical Success

- Docker Compose deploys all services (web, api, admin, postgres, redis, nginx) with single command
- All API responses under 500ms for 95th percentile
- Amadeus API data cached in Redis; search results served from cache
- Zero broken booking flows — payment always matches displayed price
- CI/CD pipeline (GitHub Actions) passes before any deployment

### Measurable Outcomes

- Promotion-first homepage validated: users engage with deals before using search
- 3-step booking validated: completion rate exceeds industry average (15-20%) by 2x
- Budget-first discovery validated: users submit budget queries and receive useful results
- PWA installable on mobile with offline shell loading

## Product Scope

### MVP — Minimum Viable Product (Internal Release)

- Flight search and booking (Amadeus API, real routes/airlines/airports)
- Hotel search and booking (Amadeus API, real locations/amenities)
- Promotion-first homepage with location-aware and time-aware deals
- Budget-first discovery (minimal: "getaways under $X from your city")
- 3-step booking flow (search → select+details → payment)
- Bundle deals (flight + hotel) with visible savings
- User accounts with Google OAuth (Better Auth)
- Stripe payment (test mode)
- Post-booking: confirmation page, email notification, booking management, cancellation
- Admin dashboard (React Admin/Refine) for inventory, promotions, users, bookings
- Responsive PWA (mobile-first, desktop-capable)
- Docker Compose + Nginx deployment (local + production)
- English + AUD currency

### Growth Features (Post-MVP)

- Real payment processing (Stripe live mode)
- SEO route pages ("Sydney to Bali flights from $299")
- Shareable booking cards for social media
- Referral program ("Give $20, get $20")
- Fare alert engine (price-drop notifications)
- Map-based hotel search (Leaflet/Mapbox)
- University partnership portals
- BNPL integration (Afterpay/Zip)

### Vision (Future)

- Business traveler mode (multi-city, invoicing, loyalty tiers)
- Real-time flight/hotel API integration (Amadeus production tier)
- AI-powered travel assistant ("plan my trip")
- Expansion to New Zealand and Southeast Asia
- Group booking with cost splitting
- Neobank partnerships (Up, Revolut AU)

## User Journeys

### Journey 1: Budget Traveler — Weekend Getaway (Primary, Happy Path)

**Mia, 24, marketing coordinator in Sydney.** Friday 12:30pm, browsing phone during lunch. She wants a weekend trip but hasn't decided where.

**Opening:** Mia opens TravelClone. The homepage shows "Getaways from Sydney" with deal cards: "Melbourne from $189," "Gold Coast from $149," "Bali from $299 (flight + hotel)." She didn't search — the deals found her.

**Rising Action:** She taps "Gold Coast from $149." The search results show 3 flights with departure times and real prices. She taps the 6:00pm Friday flight ($149). The next screen shows passenger details (pre-filled from her account) and a hotel suggestion: "Surfers Paradise Hotel, 2 nights, $180." Bundle savings shown: "Save $45 vs booking separately."

**Climax:** She fills in her name (matching her ID), taps "Pay $284 total," confirms via Stripe. Done. Under 2 minutes. She sees a confirmation page with booking reference, itinerary summary, and "Add to Calendar" button.

**Resolution:** Confirmation email arrives immediately. She screenshots the booking card and sends it to her group chat. Monday morning, she checks "My Bookings" to review the itinerary details.

**Requirements revealed:** Geolocation, promotion engine, flight search, hotel search, bundle pricing, 3-step booking, Stripe payment, confirmation flow, email notification, booking management.

### Journey 2: Budget Traveler — Budget-First Discovery

**Jake, 22, uni student in Melbourne.** He has $500 saved and wants to travel somewhere during mid-semester break (5 days).

**Opening:** Jake opens TravelClone and sees the "Where can I go?" widget on the homepage. He enters: Budget $500, From Melbourne, 5 days, next month.

**Rising Action:** Results appear: "Bali — $420 (flight $280 + hotel $140)," "Adelaide — $310 (flight $130 + hotel $180)," "Cairns — $490 (flight $350 + hotel $140)." All within budget, sorted by total trip cost.

**Climax:** He taps Bali. The full itinerary loads — specific flights, hotel options, total cost breakdown. He adjusts dates by one day and the price drops to $395. He books.

**Resolution:** Jake shares his booking card on Instagram stories. His friends ask "how did you find that deal?" — organic word of mouth.

**Requirements revealed:** Budget-first search, date flexibility display, destination cards, total trip cost calculation, shareable booking cards (post-MVP).

### Journey 3: Budget Traveler — Cancellation (Edge Case)

**Mia's plans change.** Her friend cancels. She needs to cancel the Gold Coast trip.

**Opening:** Mia opens "My Bookings," finds the Gold Coast trip. Cancellation policy is visible: "Free cancellation before 48h. $30 fee within 48h."

**Rising Action:** She's outside the 48h window. She taps "Cancel Booking." The app shows: "Cancellation fee: $30. Refund: $254 to your card within 5-7 business days."

**Climax:** She confirms cancellation. Refund confirmation appears immediately with a reference number.

**Resolution:** Cancellation confirmation email arrives. Refund posts to her card in 4 days. Trust maintained.

**Requirements revealed:** Booking management, cancellation policy display, self-service cancellation, refund calculation, cancellation confirmation, email notification.

### Journey 4: Platform Admin — Managing Inventory and Promotions

**Alex, platform operator.** Monday morning — needs to set up weekend promotions and check booking health.

**Opening:** Alex logs into the admin dashboard. The overview shows: 47 bookings this week, 3 pending cancellations, 12 active promotions.

**Rising Action:** Alex creates a new promotion: "Easter Weekend Flash Sale — Sydney to Melbourne flights 20% off, valid Apr 18-21." Sets geolocation targeting (show to Sydney users), time targeting (show Thursday-Friday), and expiry date.

**Climax:** Alex checks a flagged booking — a user reports they can't find their confirmation email. Admin searches by email, finds the booking, views the full timeline (created → paid → confirmed), resends the confirmation email.

**Resolution:** Alex reviews the Amadeus data sync status, confirms flight prices are current, and approves 2 pending refund requests.

**Requirements revealed:** Admin dashboard, promotion CRUD, promotion targeting rules, booking lookup, booking timeline, email resend, refund processing, data sync monitoring.

### Journey Requirements Summary

| Capability Area | Journeys |
|----------------|----------|
| Promotion engine (location, time, rules) | J1, J2, J4 |
| Flight search & booking | J1, J2 |
| Hotel search & booking | J1, J2 |
| Bundle pricing | J1 |
| Budget-first discovery | J2 |
| 3-step booking flow | J1, J2 |
| Payment (Stripe) | J1, J2 |
| Post-booking management | J1, J3 |
| Cancellation & refund | J3, J4 |
| Email notifications | J1, J3, J4 |
| Admin dashboard | J4 |
| User accounts & auth | J1, J2, J3 |

## Innovation & Novel Patterns

### Budget-First Discovery

**What's novel:** Reversing the travel search paradigm from "I want to go to X" to "I have $X, where can I go?" No major OTA offers this. Google Flights has "Explore" but it's buried and not budget-driven.

**Validation approach:** MVP includes minimal version — simple query against cached Amadeus data. Measure: do users engage with budget-first search? Do they convert? Is the query-to-useful-result rate above 70%?

**Fallback:** If budget-first discovery doesn't resonate, the promotion-first homepage already serves a similar "inspire me" function. The feature degrades gracefully.

### Promotion-First UX

**What's novel:** Homepage is deals, not a search bar. Shifts the user experience from "tool" to "marketplace." Location-aware promotions create instant relevance without login.

**Risk:** Users who know exactly where they're going may find promotion-first slower than search-first. Mitigation: prominent search bar remains accessible, but is not the hero element.

## Web Application Specific Requirements

### Responsive Design

- Mobile-first breakpoints: 375px (mobile), 768px (tablet), 1024px+ (desktop)
- All booking flows fully functional on mobile — no desktop-only features
- Touch-optimized tap targets (minimum 44x44px)
- PWA: service worker for offline shell, web app manifest, home screen install

### Browser Support

- Chrome, Safari, Firefox, Edge (latest 2 versions)
- iOS Safari (primary mobile browser in Australia)
- Chrome Android

### SEO Strategy (Post-MVP)

- Server-side rendering via Next.js App Router for search/listing pages
- Auto-generated route pages ("Sydney to Melbourne flights") for organic search traffic
- Structured data (JSON-LD) for flight/hotel offers

### Performance Targets

- Lighthouse Performance score: 90+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

## Project Scoping & Phased Development

### MVP Strategy

**Approach:** Experience MVP — prove the UX thesis (promotion-first, 3-step booking, budget-first discovery) with real Amadeus data before public launch. Internal release validates the core experience.

**Resource Requirements:** Solo developer / small team. Turborepo monorepo enables efficient full-stack development. Admin dashboard via React Admin/Refine minimizes custom admin code.

### MVP Feature Set (Phase 1)

**Core Journeys Supported:** J1 (happy path booking), J2 (budget discovery), J3 (cancellation), J4 (admin management)

**Must-Have Capabilities:**
- Promotion-first homepage with geolocation deals
- Flight + hotel search via Amadeus API with Redis caching
- 3-step booking flow with Stripe test payment
- Budget-first discovery (minimal version)
- Bundle deals with visible savings
- User auth (Google OAuth via Better Auth)
- Post-booking: confirmation, email, management, cancellation
- Admin dashboard: inventory, promotions, bookings, users
- Docker Compose deployment
- Responsive PWA

### Post-MVP Features (Phase 2)

- Live Stripe payments
- SEO route pages
- Fare alerts
- Map-based hotel search
- Referral program
- Shareable booking cards
- BNPL integration
- University partnerships

### Post-MVP Features (Phase 3)

- Business traveler mode
- Multi-city trip builder
- Loyalty tiers
- AI travel assistant
- NZ/SEA expansion
- Group booking

### Risk Mitigation

**Technical:** Amadeus free tier has rate limits. Mitigation: aggressive Redis caching, batch data loading via cron, serve search from cache.

**Market:** New platform has zero brand recognition. Mitigation: internal MVP validates UX before marketing spend. Post-MVP SEO and referral program for organic growth.

**Scope:** 8+ major features in MVP. Mitigation: Turborepo enables parallel development of frontend/backend/admin. React Admin reduces admin build time. Prioritize booking flow → promotions → budget discovery.

## Functional Requirements

### User Discovery & Promotions

- FR1: Visitors can view promotion deal cards on the homepage without logging in
- FR2: System can detect user's city via browser geolocation or IP and display location-relevant deals
- FR3: System can display time-aware promotions based on day of week, season, and upcoming holidays
- FR4: Visitors can view absolute prices on all deals ("from $X") rather than percentage discounts
- FR5: Visitors can browse bundle deals (flight + hotel) with visible savings amount displayed
- FR6: Logged-in users can view personalized deals based on their browsing history

### Budget-First Discovery

- FR7: Users can enter a budget amount, home city, and optional dates to discover destinations within budget
- FR8: System can return destination cards sorted by total trip cost (flight + hotel) within the specified budget
- FR9: Users can tap a destination card to view available flights and hotels for that destination

### Flight Booking

- FR10: Users can search flights by origin, destination, dates, and number of passengers
- FR11: Users can view flight search results with airline, departure/arrival times, duration, and price
- FR12: Users can select a flight and proceed to passenger details entry
- FR13: Users can enter passenger details (name matching ID, contact information)
- FR14: System can validate passenger details before proceeding to payment

### Hotel Booking

- FR15: Users can search hotels by destination, check-in/check-out dates, and number of guests
- FR16: Users can view hotel search results with name, location, star rating, amenities, and price per night
- FR17: Users can select a hotel and proceed to guest details entry
- FR18: Users can view hotel photos and descriptions

### Bundle Booking

- FR19: Users can book flight + hotel together as a bundle with a visible discount
- FR20: System can calculate and display bundle savings ("Save $X vs booking separately")
- FR21: Admin can create and manage bundle deals with fixed discount amounts

### Payment & Checkout

- FR22: Users can complete payment via Stripe (test mode) with credit/debit card
- FR23: System can display total cost breakdown before payment confirmation
- FR24: Users can review full booking summary before confirming payment
- FR25: System can process payment and generate a booking confirmation with unique reference code

### Post-Booking Management

- FR26: Users can view all their bookings in a "My Bookings" section
- FR27: Users can view detailed itinerary for any booking (flights, hotels, dates, costs)
- FR28: Users can view cancellation policy and terms for each booking
- FR29: Users can self-service cancel a booking and see refund amount before confirming
- FR30: System can calculate refund based on cancellation policy tiers (free > 48h, partial > 24h, etc.)
- FR31: System can send booking confirmation email upon successful payment
- FR32: System can send cancellation confirmation email with refund details

### User Accounts & Authentication

- FR33: Users can sign up and log in via Google OAuth
- FR34: Users can view and edit their profile information
- FR35: Users can view their booking history
- FR36: System can persist user browsing history for personalized promotions

### Admin Dashboard

- FR37: Admins can log in to a separate admin portal
- FR38: Admins can create, read, update, and delete flight listings
- FR39: Admins can create, read, update, and delete hotel listings
- FR40: Admins can create, read, update, and delete promotions with targeting rules (location, time, expiry)
- FR41: Admins can create and manage bundle deals
- FR42: Admins can search bookings by user email or confirmation code
- FR43: Admins can view booking status timeline (created → paid → confirmed → cancelled)
- FR44: Admins can process refund requests
- FR45: Admins can resend confirmation emails
- FR46: Admins can view and manage user accounts

### Data & Search

- FR47: System can fetch and cache flight data from Amadeus Self-Service API
- FR48: System can fetch and cache hotel data from Amadeus Self-Service API
- FR49: Users can search with PostgreSQL full-text search across flights and hotels
- FR50: System can refresh cached data on a configurable schedule

## Non-Functional Requirements

### Performance

- NFR1: Homepage loads and displays promotion cards within 1.5 seconds (FCP) on 4G mobile
- NFR2: Search results return within 500ms for 95th percentile when served from Redis cache
- NFR3: Booking flow page transitions complete within 300ms
- NFR4: Budget-first discovery returns results within 3 seconds
- NFR5: Lighthouse Performance score maintains 90+ across all key pages

### Security

- NFR6: All data transmitted over HTTPS (TLS 1.2+)
- NFR7: User authentication tokens stored securely (httpOnly cookies, not localStorage)
- NFR8: Stripe payment data never touches TravelClone servers (Stripe.js client-side tokenization)
- NFR9: Admin dashboard requires separate authentication with role-based access
- NFR10: API endpoints validate and sanitize all user input to prevent injection attacks
- NFR11: Rate limiting on auth endpoints (max 10 attempts per minute per IP)

### Scalability

- NFR12: System supports 100 concurrent users during internal MVP testing
- NFR13: Redis caching reduces Amadeus API calls by 90%+ for repeated searches
- NFR14: Database schema designed for horizontal read scaling (read replicas) post-MVP
- NFR15: Docker Compose architecture migrateable to Kubernetes without application code changes

### Accessibility

- NFR16: WCAG 2.1 AA compliance for all booking flows
- NFR17: All interactive elements keyboard-navigable
- NFR18: Color contrast ratios meet AA standards (4.5:1 for normal text, 3:1 for large text)
- NFR19: All images have descriptive alt text; decorative images marked as presentational

### Integration

- NFR20: Amadeus Self-Service API integration with automatic retry on failure (3 attempts, exponential backoff)
- NFR21: Stripe webhook integration with idempotent event processing
- NFR22: Mailtrap email integration with templated HTML emails (React Email)
- NFR23: Better Auth Google OAuth with secure token refresh flow

## Technical Architecture Reference

| Layer | Choice |
|-------|--------|
| Frontend | Next.js (App Router), shadcn/ui or Ant Design |
| Backend | NestJS (TypeScript) |
| Database | PostgreSQL + Redis |
| ORM | Prisma |
| Auth | Better Auth |
| Payments | Stripe (test mode) |
| Data Source | Amadeus Self-Service API |
| Email | Mailtrap (dev) + React Email templates |
| Monorepo | Turborepo |
| CI/CD | GitHub Actions |
| Deployment | Docker Compose + Nginx |
| Search | PostgreSQL full-text |
| Storage | Server disk (local) |

*Note: This section is a reference for downstream architecture work. Detailed technical architecture decisions will be made in the Architecture document.*
