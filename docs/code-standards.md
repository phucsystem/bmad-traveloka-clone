# TravelClone - Code Standards & Conventions

**Last Updated:** April 1, 2026
**Applies to:** All code in apps/ and packages/

---

## Naming Conventions

| Entity Type | Convention | Example | Notes |
|-------------|-----------|---------|-------|
| Database tables | snake_case, plural | `users`, `booking_flights` | Avoid abbreviations |
| Database columns | snake_case | `created_at`, `user_id` | Use `_at` suffix for timestamps |
| API endpoints | kebab-case, plural | `/api/v1/flights`, `/api/v1/bookings` | Noun-based, resource-oriented |
| TypeScript variables | camelCase | `currentUser`, `isLoading` | Avoid single letters except loop counters |
| TypeScript functions | camelCase | `getUserById()`, `applyPromotion()` | Verb-based, describe action |
| TypeScript classes | PascalCase | `UserService`, `FlightController` | Singular nouns |
| TypeScript interfaces | PascalCase | `Flight`, `BookingRequest` | Prefix with `I` only if distinct from classes |
| TypeScript types | PascalCase | `ApiResponse`, `ErrorCode` | Describe shape or enum |
| TypeScript constants | UPPER_SNAKE_CASE | `MAX_RETRY_ATTEMPTS`, `BOOKING_STEPS` | Module-level, never magic numbers |
| TypeScript enums | PascalCase members | `enum Status { Active, Inactive }` | Use for fixed sets, not booleans |
| React components | PascalCase | `SearchForm`, `BookingStep3` | Describe UI element |
| React hooks | use prefix + camelCase | `useFlightSearch()`, `useBookingContext()` | Always prefix with `use` |
| File names (TS/JS) | kebab-case | `user-service.ts`, `search-form.tsx` | Match exported class/function if possible |
| File names (components) | kebab-case | `booking-form.tsx`, `hotel-card.tsx` | Lowercase component names |
| Folders | kebab-case | `api/controllers/`, `components/flights/` | Group related files |
| Environment variables | UPPER_SNAKE_CASE | `DATABASE_URL`, `STRIPE_SECRET_KEY` | Never commit `.env` files |
| NestJS modules | PascalCase + Module | `FlightsModule`, `BookingsModule` | Singular resource name |
| NestJS DTOs | PascalCase + Dto | `CreateFlightDto`, `UpdatePromotionDto` | Describe purpose |
| Prisma models | PascalCase, singular | `User`, `Booking`, `BookingFlight` | Match DB table structure |
| Git branches | kebab-case, prefixed | `feat/user-auth`, `fix/booking-validation` | Include issue number if available |
| Commit messages | Conventional commits | `feat: add budget filtering`, `fix: payment retry logic` | See Git Conventions section |

---

## API Standards

### REST Resource Routing

```
GET    /api/v1/flights                    # List flights (paginated)
GET    /api/v1/flights/:id                # Get single flight
POST   /api/v1/flights                    # Create flight (admin only)
PUT    /api/v1/flights/:id                # Update flight (admin only)
DELETE /api/v1/flights/:id                # Delete flight (admin only)

GET    /api/v1/bookings                   # List user bookings
POST   /api/v1/bookings                   # Create booking
GET    /api/v1/bookings/:id               # Get booking details
POST   /api/v1/bookings/:id/confirm       # Confirm booking payment
POST   /api/v1/bookings/:id/cancel        # Cancel booking
```

### Request/Response Format

**Success Response (2xx)**
```typescript
{
  success: true,
  data: { ... },                          // Resource or list
  meta: {
    page: 1,
    limit: 20,
    total: 150,                           // Total count for pagination
    timestamp: "2026-04-01T10:30:00Z"
  }
}
```

**Error Response (4xx, 5xx)**
```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",             // Enum from ErrorCode
    message: "Passenger name is required",
    details: {
      field: "passengerName",
      value: null,
      expected: "string"
    }
  },
  meta: {
    timestamp: "2026-04-01T10:30:00Z"
  }
}
```

