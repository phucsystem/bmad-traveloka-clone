---
title: "Product Brief Distillate: TravelClone"
type: llm-distillate
source: "product-brief-bmad-traveloka-clone.md"
created: "2026-04-01"
purpose: "Token-efficient context for downstream PRD creation"
---

# TravelClone — Product Brief Distillate

## Scope Signals

- **MVP is internal release** — not public-facing yet. Stripe test mode only. Goal: prove UX thesis before public launch.
- **Amadeus Self-Service API** — confirmed data source for flights and hotels. Replace earlier "seeded data" decision.
- **Budget-first discovery pulled into MVP** — minimal version: "weekend getaways under $X from your city" on homepage. Was post-MVP, promoted based on review panel recommendation as north-star feature.
- **Post-booking flow added to MVP** — confirmation page, email (Mailtrap), booking management, cancellation. Was missing from original scope.
- **Bundle pricing logic** — admin-curated bundles with fixed discount on combined flight+hotel price. Not dynamic/algorithmic for V1.
- **Public launch targets** — 100 bookings/week 1, 500 WAU month 1, 25%+ 30-day retention, NPS 50+. These apply AFTER internal MVP is validated, not at MVP.

## Requirements Hints

- **Promotion engine** — needs rules for: location-based (geolocation/IP), time-based (day of week, season, holidays), browsing-history-based (localStorage for anonymous users, account history for logged-in). Promotions are the primary homepage content.
- **Bundle deals** — flight + hotel combos. Admin creates bundles manually in V1. Show "Save $X vs booking separately" — requires calculating individual vs bundle price delta.
- **3-step booking flow** — Step 1: Search (dates, destination, passengers). Step 2: Select flight/hotel + enter passenger details (name matching ID, contact, fare class). Step 3: Stripe payment + confirmation. Must collect legally required passenger info without feeling heavy.
- **Budget-first discovery (MVP minimal)** — user inputs: budget amount + home city + optional dates. System queries: flights + hotels within budget from that origin. Display: destination cards sorted by total trip cost. Does NOT require complex algorithm for V1 — simple SQL query against Amadeus-sourced data.
- **Admin dashboard** — CRUD for flights, hotels, promotions, bundles, users. Booking lookup by user/confirmation code. Booking status timeline (created → paid → confirmed → cancelled). Refund processing. Built with React Admin or Refine.
- **Cancellation flow** — show cancellation policy upfront per booking. Self-service cancel with policy tiers (free before 48h, partial before 24h, etc.). Refund processing via admin for V1.
- **Email notifications** — booking confirmation, cancellation confirmation, password reset. Mailtrap for development. Template engine needed (React Email or similar).
- **PWA requirements** — service worker for offline shell, web app manifest for home screen install, responsive breakpoints (mobile-first: 375px, tablet: 768px, desktop: 1024px+). Lighthouse target: 90+ performance score.

## Technical Context

- **Stack confirmed**: Next.js App Router + NestJS + PostgreSQL + Redis + Prisma + Better Auth + Stripe (test) + Mailtrap + Turborepo + Docker Compose + Nginx + GitHub Actions
- **Monorepo structure**: Turborepo with shared TypeScript types between frontend/backend/admin
- **Search**: PostgreSQL full-text for MVP. Reviewer flagged this may not scale for complex travel queries (date ranges, price ranges, flexible dates) — plan migration path to MeiliSearch/Typesense post-MVP.
- **File storage**: Server disk for MVP. Migration to MinIO (S3-compatible, Docker) or Cloudflare R2 post-MVP.
- **Data source**: Amadeus Self-Service API (free tier) — provides real airport codes, airline names, flight schedules, hotel data. Supplement with OpenFlights database for reference data.
- **UI components**: shadcn/ui or Ant Design — theme to Traveloka's blue/orange palette and card-heavy layout. Decision TBD during architecture phase.
- **Docker**: Single docker-compose.yml for all services (web, api, admin, postgres, redis, nginx). Same compose file works local and production with env-var overrides.

## User Personas (Detailed)

