# 🌍 Domana Environment Variables Policy

This document defines how environment variables are handled, named, and secured across all Domana environments (Development, Preview, Staging, Production).

## 1. Purpose
Ensure variables follow consistent naming, exposure, and storage rules—protecting sensitive data and preventing accidental leaks in client code.

## 2. Classification

| Type | Description | Naming Rule | Example |
|------|-------------|-------------|---------|
| **Public** | Used by frontend code; safe to expose. | Must start with `NEXT_PUBLIC_` | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_MAPBOX_TOKEN` |
| **Server-only** | Used by backend, middleware, or build process. | No public prefix. | `DATABASE_URL`, `SENTRY_DSN`, `API_SECRET_KEY` |
| **System** | Provided by the platform (Vercel). | Do not redefine. | `VERCEL_ENV`, `NODE_ENV` |

## 3. Naming Conventions
- UPPERCASE_WITH_UNDERSCORES for all names.
- Public variables **must** use `NEXT_PUBLIC_`.
- Use `_DEV`, `_STAGING`, `_PROD` suffixes only when multiple values coexist in one environment.
- Boolean flags are strings: `"true"` / `"false"` (e.g., `NEXT_PUBLIC_MAINTENANCE_MODE="true"`).

## 4. File Structure & Scope

| File / Source | Purpose | Example Variables |
|---------------|---------|-------------------|
| `.env.local` | Local-only; never committed. | Local DB/S3 creds |
| `.env.development` | Optional dev defaults. | `NEXT_PUBLIC_API_URL=http://localhost:3000` |
| `.env.staging` | Staging values. | `SENTRY_ENVIRONMENT=staging` |
| `.env.production` | Production values. | `SENTRY_ENVIRONMENT=production` |
| `.env.template` | Onboarding example (no secrets). | Dummy keys only |
| **Vercel Dashboard** | Source of truth for Preview/Staging/Prod. | All secrets per environment |

## 5. Storage Guidelines
- **Never commit real secrets.** Only commit `.env.template`.
- Secrets for **Staging/Production** live in the **Vercel dashboard** (scoped per env).
- Add any **new variable** to this policy and to `.env.template` with a safe placeholder.

## 6. Example Template

    # Public
    NEXT_PUBLIC_API_URL=https://api.domana.app
    NEXT_PUBLIC_MAPBOX_TOKEN=pk.test_placeholder

    # Server-only
    DATABASE_URL=postgresql://user:pass@host/db
    SENTRY_DSN=https://example.ingest.sentry.io/123
    VERCEL_BYPASS_TOKEN=placeholder
    AWS_S3_BUCKET=domana-media

## 7. Enforcement
- Use `NEXT_PUBLIC_` **only** if the browser must read it.
- Verify sensitive vars never appear in client bundles.
- Optional CI step to assert required vars exist for each env.
- Update this policy whenever a new var is introduced.

Last Updated: 2025-10-15