### Error Codes

```typescript
enum ErrorCode {
  // Client errors (4xx)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',

  // Server errors (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
}
```

### Pagination

```typescript
// Query parameters
GET /api/v1/flights?page=2&limit=20&origin=SYD&destination=MEL

// Response includes pagination metadata
{
  success: true,
  data: Flight[],
  meta: {
    page: 2,
    limit: 20,
    total: 150,
    timestamp: "..."
  }
}
```

### Versioning

- All endpoints prefixed with `/api/v1/`
- Major breaking changes bump version: `/api/v2/`
- Backward compatibility maintained for 2 versions
- Deprecation headers sent: `Deprecation: true`, `Sunset: date`

---

## NestJS Patterns

### Module Structure

```typescript
// flights/flights.module.ts
@Module({
  imports: [CacheModule, AuthModule],
  controllers: [FlightsController],
  providers: [FlightsService, FlightsRepository],
  exports: [FlightsService],
})
export class FlightsModule {}
```

### Service Pattern

```typescript
@Injectable()
export class FlightsService {
  constructor(
    private readonly flightsRepository: FlightsRepository,
    private readonly cacheService: CacheService,
    private readonly amadeusService: AmadeusService,
  ) {}

  async searchFlights(dto: SearchFlightsDto): Promise<Flight[]> {
    // Cache-aside pattern
    const cached = await this.cacheService.get(`flights:${key}`);
    if (cached) return cached;

    const flights = await this.amadeusService.search(dto);
    await this.cacheService.set(`flights:${key}`, flights, 30 * 60); // 30 min TTL
    return flights;
  }
}
```

### DTO with Validation

```typescript
import { IsString, IsDateString, Min, Max, IsOptional } from 'class-validator';

export class SearchFlightsDto {
  @IsString()
  @Length(3, 3)
  origin: string; // IATA code

  @IsString()
  @Length(3, 3)
  destination: string;

  @IsDateString()
  departureDate: string; // ISO format

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsOptional()
  @Min(0)
  @Max(999999)
  maxPrice?: number;
}
```

### Global Exception Filter

```typescript
@Catch(HttpException)
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    response.status(status).json({
      success: false,
      error: {
        code: exceptionResponse.code || 'INTERNAL_ERROR',
        message: exceptionResponse.message || 'An error occurred',
        details: exceptionResponse.details,
      },
      meta: { timestamp: new Date().toISOString() },
    });
  }
}
```

### Global ValidationPipe

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           // Strip unknown properties
    forbidNonWhitelisted: true, // Reject unknown properties
    transform: true,            // Auto-convert to DTO class
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

### Response Interceptor

```typescript
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })),
    );
  }
}
```

### Custom Exception

```typescript
export class AppException extends HttpException {
  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 400,
  ) {
    super(
      {
        code,
        message,
      },
      statusCode,
    );
  }
}

// Usage
throw new AppException(
  'Passenger name is required',
  ErrorCode.VALIDATION_ERROR,
  400,
);
```

---

## Next.js Patterns

### Server vs Client Components

```typescript
// app/flights/page.tsx - Server component (default)
export default async function FlightsPage() {
  const flights = await fetchFlights(); // Server-side data fetching
  return <FlightsList flights={flights} />;
}

// components/flights/flight-search-form.tsx - Client component
'use client';

export function FlightSearchForm() {
  const [filters, setFilters] = useState({});
  const { data } = useQuery(...); // Client-side state
  return <form onSubmit={handleSearch}>...</form>;
}
```

### TanStack Query Usage

