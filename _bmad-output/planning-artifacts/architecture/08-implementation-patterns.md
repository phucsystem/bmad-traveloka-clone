# Section 4: Implementation Patterns & Consistency Rules

[Back to index](index.md)

---

## 4. Implementation Patterns & Consistency Rules

### 4.1 Naming Conventions

| Context | Convention | Example |
|---|---|---|
| Database tables | `snake_case`, plural | `booking_flights`, `booking_events` |
| Database columns | `snake_case` | `created_at`, `stripe_payment_id`, `user_id` |
| API endpoints | `kebab-case`, plural | `/api/v1/hotel-bookings`, `/api/v1/budget-discovery` |
| TypeScript variables/functions | `camelCase` | `totalPrice`, `cancelBooking()` |
| TypeScript classes/components/types | `PascalCase` | `BookingService`, `FlightCard`, `ApiResponse<T>` |
| TypeScript constants | `UPPER_SNAKE_CASE` | `MAX_PASSENGERS`, `CACHE_TTL_SECONDS` |
| Files | `kebab-case` | `flight-search.controller.ts`, `deal-card.tsx` |
| NestJS modules | `PascalCase` + `Module` suffix | `FlightsModule`, `BookingsModule` |
| NestJS DTOs | `PascalCase` + `Dto` suffix | `CreateBookingDto`, `SearchFlightsDto` |
| Prisma models | `PascalCase`, singular | `Booking`, `BookingFlight`, `User` |
| React hooks | `camelCase` + `use` prefix | `useBookingFlow`, `usePromotions` |
| Environment variables | `UPPER_SNAKE_CASE` | `DATABASE_URL`, `REDIS_URL`, `AMADEUS_API_KEY` |

### 4.2 API Response Format (enforced globally)

```typescript
// All NestJS controller responses use this wrapper
// Applied via ResponseInterceptor (global)

// Success
{ success: true, data: T }
{ success: true, data: T[], meta: { page: 1, total: 47, limit: 10 } }

// Error (via GlobalExceptionFilter)
{ success: false, error: { code: 'BOOKING_NOT_FOUND', message: 'Booking #ABC123 not found' } }
{ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: [{ field: 'email', message: 'Invalid email format' }] } }
```

### 4.3 Error Handling

**Backend (NestJS):**
1. Service layer throws `AppException extends HttpException` with `ErrorCode` enum value
2. `GlobalExceptionFilter` catches all exceptions → formats `ApiResponse` error envelope
3. Unexpected errors (non-`HttpException`) → `ErrorCode.INTERNAL_SERVER_ERROR` + Pino error log with stack trace
4. Amadeus API failures → `AMADEUS_API_ERROR` with retry logic in `AmadeusService`

**Frontend (Next.js):**
1. React Error Boundaries wrap each route segment (`error.tsx` files per App Router convention)
2. TanStack Query `onError` callback → `toast.error(error.message)` via shadcn/ui Sonner
3. Form validation errors → inline messages via React Hook Form `formState.errors`
4. Booking flow errors → full-page error state with "Try again" CTA

### 4.4 Data Flow Patterns

**Standard request (cache miss):**
```
Browser → React Query → fetch('/api/v1/flights?...')
  → Nginx → NestJS FlightsController
  → FlightsService.search()
  → Redis MISS
  → AmadeusService.searchFlights()
  → Redis SET (TTL 1h)
  → return ApiResponse<Flight[]>
  → React Query cache → UI render
```

**Standard request (cache hit):**
```
Browser → React Query (stale check) → fetch('/api/v1/flights?...')
  → Nginx → NestJS FlightsController
  → FlightsService.search()
  → Redis HIT → return cached data
  → ApiResponse<Flight[]> (< 50ms)
```

**Booking creation flow:**
```
Browser (Stripe.js tokenizes card) → POST /api/v1/bookings
  → NestJS BookingsController
  → BookingsService.create() (validates DTO, checks flight/hotel availability)
  → Prisma booking INSERT (status: pending)
  → Stripe PaymentIntents.create()
  → return { clientSecret }
  → Browser (Stripe.js confirmPayment)
  → Stripe webhook → POST /api/v1/webhooks/stripe
  → PaymentsService.handleWebhook() (idempotency check via booking_events)
  → Prisma booking UPDATE (status: confirmed)
  → BullMQ: enqueue send-booking-confirmation
  → EmailWorker → Mailtrap → user email
```

**Admin promotion update → cache invalidation:**
```
Admin Dashboard → PUT /api/v1/admin/promotions/:id
  → AdminPromotionsController
  → PromotionsService.update() → Prisma UPDATE
  → BullMQ: enqueue invalidate-promotion-cache
  → CacheWorker → Redis DEL 'promotions:active:*'
```
