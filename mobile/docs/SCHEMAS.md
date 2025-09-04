# SCHEMAS.md — Versioning & Deprecation

## Versioning (SemVer per schema)
- **MAJOR**: backwards-incompatible changes (e.g., remove/rename fields) → bump `v2.x`.
- **MINOR**: backwards-compatible additions (new optional fields, new enum values).
- **PATCH**: clarifications, stricter validation that doesn’t break existing data.

## Support Window
- We support **N-1** MINOR versions at any time within a MAJOR (e.g., v1.3 while v1.4 active).
- Deprecations announce with a **60-day** window before enforcement.

## API Behavior
- Every response includes `schema_version` in headers:
  - `X-Domana-Schema-Listing: 1.0.0` (example)
- Clients SHOULD ignore unknown fields.

## Migrations
- Forward-only SQL migrations.
- Every migration includes idempotent guards and is tagged with a changelog entry.

## Breaking-Change Procedure
1) Propose in changelog, 2) Feature-flag new path, 3) Dual-write/dual-read, 4) Cutover, 5) Cleanup.