```typescript
// hooks/use-flight-search.ts
export function useFlightSearch(filters: SearchFilters) {
  return useQuery({
    queryKey: ['flights', filters],
    queryFn: ({ signal }) => api.searchFlights(filters, { signal }),
    staleTime: 5 * 60 * 1000,              // 5 minutes
    gcTime: 30 * 60 * 1000,                // 30 minutes (formerly cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Component usage
export function SearchFlights() {
  const [filters, setFilters] = useState({});
  const { data: flights, isLoading, error } = useFlightSearch(filters);

  return (
    <>
      {isLoading && <Spinner />}
      {error && <ErrorAlert message={error.message} />}
      {flights && <FlightsList flights={flights} />}
    </>
  );
}
```

### Form Validation with React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const searchSchema = z.object({
  origin: z.string().length(3, 'Must be IATA code'),
  destination: z.string().length(3, 'Must be IATA code'),
  departureDate: z.string().refine((date) => new Date(date) > new Date()),
  budget: z.number().min(0),
});

type SearchInput = z.infer<typeof searchSchema>;

export function SearchForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SearchInput>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = async (data: SearchInput) => {
    const result = await searchFlights(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('origin')} />
      {errors.origin && <span>{errors.origin.message}</span>}
      <button type="submit">Search</button>
    </form>
  );
}
```

### Error Boundary with error.tsx

```typescript
// app/flights/error.tsx
'use client';