- **Budget Traveler (primary, MVP)**: 18-35yo Australian. Browses on phone during lunch. Compares 3-4 apps. Hooks: absolute price ("from $189"), not percentages. Wants to see deals before searching. Values transparency — price history sparkline builds trust (post-MVP). "Aha moment": homepage shows deals from THEIR city at a price they trust, booked in < 2 minutes.
- **Business Traveler (secondary, post-MVP)**: 35yo sales manager, travels 3x/month. Needs: flexible cancellation, self-service reschedule (not support tickets), VAT invoicing (PDF with company name + tax ID), multi-city itinerary, loyalty tiers (Silver/Gold/Platinum). "Business mode" toggle that reshapes entire UX — hides hostels, shows invoice-ready pricing, highlights flex-cancel options.
- **Platform Admin (internal)**: manages inventory, promotions, users. Admin dashboard doubles as data seeding tool. Needs booking lookup, event timeline per booking, refund processing.

## Competitive Intelligence

- **Traveloka**: 67.7% brand recall in SEA, minimal AU presence. Corporate travel focus. Legacy 6+ step booking flow.
- **Agoda**: Dominant hotels, complex UI, weak domestic flight optimization for AU carriers.
- **Trip.com**: AI-heavy but not optimized for budget AU users. High acquisition cost.
- **Webjet**: Australian incumbent, utilitarian UX, no mobile-first experience, skews older.
- **Qantas/Jetstar**: Loyalty programs skew older. Not a booking platform for non-Qantas flights.
- **Market gap**: No dominant digital-native platform serves young Australian travelers (18-35). $45B+ AU domestic travel market.
- **Market data**: Asia-Pacific OTA market $76B (2025), 17.2% CAGR. 70%+ mobile bookings. Average age 29 in SEA — mobile-native expectations.

## Rejected Ideas (Do Not Re-Propose)

- **Buses, trains, car rentals, activities, restaurants** — out of scope entirely. Flights + hotels only.
- **Seat selection UI** — adds booking step, contradicts 3-step flow. Post-MVP at earliest.
- **Travel insurance add-on** — dark pattern adjacent, explicitly eliminated.
- **In-app chat support** — use email/ticket system instead. Too complex for MVP.
- **Multiple currencies/languages** — English + AUD only. Simplicity.
- **Social login (Facebook, Apple)** — Google OAuth only via Better Auth. Reduce auth surface.
- **User-generated reviews** — seed static ratings. No review system for MVP.
- **Native mobile apps** — PWA replaces need. 10x cost advantage on iteration speed.
- **Real-time GDS integration for MVP** — use Amadeus API with caching instead. Full real-time sync is Year 2.
- **Complex multi-city trip builder for MVP** — requires trip/itinerary data model beyond single-leg bookings. Year 2.
- **Map-based hotel search for MVP** — nice-to-have, not core. Year 2 with Leaflet/Mapbox.

## Growth & Distribution (Post-MVP, For PRD Backlog)

- **SEO route pages**: Auto-generated "Sydney to Bali flights from $299" — seeded data makes this trivially implementable.
- **Shareable booking cards**: Instagram/TikTok-native assets for social proof.
- **Referral credits**: "Give $20, get $20" — highest-leverage mechanic for price-sensitive young users.
- **University partnerships**: 200K+ AU students traveling annually. Co-branded portal, discount codes.
- **BNPL integration**: Afterpay/Zip checkout. 15-25% conversion lift for this demographic.
- **Neobank partnerships**: Up, Revolut AU — co-branded travel savings pots.
- **Travel influencer affiliate program**: Micro-influencers (10-100K followers) in AU travel niche.
- **Group booking + cost splitting**: Viral loop — every group trip forces 3-6 new users onto platform.
- **Fare alert engine**: Price-drop alerts create recurring engagement during 53-day research window.

## Open Questions

- **Commission rate**: "Lowest possible" stated but no specific % defined. Needs financial modeling during architecture/business planning. Industry benchmark: Booking.com 15%, Agoda 12-18%.
- **UI component library**: shadcn/ui vs Ant Design — decision deferred to architecture phase.
- **Amadeus API tier/limits**: Free tier has rate limits. Need to assess whether sufficient for MVP data loading and whether caching strategy (Redis) adequately covers search performance.
- **Australian regulatory compliance**: ATAS accreditation, ACL obligations, PCI-DSS for payments. Deferred to pre-public-launch phase since MVP is internal.
- **Team size**: Brief implies small team / solo developer. Scope may be ambitious — reviewer flagged 8+ major features in MVP. Prioritization within MVP may be needed.
