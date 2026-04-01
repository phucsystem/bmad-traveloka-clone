# TravelClone - Product Development Requirements

**Project Name:** TravelClone
**Status:** MVP - Pre-implementation
**Last Updated:** April 1, 2026

---

## Executive Summary

TravelClone is a travel booking Progressive Web Application (PWA) designed for budget-conscious young Australian travelers aged 18-35. Built on a Turborepo monorepo architecture with Next.js 15 frontend, NestJS 10 backend, Refine admin platform, PostgreSQL 16 database, and Redis 7 caching, TravelClone differentiates itself through a promotion-first homepage, streamlined 3-step booking flow, and budget-first discovery experience.

---

## Problem Statement

Current travel booking platforms suffer from:
- **Opaque pricing**: Hidden fees revealed at checkout, breaking trust
- **Complex booking flows**: 6+ steps to complete a booking, high abandonment
- **Poor budget discovery**: Users cannot explore options by budget constraints
- **Promotion friction**: Promotions buried in UI, difficult to discover and apply
- **Mobile-unfriendly**: Desktop-first design, poor PWA support

---

## Solution Overview

TravelClone addresses these pain points through:

**Promotion-First Homepage**: Featured promotions front-and-center with transparent savings displayed immediately.

**3-Step Booking Flow**:
1. Select flight/hotel and apply promotion
2. Enter passenger details
3. Complete payment with transparent total

**Budget-First Discovery**: Users filter by budget range to discover available options rather than scrolling endless results.

**Transparent Pricing**: All-inclusive pricing shown at every step. No hidden fees at checkout.

**PWA-First**: Installable on home screen, works offline, fast performance on 3G networks.

---

## Target Users

**Primary Persona**: Budget travelers, 18-35 years old, Australian-based
- Plan trips 2-6 weeks in advance
- Compare prices across multiple options
- Highly price-sensitive, promotion-responsive
- Use mobile 60% of the time
- Value simplicity and speed over features

**Secondary Persona**: Platform admin (internal/partner)
- Manage flight and hotel inventory
- Create and manage promotional campaigns
- Monitor booking performance and revenue
- Manage customer support tickets

---

## MVP Scope

### Included Features

**Search & Discovery**
- Flight search by route, date, budget range
- Hotel search by location, date, budget range
- Real-time price comparison via Amadeus API
- Budget-filtered results (e.g., "flights under $300")

**Booking Engine**
- 3-step booking flow (select → details → payment)
- Passenger/guest information collection
- Dynamic promotion application at checkout
- Multi-flight and multi-hotel bundle booking
- Real-time availability checking

**Promotional System**
- Promotion creation (discount %, fixed amount, bundle offers)
- Campaign scheduling and budget limits
- Automatic promotion application
- Homepage feature carousel for active promotions

**Payment Processing**
- Stripe integration for payment collection
- Client-side card tokenization (PCI-DSS compliant)
- Real-time payment status updates
- Failed payment retry logic

**User Management**
- User registration and authentication (Better Auth)
- Booking history dashboard
- User profile management
- Password reset via email

**Admin Panel** (Refine)
- CRUD for flights, hotels, bundle packages
- Promotion campaign management
- Booking event tracking and analytics
- User management and support

**Technical Features**
- PWA capabilities (offline support, installable)
- Mobile-first responsive design
- Server-side rendering with Next.js App Router
- Redis caching for search results
- Email notifications for booking confirmations

---

## Success Criteria

| Metric | Target | Validation Method |
|--------|--------|-------------------|
| Booking completion rate | ≥40% | Analytics tracking from search to payment confirmation |
| Avg booking time | <2 minutes | Session duration tracking (search to payment) |
| Homepage CTR to search | ≥60% | Click tracking on promotion carousel |
| Lighthouse performance score | ≥90 | Automated performance testing |
| Mobile usability score | 95+ | Google Mobile-Friendly Test |
| Payment success rate | ≥95% | Stripe webhook data |
| API response time (p95) | <500ms | Server-side metrics collection |
| Cache hit ratio (Redis) | ≥70% | Cache statistics from Redis |

---

## Out of Scope (MVP)

- Ground transportation (buses, trains, rental cars)
- Multi-city itineraries
- Seat selection and baggage management
- Travel insurance options
- Loyalty/rewards programs
- Live chat customer support
- Visa and documentation assistance
- Alternative currency support (AUD only)
- Group booking discounts
- Corporate accounts

---

## Post-MVP Features (Prioritized)

1. **Trip planning tools**: Itinerary builder, trip sharing, collaborative planning
2. **Loyalty program**: Points earning, tier-based benefits, exclusive promotions
3. **Flexible booking**: Price drop alerts, flexible date search, flexible destination
4. **Ground transport**: Bus, train, rental car integration
5. **Travel insurance**: Integration with insurance providers
6. **Live support**: Chat, email, phone support with booking context
7. **Advanced filtering**: Amenities, airline preferences, hotel star ratings
8. **Multi-currency**: Support GBP, USD, NZD alongside AUD
9. **Social features**: Trip sharing, group voting on options
10. **Analytics dashboard**: Trip insights, spending patterns, recommendations

---

## Technical Constraints

**Amadeus API Free Tier**
- Rate limit: 10 requests per second per API key
- Caching required for search results (Redis TTL: 30 minutes)
- Fallback to cached data during API outages

**Deployment**
- Single Docker Compose deployment
- No multi-region or high-availability setup (MVP phase)
- PostgreSQL single instance (no replication)
- Redis single instance (no sentinel/cluster)

**Browser Support**
- Modern browsers only (Chrome, Firefox, Safari, Edge - latest 2 versions)
- No IE11 support
- PWA support required (Service Workers, Web App Manifest)

**Data Retention**
- Session data: 30 days
- Booking data: 7 years (legal requirement)
- User activity logs: 90 days

---

## Key User Journeys

**Journey 1: Budget-Conscious Flight Search**
User opens app → enters budget ($200-300) and route (SYD-MEL) → sees filtered results → clicks promotion banner → completes 3-step booking → receives email confirmation.

**Journey 2: Mobile Hotel Discovery**
User browses promotions on homepage → clicks hotel deal → selects check-in/out with budget filter → adds to bundle with previously booked flight → completes payment → offline booking confirmation visible.

**Journey 3: Admin Promotion Campaign**
Admin creates "Easter Sale" promotion (20% off flights) → sets schedule and budget → monitors campaign performance → adjusts discount on live booking requests → generates performance report.

**Journey 4: Booking History & Rebooking**
User logs in → views past bookings → clicks "View Similar Deals" → refines search with new dates → applies promotion code → completes rebooking in <1 minute.

---

## Acceptance Criteria

- All features implemented per specifications above
- Zero critical security vulnerabilities (OWASP Top 10)
- All payment flows tested with Stripe test mode
- Lighthouse performance score 90+ on mobile
- Mobile responsiveness verified on iPhone 12, Samsung A10
- Email notifications sent successfully for all booking states
- Admin panel CRUD operations fully functional
- PWA installable on iOS and Android
- Docker Compose deployment documented and tested
- Rate limiting implemented for Amadeus API
- Error handling with user-friendly messages
