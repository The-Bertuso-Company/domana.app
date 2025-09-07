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