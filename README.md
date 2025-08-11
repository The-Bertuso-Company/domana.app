# 🏡 domana.app

**Domana** is a trust-first real-estate platform for Southeast Asia and emerging markets.  
Built on integrity, clarity, and user empowerment.

> **Status:** MVP in active development · **Monorepo:** frontend (Next.js) + backend (Express)  
> **Owner:** The Bertuso Company (TBC) · **Contact:** support@domana.app

---

## 🔧 About The Bertuso Company
Founder-led. Product-focused.  
HQ: Illinois · Built for Southeast Asia. Vision: Global.

We believe technology should **elevate trust**. Domana is our flagship product, combining modern design, verified data, and a human-centered approach to property.

---

## 🚀 Core Features (MVP)
- 🔍 **Smart search + filters** for verified listings  
- 🛡️ **Scam prevention** (agent profiles, reporting, fraud signals)  
- 🗺️ **Map view** (Mapbox)  
- 📱 **Mobile-first** UX  
- 📚 **Buyer education** (guides & checklists)

> Coming soon: saved searches/alerts, listing boosts, agent subscriptions, media uploads.

---

## 🏗️ Architecture
- **Frontend:** Next.js + React + Tailwind  
- **Backend:** Node.js (Express) + PostgreSQL  
- **Auth:** Firebase Auth (email/phone)  
- **Payments (PH-ready):** Xendit / PayMongo (sandbox first)  
- **Maps:** Mapbox  
- **Infra:** Vercel (frontend) · Render/Railway (backend)  
- **CI/CD:** GitHub Actions

---

## 📁 Monorepo Layout
```
/frontend      # Next.js app
/backend       # Express API, webhooks, DB
/public        # brand assets, static pages (e.g., landing/press)
/docs          # specs, policies, UX flows
README.md
LICENSE
```

---

## ⏱ Quickstart

### Prereqs
- Node 22 LTS, npm
- PostgreSQL 14+ (local or cloud)
- Mapbox account (token)
- Firebase project (Auth)
- Xendit/PayMongo **test** API keys

### 1) Clone
```bash
git clone https://github.com/The-Bertuso-Company/domana.app.git
cd domana.app
```

### 2) Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
# http://localhost:3000
```

### 3) Backend
```bash
cd ../backend
npm install
cp .env.example .env
npm run db:migrate   # (add migration script later)
npm run dev
# http://localhost:4000
```

---

## 🔐 Environment Variables

**`/frontend/.env.local`**
```
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_ENV=development
```

**`/backend/.env`**
```
PORT=4000
DATABASE_URL=postgres://user:pass@localhost:5432/domanadb

# Auth
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Payments (sandbox)
XENDIT_SECRET_KEY=xnd_development_...
PAYMONGO_SECRET_KEY=sk_test_...
WEBHOOK_SHARED_SECRET=change_me
```

> Keep `.env*` out of Git (`.gitignore`). Rotate keys before launch.

---

## 💳 Payments (Phase 0)
- Use **hosted checkout** only (web) to avoid app-store IAP rules.  
- Endpoints:
  - `POST /api/pay/checkout-session` → returns `checkoutUrl`
  - `POST /api/pay/webhook/xendit` (and/or `/paymongo`) → verifies + activates features
- Initial SKUs:
  - `featured_listing_7d` (₱199 one-time)  
  - `agent_start_monthly` (₱499/mo)

---

## 📜 Policies
- Privacy: `/docs/privacy-policy.html`  
- Terms: `/docs/terms-of-service.html`  
- Security Disclosure: `security@domana.app`

---

## 🧪 Scripts
**Frontend:**
```
dev, build, start, lint, type-check
```
**Backend:**
```
dev, start, lint, test, db:migrate, db:seed
```

---

## 🗂 Branching & PRs
- Default branch: `main`  
- Feature branches: `feat/<area>-<short>` (e.g., `feat/payments-checkout`)  
- Conventional commits: `feat|fix|chore|docs|refactor(scope): message`  
- PR checks: lint, type, test (GitHub Actions)

---

## 🧭 Roadmap
1. **MVP-1:** Browse + Search + Listing details  
2. **MVP-2:** Accounts + Saved listings  
3. **MVP-3:** Agent onboarding + basic verification  
4. **Monetization-1:** Listing boost (₱199)  
5. **Monetization-2:** Agent Start (₱499/mo) + invoices  
6. **Trust-1:** Reporting, moderation tools  
7. **Media:** Photo/video uploads, CDN  
8. **Apps:** Android (webview + deep links), later iOS

---

## 🤝 Contributing
1. Fork  
2. `git checkout -b feat/<feature>`  
3. Commit with conventional messages  
4. Open PR → follow checklist

---

## 🪪 License
MIT — see [LICENSE](LICENSE).

---

## 📬 Contact
- Support: **support@domana.app**  
- Partnerships: **partnerships@bertuso.com**  
- Legal/Privacy: **legal@bertuso.com**, **privacy@domana.app**
