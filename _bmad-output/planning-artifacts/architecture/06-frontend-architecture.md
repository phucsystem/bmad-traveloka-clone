# Section 3.4: Frontend Architecture

[Back to index](index.md)

---

### 3.4 Frontend Architecture

#### 3.4.1 Next.js App Router Strategy

| Route Segment | Rendering | Rationale |
|---|---|---|
| `/` (Homepage) | RSC (Server Component) | Promotions fetched server-side; optimal FCP |
| `/flights` | RSC + Client boundary for filters | Initial results SSR; filter interaction client-side |
| `/hotels` | RSC + Client boundary for filters | Same as flights |
| `/budget-discovery` | Client Component | Interactive form; no SEO value |
| `/booking/[step]` | Client Component | Multi-step form state; auth required |
| `/my-bookings` | RSC (protected) | Static list from API; auth required |
| `/my-bookings/[id]` | RSC (protected) | Booking detail; auth required |
| `/auth/signin` | Client Component | OAuth redirect handling |

#### 3.4.2 State Management

| State Type | Solution | Scope |
|---|---|---|
| Server data (flights, hotels, bookings) | TanStack Query v5 (React Query) | Global cache |
| Booking flow form state | React Hook Form + Zod | Component tree |
| Booking step progression | React Context (`BookingFlowContext`) | Booking route segment |
| UI state (modal open, filter panel) | `useState` / `useReducer` | Local component |
| User geolocation | `useState` + `navigator.geolocation` | Homepage component |
| Auth session | Better Auth React SDK | Global (layout) |

- **React Query config:**
  - `staleTime`: 300000 (5min) for flight/hotel data
  - `gcTime`: 600000 (10min)
  - Optimistic updates for booking status changes
  - `queryKey` factory in `packages/shared/src/query-keys.ts`

#### 3.4.3 PWA Configuration

```javascript
// apps/web/next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    { urlPattern: /^https:\/\/api\.travelclone\.com\/api\/v1\/promotions/, handler: 'StaleWhileRevalidate', options: { cacheName: 'promotions-cache', expiration: { maxAgeSeconds: 900 } } },
    { urlPattern: /\.(png|jpg|jpeg|webp|svg)$/, handler: 'CacheFirst', options: { cacheName: 'image-cache', expiration: { maxEntries: 100, maxAgeSeconds: 86400 } } },
  ],
});
```

- **App shell:** Layout (`apps/web/src/app/layout.tsx`) is the cached shell; all nav/header/footer cached by service worker
- **Install prompt:** Shown after first successful booking or on 3rd visit (tracked in `localStorage`)
- **Manifest:** `apps/web/public/manifest.json` — `theme_color: #0064D2`, `background_color: #F8FAFC`, `display: standalone`

#### 3.4.4 Design System

- **Component library:** shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Custom design tokens** via `tailwind.config.ts`:

```typescript
// apps/web/tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: { 50: '#EFF6FF', 100: '#DBEAFE', 500: '#2980E8', 600: '#0064D2', 700: '#0052A8' },
      accent:  { 50: '#FFF8F1', 100: '#FFF7ED', 600: '#FF6B00', 700: '#D45800' },
      success: { 100: '#DCFCE7', 600: '#16A34A' },
      warning: { 100: '#FEF3C7', 600: '#D97706' },
      error:   { 100: '#FEE2E2', 600: '#DC2626' },
    },
    borderRadius: { DEFAULT: '8px', lg: '12px', xl: '16px' },
  },
}
```

- **Custom components** (not from shadcn/ui registry):
  - `DealCard` — Homepage promotion card with destination image, price, CTA
  - `FlightCard` — Search result row: airline, times, duration, price
  - `HotelCard` — Search result card: name, stars, amenities, price/night
  - `PriceDisplay` — Styled price with AUD prefix; orange accent
  - `BookingStepIndicator` — 3-step progress bar
  - `BudgetDiscoveryWidget` — Budget/city/dates form
  - `BookingConfirmation` — Shareable confirmation card
