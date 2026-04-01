---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: 'Fullstack Traveloka clone — flight & hotel booking platform'
session_goals: 'Architecture, features, tech stack, UX, data modeling, Docker deployment'
selected_approach: 'ai-recommended'
techniques_used: ['Role Playing', 'Morphological Analysis', 'SCAMPER Method']
ideas_generated: 39
session_active: false
workflow_completed: true
facilitation_notes: 'User is pragmatic and decisive. Prefers concrete options over abstract exploration. Quick to confirm when options align with vision. Strong preference for open-source and self-hosted solutions.'
---

# Brainstorming Session Results

**Facilitator:** Phuc
**Date:** 2026-04-01
**Reference:** https://traveloka.com/

## Session Overview

**Topic:** Fullstack Traveloka clone — travel booking platform with flight & hotel booking
**Goals:** Define architecture, features, tech stack, UX approach, data modeling, and Docker-based deployment for both local and production

### Session Setup

- Clone of Traveloka (https://traveloka.com/)
- Phase 1 scope: Flight booking + Hotel booking
- Design should closely mirror Traveloka's UI/UX
- Dockerized for local development and production deployment
- Fullstack application

## Technique Selection

**Approach:** AI-Recommended Techniques
**Techniques:** Role Playing → Morphological Analysis → SCAMPER Method

---

## Technique Execution Results

### Technique 1: Role Playing — Stakeholder Perspectives

**Stakeholder: Budget Traveler (25yo Vietnamese office worker)**
- Promotions front and center on homepage — deals hook budget travelers before search
- Absolute price anchoring ("Flights from 890K") beats percentage discounts
- Bundle deals (flight + hotel) with visible savings
- Location-aware promotions using geolocation without requiring login
- Time-aware deal intelligence — contextual promos by day/season
- Promotion memory — browsing history reshapes homepage on return visits
- Price transparency via sparkline history proves deals aren't manufactured

**Stakeholder: Business Traveler (35yo sales manager)**
- Flexible cancellation & self-service reschedule workflow (not support tickets)
- Multi-city trip builder — single itinerary with multiple legs and hotels per city
- Business/luxury tier filtering — "Business mode" reshapes the entire experience
- Invoice & receipt generation — VAT PDF with company name, tax ID, itemized costs
- Loyalty points system — tier-based (Silver/Gold/Platinum) with perks

**Stakeholder: Platform Admin / Operator**
- Open-source admin dashboard (React Admin or Refine)
- Flight data from open APIs (Amadeus, Aviationstack, OpenFlights)
- Hotel data from open sources (OSM POI, open datasets)
- Admin support tools — booking lookup, event timeline, refund processing

### Technique 2: Morphological Analysis — Tech Decision Matrix

| Parameter | Decision | Rationale |
|-----------|----------|-----------|
| Frontend | Next.js (App Router) | SSR/SSG for SEO, React ecosystem |
| Backend | NestJS | Structured, TypeScript-native, modular |
| Database | PostgreSQL + Redis | Relational fits bookings; Redis for cache/sessions |
| ORM | Prisma | Type-safe, great DX, auto migrations |
| Search | PostgreSQL full-text | No extra service for MVP |
| Auth | Better Auth | TypeScript-native, flexible |
| Payment | Stripe (test mode) | Best DX, simulate full booking flow |
| Email | Mailtrap | Development/testing email |
| Monorepo | Turborepo | Fast builds, shared packages |
| CI/CD | GitHub Actions | Docker build + test pipeline |
| File Storage | Server disk (local) | Simple for MVP, migrate later |
| Deployment | Docker Compose + Nginx | Local + production, reverse proxy, SSL |
| UI Components | shadcn/ui or Ant Design | Theme to match Traveloka palette |

### Technique 3: SCAMPER — MVP Scope Refinement

**Substitute:**
- Seeded PostgreSQL data instead of real-time airline GDS
- Responsive PWA instead of native iOS/Android apps

**Combine:**
- Unified search + deals page (promotions inline with results)
- Combined flight + hotel trip planner flow

**Adapt:**
- Airbnb-style map-based hotel search (Leaflet/Mapbox)

**Modify:**
- 3-step booking flow (search → select+details → payment) instead of 6+ steps

**Put to Other Uses:**
- Admin panel doubles as data seeding tool from day 1

**Eliminate:**
- Buses, trains, car rentals, activities, restaurants
- Seat selection UI
- Travel insurance add-on
- In-app chat support
- Multiple currencies/languages (English + VND only)
- Social login except Google OAuth
- User-generated reviews (seed static ratings)

**Reverse:**
- Budget-first discovery: "I have 2M VND, where can I go?"

---

## Idea Organization and Prioritization

### Theme 1: User Experience & Engagement (9 ideas)

| ID | Idea | Priority |
|----|------|----------|
| UX-1 | Promotion-first homepage with deal cards | HIGH |
| UX-2 | Absolute price anchoring ("from X VND") | HIGH |
| UX-3 | Bundle deal surfacing with visible savings | HIGH |
| UX-4 | Location-aware promotions (geolocation) | MEDIUM |
| UX-5 | Time-aware deal intelligence | MEDIUM |
| UX-6 | Promotion memory (browsing history) | MEDIUM |
| MVP-5 | Map-based hotel search (Leaflet) | POST-MVP |
| MVP-6 | 3-step booking flow | HIGH |
| MVP-9 | Budget-first discovery mode | POST-MVP |

### Theme 2: Business & Premium Features (6 ideas)

| ID | Idea | Priority |
|----|------|----------|
| FT-1 | Flexible cancellation & reschedule | MEDIUM |
| FT-2 | Multi-city trip builder | POST-MVP |
| FT-3 | Business/luxury tier filtering | POST-MVP |
| FT-4 | Loyalty points system | POST-MVP |
| DT-1 | Price transparency sparkline | POST-MVP |
| DT-2 | Invoice & receipt generation | POST-MVP |

### Theme 3: Technical Architecture (6 ideas)

| ID | Idea | Priority |
|----|------|----------|
| AR-1 | Open-source admin dashboard | HIGH |
| AR-2 | Flight data from open APIs (seed) | HIGH |
| AR-3 | Hotel data from open sources | HIGH |
| AR-4 | Admin support tooling | MEDIUM |
| AR-5 | TypeScript-first full-stack foundation | HIGH |
| AR-6 | Themed UI component library | HIGH |

### Theme 4: MVP Scope Decisions (9 ideas)

| ID | Idea | Priority |
|----|------|----------|
| MVP-1 | Seeded data over real-time GDS | HIGH |
| MVP-2 | Responsive PWA over native apps | HIGH |
| MVP-3 | Unified search + deals page | HIGH |
| MVP-4 | Combined trip planner flow | MEDIUM |
| MVP-7 | Admin panel = seeding tool | HIGH |
| MVP-8 | Feature elimination list | HIGH |

### Prioritization Summary

**Top 3 High-Impact Ideas:**
1. Promotion-first homepage + location/time-aware deals — product differentiator
2. Seeded data + admin as seeding tool — unblocks everything, no API dependency
3. 3-step booking flow — simpler than Traveloka, faster to build AND better UX

**Quick Wins:**
1. Scaffold Turborepo monorepo with confirmed tech stack
2. Admin panel with React Admin/Refine
3. PostgreSQL full-text search (no extra service)

**Post-MVP Backlog:**
- Multi-city trip builder
- Loyalty points system
- Budget-first discovery
- Map-based hotel search
- Invoice generation
- Business tier mode

---

## Session Summary and Insights

**Key Achievements:**
- 39 ideas generated across 4 themes using 3 proven creativity techniques
- Complete tech stack decided with rationale for every choice
- Clear MVP scope defined with explicit elimination list
- Three distinct user personas (budget, business, admin) informing feature priorities

**Breakthrough Moments:**
- Seeded data insight — eliminates the biggest technical risk (GDS integration) for MVP
- Admin panel as seeding tool — one system serves two purposes from day 1
- Budget-first discovery ("where can I go for 2M?") — genuine differentiator from Traveloka

**Creative Facilitation Narrative:**
Phuc demonstrated pragmatic, decisive thinking throughout the session. The budget traveler persona sparked UX ideas around promotions and trust. The business traveler perspective uncovered enterprise features for the backlog. The admin perspective drove architecture decisions toward open-source solutions. The SCAMPER technique was particularly effective at defining MVP boundaries — knowing what to cut was as valuable as knowing what to build.

**Next Steps:**
1. Create Product Brief (`/bmad-product-brief`) using this session as input
2. Create PRD (`/bmad-create-prd`) from the product brief
3. Create Architecture (`/bmad-create-architecture`) with the confirmed tech stack
4. Begin implementation planning
