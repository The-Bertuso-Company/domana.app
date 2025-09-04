# Domana 🏠

Domana is a modern real estate platform for the Philippines, built and operated by **The Bertuso Company**.  
Our mission is to make buying, selling, and exploring property easy, transparent, and accessible for everyone.

---

## 🚦 Project Status
**Stage:** MVP development (v0.1)  
**Focus:** Ship 3 core screens fast, learn from beta testers, tighten the loop.

---

## 🎯 Target Users
- Buyers
- Sellers and agents
- Renters
- Overseas Filipinos (OFWs)

---

## ✅ Core Jobs-to-Be-Done (MVP)
1. Search for property with essential filters  
2. View verified listing details and photos  
3. Contact the seller or agent

---

## 🖥️ / 📱 MVP Screens
1. **Home / Search (Map-first)**
2. **Listing Details**
3. **Contact Seller/Agent**

---

## 📊 Success Metrics (MVP)
- **100** verified listings live in first 90 days after launch  
- **500** monthly active users browsing properties  
- **≥ 99.0%** crash-free sessions (mobile)  
- **p75 cold start < 3.5s** (mobile, release builds)

---

## 🧱 Tech Stack

**Mobile:** React Native (Expo, Expo Router)  
**Web (optional for now):** Next.js, React, Tailwind CSS  
**Backend:** Node.js, Express (API), PostgreSQL  
**Infra:** Vercel (web). **Mobile builds:** Expo EAS. **Backend hosting:** TBD  
**Monitoring:** Sentry (Next.js + sentry-expo for RN)  
**Maps:** Mapbox (use public-scoped token on client)  
**Payments (future):** Xendit or PayMongo

> Keep stack minimal during MVP. Add tools only when the pain is real.

---

## 📦 Repo Structure

.
├─ mobile/ # Expo app (primary MVP client)
├─ frontend/ # Next.js web (parking lot / optional)
├─ backend/ # Node + Express API (WIP)
└─ docs/
├─ schemas/ # JSON/YAML schemas (listing.v1, agent.v1, etc.)
└─ api/ # contracts, versioning notes


---

## 🛠️ Local Development

### Requirements
- Node.js **18+** (LTS recommended)  
- pnpm **8+** (or npm)  
- PostgreSQL **14+** (if running backend locally)  
- (Mobile) Android Studio / Xcode for emulators

### Mobile (Expo)
```bash
# from repo root
cd mobile
pnpm install            # or: npm install
cp .env.example .env    # fill values

# run
pnpm start              # or: npx expo start
# build (cloud)
pnpm expo:build         # wrapper for: npx eas build -p android|ios
# OTA update (when configured)
pnpm expo:update

Common env keys (example):

EXPO_PUBLIC_APP_NAME=Domana
EXPO_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token
SENTRY_DSN=https://your_sentry_dsn
SENTRY_ENV=development

    Use EXPO_PUBLIC_* for values that ship to the client. Never embed private tokens in the app.

Web (Next.js)

cd frontend
pnpm install
cp .env.example .env.local
pnpm dev

Common env keys (example):

NEXT_PUBLIC_APP_NAME=Domana
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token
SENTRY_AUTH_TOKEN=your_sentry_token
SENTRY_ORG=the-bertuso-company
SENTRY_PROJECT=javascript-nextjs

Backend (Node + Express)

cd backend
pnpm install
cp .env.example .env
pnpm dev

Common env keys (example):

DATABASE_URL=postgres://user:pass@localhost:5432/domanadb
JWT_SECRET=change_me

    If backend isn’t ready, stub API responses in the mobile/web clients (mock data or Next.js /api routes).

🧪 Testing

pnpm test        # unit tests
pnpm lint        # eslint
pnpm typecheck   # ts types

Make these required checks on PRs to main once CI is wired up.
🚀 Deployments
Mobile (Expo)

    Builds: EAS Build (internal → TestFlight / Closed Testing)

    Channels: development, preview, production

    OTA: EAS Update for safe JS/asset updates (no native changes)

Web

    Host: Vercel

    Create VERCEL_PROJECT_ID & VERCEL_ORG_ID locally if using CLI

    Add environment variables in Vercel → Project Settings → Environment Variables

    Set Production to main branch

Backend (TBD)

    Options: Fly.io, Railway, Render, AWS Lightsail

    Prefer managed Postgres in production

🧯 Monitoring (Sentry)

    Web: Installed via Sentry Wizard for Next.js

    Mobile: sentry-expo (React Native). Configure DSN, environment, release, and dist

    Tag releases in CI to track deploys

    Alerts: unhandled exceptions, API error rates, slowdown spikes

🔐 Security & Privacy

    Do not commit secrets. Use .env*, Vercel/Expo project envs, and platform secrets

    Rotate tokens on role change or contractor access

    Sanitize PII in logs

    Enforce HTTPS in production

    Use public-scoped Mapbox tokens on client; keep private tokens server-side

🔁 Beta Program

    iOS: TestFlight (Closed/Internal)

    Android: Google Play Closed Testing

    Waitlist: coming soon

    Feedback: GitHub Discussions or a Google Form

🗺️ Roadmap (high level)

    v0.1: Search, details, contact

    v0.2: Saved searches, simple auth

    v0.3: Agent dashboard, basic listing management

    v0.4: Verification workflow for listings

    v0.5: Payments readiness (escrow pathways research)

Data & MLS Backbone (parallel track)

    listing.v1, agent.v1, savedSearch.v1, savedHome.v1

    versioning strategy, de-dup rules, provenance/KYC fields

    geospatial indexing & tiles, EN/Tagalog i18n

    See docs/schemas/ and docs/api/ (placeholders OK until merged)

🤝 Contributing

Private during MVP.
If you want to help later, email hello@bertuso.com

with your GitHub and what you’d like to work on.
🧭 Repo Hygiene

    Protect main and require PRs

    Required checks: lint, test, typecheck

    Conventional commits: feat:, fix:, docs:, chore:

    Pin Node (e.g., .nvmrc) and package manager version

    Keep README accurate to reality. Update on every major change

📄 License

All rights reserved © 2025 The Bertuso Company
🌐 Links

    Company: https://bertuso.com

App: https://domana.app
