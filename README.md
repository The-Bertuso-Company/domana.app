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

## 🖥️ MVP Screens
1. **Home / Search**  
2. **Listing Details**  
3. **Contact Seller/Agent**

---

## 📊 Success Metrics (MVP)
- **100** verified listings live in first 90 days after launch  
- **500** monthly active users browsing properties

---

## 🧱 Tech Stack
**Frontend:** Next.js, React, Tailwind CSS  
**Backend:** Node.js, Express (API), PostgreSQL  
**Infra:** Vercel (frontend). Backend hosting TBD  
**Monitoring:** Sentry  
**Maps:** Mapbox  
**Payments (future):** Xendit or PayMongo

> Note: Keep stack minimal during MVP. Add tools only when the pain is real.

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+  
- pnpm or npm  
- PostgreSQL 14+ (if running backend locally)

### Frontend (Next.js)
```bash
# from repo root
cd frontend
pnpm install        # or: npm install
cp .env.example .env.local  # fill values
pnpm dev            # or: npm run dev

Common env keys (example):

NEXT_PUBLIC_APP_NAME=Domana
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token
SENTRY_AUTH_TOKEN=your_sentry_token
SENTRY_ORG=the-bertuso-company
SENTRY_PROJECT=javascript-nextjs

Backend (Node + Express)

# from repo root
cd backend
pnpm install
cp .env.example .env        # fill values
pnpm dev

Common env keys (example):

DATABASE_URL=postgres://user:pass@localhost:5432/domanadb
JWT_SECRET=change_me

    If backend is not ready yet, stub API responses in the frontend using mock data or a simple /api route in Next.js.

🧪 Testing

    Unit tests: pnpm test

    Lint: pnpm lint

    Type check: pnpm typecheck

Add these as required checks on main when CI is set up.
🚀 Deployments

Frontend: Vercel

    Create VERCEL_PROJECT_ID and VERCEL_ORG_ID locally if using CLI

    Add environment variables in Vercel Project Settings → Environment Variables

    Set Production to main branch

Backend: TBD

    Options: Fly.io, Railway, Render, or AWS Lightsail

    Use a managed Postgres if possible for reliability

🧯 Monitoring (Sentry)

    Installed via Sentry Wizard for Next.js

    Confirm release tags in CI to track deploys

    Set alerts for unhandled exceptions and API error rates

🔐 Security and Privacy

    Do not commit secrets. Use .env* and Vercel project envs

    Rotate tokens on role change or contractor access

    Sanitize PII in logs

    For production, enforce HTTPS everywhere

🔁 Beta Program

Closed beta via:

    TestFlight (iOS)

    Google Play Closed Testing (Android)

Waitlist: coming soon
Feedback channel: GitHub Discussions or a Google Form
🗺️ Roadmap (high level)

    v0.1: Search, details, contact

    v0.2: Saved searches, simple auth

    v0.3: Agent dashboard, basic listing management

    v0.4: Verification workflow for listings

    v0.5: Payments readiness (escrow pathways research)

🤝 Contributing

Domana is currently private during MVP.
If you want to help later, email hello@bertuso.com with your GitHub and what you’d like to work on.
🧭 Repo Hygiene

    Protect main branch and require PRs

    Conventional commits for clarity: feat:, fix:, docs:, chore:

    Keep README accurate to reality. Update on every major change

📄 License

All rights reserved © 2025 The Bertuso Company
🌐 Links

    Company: https://bertuso.com

    App: https://domana.app
