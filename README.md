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

> Keep the stack minimal during MVP. Add tools only when the pain is real.

---

## 🧭 Branch & Deployment Conventions

| Branch Type | Environment | Domain | Notes |
| --- | --- | --- | --- |
| `main` | Production | https://domana.app | Public, indexed |
| `staging` | Staging | https://staging.domana.app | Pre-release testing |
| `feature/*`, `fix/*`, `phase/*` | Preview | Vercel preview URLs | Temporary dev branches |

**Rules**
- Only code merged into `main` goes live to production.  
- `staging` is for integration and QA before release.  
- All other branches automatically deploy as Vercel Previews.  
- `main` and `staging` are protected; PR + review required.

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+  
- pnpm or npm  
- PostgreSQL 14+ (if running backend locally)

### Frontend (Next.js)
~~~bash
# from repo root
cd frontend
pnpm install        # or: npm install
cp .env.example .env.local  # fill values
pnpm dev            # or: npm run dev
~~~

**Common env keys (example):**
~~~ini
NEXT_PUBLIC_APP_NAME=Domana
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token
SENTRY_AUTH_TOKEN=your_sentry_token
SENTRY_ORG=the-bertuso-company
SENTRY_PROJECT=javascript-nextjs
~~~

### Backend (Node + Express)
~~~bash
# from repo root
cd backend
pnpm install
cp .env.example .env        # fill values
pnpm dev
~~~

**Common env keys (example):**
~~~ini
DATABASE_URL=postgres://user:pass@localhost:5432/domanadb
JWT_SECRET=change_me
~~~

> If the backend isn’t ready yet, stub API responses in the frontend using mock data or a simple `/api` route in Next.js.

---

## 🧪 Testing
- **Unit tests:** `pnpm test`  
- **Lint:** `pnpm lint`  
- **Type check:** `pnpm typecheck`  
Make these required checks on `main` when CI is set up.

---

## 🚀 Deployments

**Frontend:** Vercel  
- Add environment variables in **Vercel → Project Settings → Environment Variables**  
- Map **Production** to `main`  
- Map **Staging** to `staging` (staging subdomain)  
- Previews are automatic for non-protected branches/PRs

**Backend:** TBD  
- Options: Fly.io, Railway, Render, or AWS Lightsail  
- Prefer managed Postgres for reliability

---

## 🧯 Monitoring (Sentry)
- Installed via Sentry Wizard for Next.js  
- Confirm release tags in CI to track deploys  
- Alerts for unhandled exceptions and API error rates

---

## 🔐 Security & Privacy
- Don’t commit secrets; use `.env*` and Vercel envs  
- Rotate tokens on role change or contractor offboarding  
- Sanitize PII in logs  
- Enforce HTTPS everywhere in production

---

## 🔁 Beta Program
Closed beta via:
- TestFlight (iOS)  
- Google Play Closed Testing (Android)

Waitlist: coming soon  
Feedback channel: GitHub Discussions or a Google Form

---

## 🗺️ Roadmap (high level)
- **v0.1:** Search, details, contact  
- **v0.2:** Saved searches, simple auth  
- **v0.3:** Agent dashboard, basic listing management  
- **v0.4:** Listing verification workflow  
- **v0.5:** Payments readiness (escrow pathways research)

---

## 🤝 Contributing
Domana is currently private during MVP.  
If you want to help later, email **hello@bertuso.com** with your GitHub and what you’d like to work on.

---

## 🧭 Repo Hygiene
- Protect `main` and `staging`; require PRs  
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`  
- Keep this README accurate; update on major changes

---

## 📄 License
All rights reserved © 2025 **The Bertuso Company**

---

## 🌐 Links
- Company: https://bertuso.com  
- App: https://domana.app