export default function FlightsError({ error, reset }: {
  error: Error,
  reset: () => void,
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## File Organization

### Component Directory Layout

```
components/
├── ui/                          # shadcn/ui wrappers
│   ├── button.tsx
│   ├── input.tsx
│   └── ...
├── layout/
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── sidebar.tsx
├── flights/
│   ├── flight-search-form.tsx
│   ├── flight-list.tsx
│   └── flight-card.tsx
├── hotels/
│   ├── hotel-search-form.tsx
│   ├── hotel-list.tsx
│   └── hotel-card.tsx
├── booking/
│   ├── booking-step-1.tsx       # Select
│   ├── booking-step-2.tsx       # Details
│   ├── booking-step-3.tsx       # Payment
│   └── booking-progress.tsx
└── shared/
    ├── loading-spinner.tsx
    ├── error-alert.tsx
    └── pagination.tsx
```

### NestJS Directory Layout

```
src/modules/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   ├── register.dto.ts
│   │   └── refresh-token.dto.ts
│   └── strategies/
│       ├── jwt.strategy.ts
│       └── local.strategy.ts
├── flights/
│   ├── flights.controller.ts
│   ├── flights.service.ts
│   ├── flights.module.ts
│   ├── flights.repository.ts
│   ├── dto/
│   │   └── search-flights.dto.ts
│   └── entities/
│       └── flight.entity.ts
└── ...
```

### File Size Guidelines

- **Max 200 lines per file** (hard limit)
- Split large files: service into service + repository
- Move utility functions to separate module
- Extract constants to `constants.ts`
- Example: FlightsService (150 lines) + FlightsRepository (80 lines)

---

## Git Conventions

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Type**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`

**Examples**
```
feat: add budget filtering to flight search
fix: handle Amadeus API timeout gracefully
docs: update deployment guide
refactor: extract cache service logic
test: add tests for promotion application
```

**Rules**
- Subject: lowercase, imperative, 50 chars max
- Body: explain what and why (not how)
- No AI references ("chatgpt", "claude", "ai-generated")
- One logical change per commit

### Branch Naming

```
feat/user-authentication
feat/budget-filtering
fix/payment-retry-logic
docs/api-documentation
refactor/cache-service
chore/upgrade-dependencies
```

### Pre-commit Checks

Run before pushing:
```bash
npm run lint        # ESLint
npm run type-check  # TypeScript compiler
npm run test        # Jest/Vitest
npm run build       # Compile code
```

**Never commit**
- `.env` files (use `.env.example` template)
- API keys, secrets, credentials
- `node_modules/`, `dist/`, `.next/`
- IDE settings (`.vscode/`, `.idea/`)

---

## Security Standards

### Input Validation

**NestJS**: All DTOs have class-validator decorators
```typescript
export class CreateBookingDto {
  @IsNotEmpty()
  @IsUUID()
  flightId: string;

  @IsArray()
  @ValidateNested()
  @Type(() => PassengerDto)
  passengers: PassengerDto[];
}
```

**Next.js**: Client-side with React Hook Form + Zod, server-side with Zod/Zod
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const result = schema.safeParse(formData);
if (!result.success) throw new Error('Validation failed');
```

### Payment Security

- **Never** store raw card data on server
- Use Stripe.js Elements for client-side tokenization
- Server receives only Stripe token
- All requests use HTTPS (enforced by Nginx)

### Database Security

- **Parameterized queries only** (Prisma handles this)
- No string concatenation for SQL
- Least privilege: API service user has minimal role
- Example (DO):
  ```typescript
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  ```
- Example (NEVER):
  ```typescript
  const user = await prisma.$queryRaw(`SELECT * FROM users WHERE id = ${userId}`);
  ```

### Authentication & Authorization

- JWT tokens in httpOnly cookies (cannot be accessed via JS)
- Refresh token rotation on each use
- Session expiry: 7 days (refresh token), 15 minutes (access token)
- Rate limiting on `/auth/*` endpoints: 5 attempts/minute
- CORS configured for same-domain only

### Headers & Compliance

**Nginx CSP Headers**
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://js.stripe.com; style-src 'self' 'unsafe-inline';" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Strict-Transport-Security "max-age=31536000" always;
```

---

## Code Quality

### Linting & Formatting

**ESLint**
- Config: `packages/eslint-config`
- Rules: Airbnb style + custom TravelClone rules
- No single-character variables (except `i` in tight loops, `e` for event)
- No `var` in JavaScript
- No unused imports or variables

**Prettier**
- 2-space indentation
- 80-character line width
- Trailing commas in objects/arrays
- Single quotes for strings

### Testing Guidelines

- Unit tests co-located with source: `user.service.ts` + `user.service.spec.ts`
- Minimum 80% coverage for business logic
- Mock external APIs (Amadeus, Stripe) in tests
- Use fixtures for test data in `test/fixtures/`

### Comments & Documentation

- **Minimal comments**: Code should be self-documenting
- Comment only non-obvious logic (algorithms, workarounds, rationale)
- JSDoc for exported functions and classes:
  ```typescript
  /**
   * Applies a promotion code to a booking.
   * @param bookingId - The booking to apply the promotion to
   * @param code - The promotion code
   * @returns Updated booking with discounted total
   * @throws AppException if code is invalid or expired
   */
  async applyPromotion(bookingId: string, code: string): Promise<Booking> {
    // ...
  }
  ```

---

## Performance Standards

### API Response Times

- Search endpoints (flights/hotels): <500ms p95
- Booking creation: <1000ms p95
- Admin dashboard: <2000ms p95
- Cache hits: <50ms p95

### Bundle Size

- Initial JS (main bundle): <150KB gzipped
- Next.js pages: <50KB gzipped each
- No dynamic imports without loading states

### Database Query Performance

- Search queries: <100ms with warm cache
- Index scans on: `(origin, destination, date)` for flights
- N+1 query prevention: Use Prisma `include()` or `select()`

---

## Environment Configuration

### Environment Variables Template (.env.example)

```env
# App
NODE_ENV=development
PORT=4000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/mtxprd
REDIS_URL=redis://localhost:6379/0

# APIs
AMADEUS_CLIENT_ID=your_id
AMADEUS_CLIENT_SECRET=your_secret
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Auth
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

# Email
RESEND_API_KEY=your_resend_key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost/api/v1
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
```

**Rules**
- Never commit `.env` (only `.env.example`)
- Prefix public vars with `NEXT_PUBLIC_`
- Use strong secrets in production (32+ chars)
- Rotate secrets on team changes
