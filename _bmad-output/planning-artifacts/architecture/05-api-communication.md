# Section 3.3: API & Communication

[Back to index](index.md)

---

### 3.3 API & Communication

#### 3.3.1 REST API Design

- **No GraphQL** — REST is sufficient for MVP; reduces complexity; easier admin dashboard integration
- **Versioning:** `/api/v1/` prefix on all routes; breaking changes get `/api/v2/`
- **API response envelope:**

```typescript
// packages/shared/src/types/api-response.ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    total?: number;
    limit?: number;
    cursor?: string;
  };
}
```

- **Standard error codes enum:**

```typescript
// packages/shared/src/constants/error-codes.ts
export enum ErrorCode {
  // Auth
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Booking
  BOOKING_NOT_FOUND = 'BOOKING_NOT_FOUND',
  BOOKING_ALREADY_CANCELLED = 'BOOKING_ALREADY_CANCELLED',
  BOOKING_CANCELLATION_WINDOW_EXPIRED = 'BOOKING_CANCELLATION_WINDOW_EXPIRED',

  // Payment
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_ALREADY_PROCESSED = 'PAYMENT_ALREADY_PROCESSED',
  STRIPE_WEBHOOK_INVALID = 'STRIPE_WEBHOOK_INVALID',

  // Inventory
  FLIGHT_NOT_FOUND = 'FLIGHT_NOT_FOUND',
  HOTEL_NOT_FOUND = 'HOTEL_NOT_FOUND',
  BUNDLE_NOT_FOUND = 'BUNDLE_NOT_FOUND',
  PROMOTION_NOT_FOUND = 'PROMOTION_NOT_FOUND',

  // External
  AMADEUS_API_ERROR = 'AMADEUS_API_ERROR',
  AMADEUS_RATE_LIMIT = 'AMADEUS_RATE_LIMIT',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_DATE_RANGE = 'INVALID_DATE_RANGE',
  BUDGET_TOO_LOW = 'BUDGET_TOO_LOW',

  // Generic
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
}
```

#### 3.3.2 NestJS Global Exception Filter

```typescript
// apps/api/src/filters/http-exception.filter.ts
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorCode = exception instanceof AppException
      ? exception.errorCode
      : ErrorCode.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      success: false,
      error: { code: errorCode, message: exception.message },
    } satisfies ApiResponse);
  }
}
```

#### 3.3.3 Async Job Queue (BullMQ)

| Queue | Job | Trigger | Worker |
|---|---|---|---|
| `email` | `send-booking-confirmation` | Stripe payment_intent.succeeded webhook | EmailWorker |
| `email` | `send-cancellation-confirmation` | Booking status → cancelled | EmailWorker |
| `email` | `resend-confirmation` | Admin action | EmailWorker |
| `amadeus-sync` | `sync-flight-prices` | Cron: every 30min | AmadeusSyncWorker |
| `amadeus-sync` | `sync-hotel-prices` | Cron: every 60min | AmadeusSyncWorker |
| `cache-invalidation` | `invalidate-promotion-cache` | Admin promotion update | CacheWorker |

- **BullMQ config:** Redis connection shared with main cache; separate DB index (Redis DB 1 for BullMQ, DB 0 for cache)
- **Retry policy:** 3 attempts, exponential backoff starting at 1000ms; failed jobs moved to dead letter queue after 3 failures; PagerDuty alert on dead letter (post-MVP)
- **Email templates:** React Email components in `apps/api/src/email/templates/`; rendered to HTML via `@react-email/render` in the worker
