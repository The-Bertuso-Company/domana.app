# Architecture Decision Log — Domana

## ADR-0001: Monorepo vs Split Repos
**Status:** Accepted  
**Date:** 2025-09-06 (America/Chicago)

### Context
Domana currently contains multiple apps/services in one repository:
- mobile (Expo React Native)
- backend (Fastify + Prisma)
- web/frontend (Next.js)
- shared packages/config (tsconfig, eslint, UI, types)

### Decision
Domana will remain a **monorepo** managed with **pnpm workspaces** (and optional Turborepo later).  
Single issue tracker, atomic PRs, shared code & types across apps.

### Rationale
- Faster developer velocity (shared components/types/utilities)
- Atomic changes across services (one PR/CI)
- Simpler dependency + version alignment
- Lower coordination cost for a small team

### Consequences
- Centralized CI pipelines and caching
- Clear package boundaries enforced (eslint + tsconfig paths)
- CODEOWNERS per package for review routing
- Conventional Commits & Changesets recommended for versioning

### Revisit Triggers
- Team size > 8 engineers
- Independent release schedules per service required
- CI times exceed 15 minutes consistently
- Regulatory/compliance isolation required

### Implementation Notes
- Keep pnpm workspaces as the source of truth
- Enforce boundaries with lint rules and path aliasing
- Consider Turborepo for task orchestration and caching
---

## ADR-0002: Object Storage Provider
**Status:** Accepted  
**Date:** 2025-09-07 (America/Chicago)

### Decision
- **Prod:** AWS S3 (S3-compatible; Cloudflare R2 remains a cost-optimization option later)
- **Dev:** Local disk uploads remain default until S3 envs are present

### Rationale
- S3 API is the de facto standard; broad SDK support
- Easy to swap to R2/MinIO via S3 endpoint if needed
- Keeps local dev simple (no external account needed)

### Env Contract (backend/.env)
- \AWS_ACCESS_KEY_ID\, \AWS_SECRET_ACCESS_KEY\
- \S3_REGION\, \S3_BUCKET\
- Optional: \S3_ENDPOINT\ (for R2/MinIO), \S3_PUBLIC_BASE_URL\ (CDN/domain for public reads)

### Switch Logic
- If S3 creds + bucket are present, use S3
- Otherwise, use local disk (\uploads/\) as the default

### Revisit Triggers
- Need for global edge delivery or lower egress (consider R2)
- Compliance or data residency constraints
