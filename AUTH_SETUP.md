# Auth Architecture (Production-oriented)

## Implemented
- HTTP-only secure access/refresh cookies.
- Session table (`auth_sessions`) with token hashing.
- OAuth entry endpoints:
  - `/api/auth/oauth/google`
  - `/api/auth/oauth/apple`
- Refresh endpoint: `/api/auth/refresh`.
- Middleware role-protection and secure headers.
- Security logging hooks for failed/success logins.
- Admin-ready session metadata (IP, UA, fingerprint placeholder).

## Required environment
- `JWT_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Supabase configuration
1. Enable OAuth providers in Supabase Auth (Google + Apple).
2. Set redirect URLs to your app (`/login`).
3. Run migrations including `002_auth_hardening.sql`.

## Recommended next steps
- Add OTP send/verify endpoints and enforce for admins.
- Add CSRF token issuance + verification for mutating APIs.
- Add IP-level rate limiting with Redis/Upstash.
- Add security center UI for session monitoring and force logout.
