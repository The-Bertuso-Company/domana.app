# Phase 5 — Backend Setup (Snapshot)

**Status:** API + DB (Postgres + PostGIS) + storage + queues + health + smoke scripts.

## Included
- API service with auth/rate-limit/logging
- Health/status: `/health`, `/status`, `/db/ping`
- Listings: `/v1/listings/nearby?lat&lng&radius_km` (PostGIS)
- Prisma schema + migrations + seed
- S3 + local uploads storage adapters
- Docker compose (Postgres 16 + Redis 7)
- Smoke: `scripts/phase5-smoke.ps1`, `scripts/s3-smoke.ps1`
- Helper: `scripts/enable-s3.ps1`
- OpenAPI snapshot: `docs/openapi.json`