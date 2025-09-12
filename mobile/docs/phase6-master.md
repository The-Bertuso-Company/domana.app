# 📘 Domana — Phase 6 Master Document

Stage: MVP Build & Launch  
Phase: 6 — Mobile App Bootstrap  
Status: 🚧 In Progress

## 🎯 Phase Objectives

- Establish a **deterministic toolchain** so every developer builds with identical versions.
- Configure **workspace-wide standards** (TypeScript, lint, formatting).
- Bootstrap app configuration (`app.config.ts`, EAS, signing, permissions).
- Ensure **runtime stability** (Metro/Babel sanity, theming, safe areas, query client).
- Add **operational hooks** (error boundary, Sentry, analytics, feature flags, i18n).
- Wire initial **deep link + API integration**.
- Deliver working **internal distribution flow** to testers.

## 📂 Deliverables (Steps 46–61)

(…full step list from our master doc…)

## ✅ Graduation Criteria

- Clean clone → `verify:toolchain` passes → app builds.
- IDs, versions, schemes, extras correct.
- Dev/staging Android builds succeed, OTA updates work.
- Permissions prompt correctly, maps load.
- Metro bundle clean, no alias/plugin issues.
- Theming, safe areas, status bar validated.
- QueryClient working with retries & errors.
- Error boundaries + NotFound screens working.
- Sentry receives errors under correct env.
- Analytics events flow in staging.
- Feature flags toggle safely.
- i18n EN/TL toggle working.
- Deep links route correctly, unknown blocked.
- API `/health` succeeds; network errors handled.
- Internal tester installs and confirms build works.
