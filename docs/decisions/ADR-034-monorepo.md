# ADR-034 — Monorepo vs Split Repos

**Status:** Accepted  
**Date:** 2025-09-03

## Decision
We will use a **monorepo** managed with **pnpm workspaces** for Domana (e.g., \ackend/\, \mobile/\, future \web/\, and \packages/shared/\).

## Context
- We already have \ackend/\ at the root and shared dev scripts.
- Cross-cutting concerns (design tokens, shared types, utils) are easier to share in one repo.
- CI and versioning are simpler for a small, fast-moving team.

## Options Considered
1) **Monorepo (pnpm workspaces)** — ✅ chosen  
2) Split repos per service/app — more overhead today; revisit if team/org needs change.

## Consequences
- Pros: atomic PRs across packages, shared tooling/configs, simpler CI, easier refactors.  
- Cons: requires light workspace discipline (lint/typecheck per package, clear scripts).

## Guardrails
- Each package owns its own \.env\, README, and start scripts.
- Root docs include a setup/runbook for new devs.
- Revisit split-repo if: team > 10 engineers, divergent release cadences, or access-control constraints.

