# Section 3.2: Authentication & Security

[Back to index](index.md)

---

### 3.2 Authentication & Security

#### 3.2.1 Better Auth Configuration

```typescript
// apps/api/src/auth/better-auth.config.ts
export const authConfig = {
  providers: [googleOAuth({ clientId, clientSecret })],
  session: {
    accessTokenExpiresIn: 60 * 15,        // 15 minutes
    refreshTokenExpiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieOptions: {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    },
  },
  callbacks: {
    onCreateUser: async (user) => prisma.user.create({ data: { ...user, role: 'user' } }),
    onSignIn: async ({ user }) => ({ role: user.role }),
  },
};
```

#### 3.2.2 Role-Based Access Control

| Role | Access |
|---|---|
| `user` | Own bookings, profile, public search/promotions |
| `admin` | All user data, CRUD inventory/promotions, booking management, refunds |

- NestJS `RolesGuard` + `@Roles('admin')` decorator on admin controllers
- Admin routes prefixed `/api/v1/admin/*`; separate auth check via `AdminAuthGuard`
- Admin dashboard (apps/admin) authenticates against same Better Auth endpoint; role checked on API side

#### 3.2.3 Security Controls

| Control | Implementation |
|---|---|
| Rate limiting | `@nestjs/throttler` — 10 req/min/IP on `/api/v1/auth/*` |
| Input validation | `class-validator` + `class-transformer` on all NestJS DTOs; `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` global |
| SQL injection | Prisma parameterized queries — no raw SQL in application code |
| XSS | React DOM escaping by default; CSP headers via Nginx |
| CSRF | Better Auth CSRF tokens on state-changing requests; SameSite=Strict cookies |
| PCI compliance | Stripe.js client-side tokenization; card data never reaches NestJS |
| HTTPS | Nginx TLS termination; HSTS: `Strict-Transport-Security: max-age=31536000` |
