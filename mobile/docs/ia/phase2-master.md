# Domana Mobile — Phase 2 Information Architecture (Master Doc)

This document consolidates all deliverables for **Phase 2: Information Architecture** of the Domana Mobile MVP.  
Each section corresponds to a step in the Phase 2 tracker (Steps 11–20).  

---

## Step 11 — IA Charter & Scope

### Problem Statement & Goals
Domana’s mission is to **build trust in Philippine real estate through verified listings, transparent flows, and world-class user experience**. Without a well-defined Information Architecture (IA), we risk:
- Duplicate flows, inconsistent navigation, and broken user journeys.  
- Confusing deep links and analytics gaps that block scale.  
- Costly rework across frontend, backend, and design.

**Goals for Phase 2 (IA):**
- Create a **single source of truth** for how users move through Domana Mobile.  
- Standardize routes, flows, filters, and deep links for consistency.  
- Ensure every MVP screen has defined empty/error states and analytics coverage.  
- Lay the groundwork for scalable, testable, and extensible app architecture.

### Scope In
Phase 2 IA includes:  
- App navigation model (Explore, Activity, Sell, Pro, Me tabs)  
- Route conventions (expo-router foldering, naming, slugs)  
- Path schema (tabs, modals, nested routes, error boundaries)  
- Cross-tab flows (Explore → Detail → Contact/Save)  
- Search filter schema (canonical fields + serialization)  
- Filter serialization contract (URL, local, API payload consistency)  
- Deep linking map (scheme + HTTPS patterns)  
- Empty/error state catalog (copy, CTAs, illustrations)  
- Analytics taxonomy (screen views, key interactions)  

### Scope Out
IA does not cover:  
- Non-MVP features (mortgage calculators, school overlays, chat v2)  
- Backend API design (handled in Phases 5–6)  
- Advanced localization & accessibility (Phase 3+)  
- Visual tokens or theming (Design System workstream)  

### Constraints
- Must align with Stage 1 product principles (simplicity, trust, verification-first)  
- Device support: Android 9+ / iOS 14+  
- Offline support: retry + error states only  
- Auth gating: required for saving listings, contacting agents, posting listings, Pro features  

### Definition of Done (DoD)
- All 10 IA deliverables exist with no TBDs  
- Every MVP screen appears in path schema  
- No contradictions across nav, routes, filters, links, analytics  
- Empty/error catalog covers all screens  
- Analytics taxonomy covers core flows  
- Single source of truth doc in repo  
- Final sign-off from product, frontend, backend, design leads  

---

## Step 12 — App Navigation Model

### Overview
The Domana Mobile app is structured around **five persistent bottom tabs**: Explore, Activity, Sell, Pro, and Me.  
Default landing: **Explore** (center).  

### Tab-by-Tab Model

**Explore**  
- Purpose: Search & browse verified listings  
- Entry Screen: Explore Map  
- Secondary Screens: Results list, Listing detail, Filter  
- Auth Required: Partial (save/contact requires login)  
- Notes: Default landing. Map + list toggle  

**Activity**  
- Purpose: Review saved items & contact history  
- Entry Screen: Activity Home  
- Secondary Screens: Saved listings, Saved searches, Contacts  
- Auth Required: Yes  
- Notes: Keeps context from Explore actions  

**Sell**  
- Purpose: Post & manage user listings  
- Entry Screen: Sell Home  
- Secondary Screens: Drafts, Create, Preview, Publish  
- Auth Required: Yes  
- Notes: Login required. CTA-driven entry  

**Pro**  
- Purpose: Agent tools & upsell  
- Entry Screen: Pro Dashboard  
- Secondary Screens: Leads, Agent profile, Pro tools  
- Auth Required: Yes  
- Notes: Free users see upsell prompt  

**Me**  
- Purpose: Profile, settings, account hub  
- Entry Screen: Profile Home  
- Secondary Screens: Account, Preferences, Legal, Help  
- Auth Required: Partial (view-only vs edit)  
- Notes: Sign-in needed for edits  

### Global Elements
- Search entry: Explore only (not global)  
- Avatar/Profile: Me tab only  
- Notifications: v2+ (not MVP)  

### Authentication Rules
- No Auth: browsing Explore, viewing details, applying filters  
- Auth: save listings/searches, contact agents, create listings, Pro features  
- Flow: login modal → return user to same spot  

### Back & Reselect Behavior
- Android back: close modal → pop stack → exit at Explore root  
- iOS swipe: stack only, no cross-tab  
- Reselect tab: reset to root of tab  
- Double-tap Explore: scroll to top + recenter map  

### Acceptance Criteria
- 5 tabs with clear roles  
- Back/Reselect behaviors defined  
- Auth gating consistent  
- Global elements minimized  

---

## Step 13 — Route Conventions (expo-router foldering, slugs)

### Folder Grouping
- (tabs) → Explore, Activity, Sell, Pro, Me
- (modals) → Filters, Sort, Share, Login
- (auth) → Login, Signup, Forgot Password
- (shared) → Reusable layouts, error boundaries

### File Naming Rules
- Use kebab-case only
  - ✅ listing-detail.tsx
  - ❌ ListingDetail.tsx (only components inside file use PascalCase)
- Dynamic segments: [listingId].tsx, [draftId].tsx
- Group layouts: _layout.tsx inside each folder
- Root-only index.tsx (never for nested screens)

### Slug Strategy
- Format: /explore/[listingId]-[slug]
  - Example: /explore/12345-modern-condo-bgc
- listingId ensures uniqueness
- slug mismatch tolerated → still load by listingId

### Reserved Names
- System-level: login, signup, pro, sell
- Backend-only: /status, /health (never mobile)
- Error handling: error.tsx in each folder

### Stable Screen IDs
Format: tabName_screenName
- explore_map
- explore_detail
- activity_saved
- sell_create
- pro_dashboard
- me_profile

### Route Params
- [listingId]: string or numeric ID
- [searchToken]: base64/json token from filter serialization (Step 23)
- [draftId]: UUID for drafts
- Optional params always have safe defaults

### Acceptance Criteria
- All screens + routes documented with foldering, slugs, params
- Slug mismatch handling defined
- Screen IDs standardized for analytics
- Reserved names prevent collisions

## Step 14 — Path Schema (tabs, modals, nested routes)

### Tab Root Layout
- / (tabs)/explore → default entry (Explore Map)
- / (tabs)/activity → saved + contacts
- / (tabs)/sell → listing creation hub
- / (tabs)/pro → agent tools
- / (tabs)/me → profile & settings

### Explore Paths
- /explore → Explore Map
- /explore/list → Explore List View
- /explore/[listingId]-[slug] → Listing Detail
- /explore/filter → Filter Modal
- /explore/share/[listingId] → Share Modal

### Activity Paths
- /activity → Activity Home
- /activity/saved → Saved Listings
- /activity/searches → Saved Searches
- /activity/contacts → Contact History

### Sell Paths
- /sell → Sell Home (entry CTA)
- /sell/create → Create Listing Form
- /sell/preview/[draftId] → Preview Draft
- /sell/publish/[draftId] → Publish Listing

### Pro Paths
- /pro → Pro Dashboard
- /pro/leads → Leads Screen
- /pro/profile → Agent Profile
- /pro/tools → Pro Tools

### Me Paths
- /me → Profile Home
- /me/account → Account Settings
- /me/preferences → Preferences
- /me/legal/tos → Terms of Service
- /me/legal/privacy → Privacy Policy
- /me/help → Help & Support

### Auth & Shared Paths
- /auth/login
- /auth/signup
- /auth/forgot-password
- /shared/error → error boundaries

### Modal Rules
- All modals live in (modals) group
- Modals overlay current tab (don’t reset stack)
- Exit modal = return to previous state

### Acceptance Criteria
- Every MVP screen mapped to a unique path
- All modals grouped + overlay correctly
- Nested routes documented for multi-step flows
- Schema is unambiguous, covering all tabs

## Step 15 — Cross-tab Flow Map (Explore → Detail → Contact/Save)

### Core Flow: Explore → Detail → Contact
1. Explore Map/List
   - User browses listings
   - Taps listing → goes to Listing Detail
2. Listing Detail
   - Options: Save, Share, Contact
   - Save → requires auth if not logged in
   - Contact → requires auth if not logged in
3. Auth Modal (if needed)
   - Login/Signup → upon success → return to Listing Detail
   - Action (Save/Contact) completes automatically post-auth
4. Contact Agent Screen
   - Opens modal/form
   - Submission → success state
   - Result recorded in Activity → Contacts

### Save Listing Flow
1. Tap Save on Explore or Listing Detail
2. If logged in → saved instantly
3. If not logged in → login modal → return to Detail → auto-save
4. Saved listing appears under Activity → Saved Listings

### Save Search Flow
1. From Explore, apply filters
2. Tap Save Search
3. If logged in → saved instantly
4. If not logged in → login modal → return to Explore → auto-save
5. Saved search appears under Activity → Saved Searches

### Contact Flow
1. From Listing Detail → tap Contact Agent
2. If logged in → show contact form
3. If not logged in → login modal → return to Detail → auto-open form
4. Submission recorded in Activity → Contacts

### Global Flow Rules
- Auth always modal (never full screen)
- Return to origin after auth → continue where user left off
- Activity tab = log of saved/engaged actions
- Me tab = profile/settings only (no action history)

### Acceptance Criteria
- No dead-ends across flows
- Auth gating returns user to the correct screen
- Saved items and contacts always visible in Activity
- Flow coverage includes Save Listing, Save Search, and Contact

## Step 16 — Empty/Error State Catalog (copy + CTAs)

### Explore
- Empty (no results)
  - Copy: “No homes match your filters. Try adjusting your search.”
  - CTA: Reset Filters
- Error (network/server)
  - Copy: “We couldn’t load listings. Please check your connection.”
  - CTA: Retry

### Activity
- Empty (saved listings)
  - Copy: “You haven’t saved any homes yet.”
  - CTA: Browse Listings
- Empty (saved searches)
  - Copy: “You haven’t saved a search yet.”
  - CTA: Save a Search
- Empty (contacts)
  - Copy: “You haven’t contacted any agents yet.”
  - CTA: Browse Listings

### Sell
- Empty (no drafts)
  - Copy: “You haven’t started a listing yet.”
  - CTA: Create a Listing
- Error (publish failure)
  - Copy: “Something went wrong publishing your listing.”
  - CTA: Retry

### Pro
- Empty (no leads)
  - Copy: “You have no new leads right now.”
  - CTA: Refresh
- Upsell (free user)
  - Copy: “Unlock leads and tools with Domana Pro.”
  - CTA: Upgrade to Pro

### Me
- Empty (not signed in)
  - Copy: “Sign in to manage your account.”
  - CTA: Sign In
- Error (settings load fail)
  - Copy: “We couldn’t load your account info.”
  - CTA: Retry

### Global Errors
- Offline
  - Copy: “You’re offline. Please reconnect to continue.”
  - CTA: Retry when back online
- 500/Unknown
  - Copy: “Something went wrong on our end.”
  - CTA: Retry

### Acceptance Criteria
- Every MVP screen has at least one empty/error state
- All states have copy + CTA (no dead screens)
- Language is trust-building, simple, and user-friendly
- Global errors handled consistently across app

## Step 17 — Canonical Search Filter Schema

### Filter Categories
- Location
  - geo_bbox (map bounds)
  - geo_center (lat/lng)
  - radius (km)
- Price
  - price_min
  - price_max
- Property Type
  - property_type (enum: condo, house, lot, commercial)
- Bedrooms
  - beds_min
  - beds_max
- Bathrooms
  - baths_min
  - baths_max
- Size
  - area_min (sqm)
  - area_max (sqm)
- Features (binary)
  - has_parking (bool)
  - has_pool (bool)
  - has_furnished (bool)
- Listing Status
  - status (enum: for_sale, for_rent, sold, rented)

### Data Types
- Numeric: price_min, price_max, beds_min, beds_max, baths_min, baths_max, area_min, area_max
- Enum: property_type, status
- Boolean: has_parking, has_pool, has_furnished
- Geo: geo_bbox, geo_center, radius

### Defaults
- No filters = match all
- Price: unset
- Beds/Baths: unset
- Property type: unset (all)
- Status: default for_sale
- Geo: required (map always defines a bbox)

### Validation Rules
- price_min ≤ price_max
- beds_min ≤ beds_max
- baths_min ≤ baths_max
- area_min ≤ area_max
- radius must be ≤ 50km
- At least one geo_bbox OR geo_center+radius required

### Acceptance Criteria
- Every Explore filter maps to a canonical field
- Schema covers MVP filters only (future features like schools or mortgage pushed to backlog)
- Filters validated consistently frontend ↔ backend
- Defaults ensure empty filters don’t break results

## Step 18 — Filter Serialization Contract

### Serialization Formats
- Querystring (deep links, shareable URLs)
  - Example:
    ?price_min=2000000&price_max=5000000&beds_min=2&status=for_sale
- Local Storage (saved searches, recent filters)
  - Format: JSON object
  - Example:
    {
      ""price_min"": 2000000,
      ""price_max"": 5000000,
      ""beds_min"": 2,
      ""status"": ""for_sale""
    }
- API Payload (backend search requests)
  - Same JSON object, passed in body or query params

### Key Rules
- Use snake_case for keys
- Omit unset values (don’t send null/undefined)
- Boolean values: true/false only
- Enums: always lowercase (for_sale, not ForSale)

### Versioning
- Add f_v (filter_version) param to querystring + payload
- Current = f_v=1
- If schema changes in future → bump version, keep backward compatibility

### Encoding Rules
- Arrays → comma-separated (property_type=condo,house)
- Geo:
  - geo_center=lat,lng
  - radius=km
  - OR geo_bbox=minLat,minLng,maxLat,maxLng
- Strings must be URI-encoded for querystring

### Examples
- Search link (deep link):
  domana://explore?price_min=2000000&beds_min=2&status=for_sale&f_v=1
- Saved search (local storage):
  {
    ""price_min"": 2000000,
    ""beds_min"": 2,
    ""status"": ""for_sale"",
    ""f_v"": 1
  }
- API request:
  {
    ""price_min"": 2000000,
    ""beds_min"": 2,
    ""status"": ""for_sale"",
    ""geo_bbox"": ""14.55,121.00,14.70,121.10"",
    ""f_v"": 1
  }

### Acceptance Criteria
- One canonical serialization format across app, API, and deep links
- All unset values omitted (compact representation)
- Versioned with f_v for forward compatibility
- Encodings defined for arrays and geo
- Serialization passes roundtrip test (serialize → deserialize → re-serialize = same output)

## Step 19 — Deep Linking Map (scheme + HTTPS)

### Supported Schemes
- App Scheme:
  - domana:// → direct app navigation
- Universal Links (HTTPS):
  - https://domana.app/... → preferred for sharing + SEO
- Both schemes resolve to the same internal path schema (Step 14)

### Core Routes
- Explore:
  - domana://explore
  - https://domana.app/explore
- Listing Detail:
  - domana://explore/[listingId]-[slug]
  - https://domana.app/explore/[listingId]-[slug]
- Saved Search:
  - domana://explore?{filters}
  - https://domana.app/explore?{filters}
- Sell:
  - domana://sell/create
  - https://domana.app/sell/create
- Pro Upsell:
  - domana://pro
  - https://domana.app/pro
- Profile:
  - domana://me
  - https://domana.app/me

### Fallback Rules
- If app not installed → open HTTPS in browser
- If path not recognized → redirect to Explore root
- If listingId not found → show “Listing unavailable” empty state

### Auth-Gated Links
- If user taps deep link requiring auth (e.g., save, contact):
  - Open login modal → return to target screen post-auth
- Examples:
  - domana://activity/saved → requires login
  - domana://sell/create → requires login

### Example Flows
- QR Code on listing flyer → https://domana.app/explore/12345-modern-condo-bgc
  - Opens Explore → Listing Detail (inside app if installed, web otherwise)
- Shared saved search → https://domana.app/explore?price_min=2000000&beds_min=2
  - Opens Explore with filters applied

### Acceptance Criteria
- All core screens have both scheme + HTTPS deep links
- Unrecognized paths fail gracefully (Explore root)
- Auth-gated links always return user to correct target after login
- Links are shareable, SEO-friendly, and QR-compatible

## Step 20 — Analytics Taxonomy (screen + key tap events)

### Screen Views
Each screen logs a screen_view event with:
- screen_id (from Step 13 conventions)
- timestamp
- auth_status (guest, logged_in, pro)

**Examples:**
- screen_view → { screen_id: ""explore_map"", auth_status: ""guest"" }
- screen_view → { screen_id: ""sell_create"", auth_status: ""logged_in"" }

### Key Tap Events
Log whenever users take meaningful actions:

- Explore
  - filter_applied (filters, count_results)
  - listing_tap (listing_id, position_in_list)
  - map_pan / map_zoom
- Listing Detail
  - save_listing (listing_id, success/failure)
  - share_listing (listing_id, channel)
  - contact_agent (listing_id, success/failure)
- Activity
  - saved_listing_open (listing_id)
  - saved_search_open (search_id)
- Sell
  - create_listing_start
  - create_listing_submit (draft_id, success/failure)
- Pro
  - upgrade_attempt (source_screen, success/failure)
  - lead_open (lead_id)
- Me
  - profile_edit (field)
  - sign_in / sign_up
  - sign_out

### Global Events
- app_open (source: push, deeplink, direct)
- error_event (code, message, screen_id)
- network_retry (endpoint, success/failure)

### Data Hygiene
- All events use snake_case keys
- All IDs anonymized (no PII)
- Events stored with UTC timestamp
- Required params: screen_id, auth_status

### Acceptance Criteria
- Every MVP screen has at least one analytics event
- Core flows (browse → save → contact) measurable
- Errors and retries tracked
- Event schema consistent (snake_case, no PII)
- Analytics taxonomy signed off by product + engineering

---

# ✅ Phase 2 Definition of Done
- All steps (11–27) are documented here with no TBDs.  
- Screens, flows, filters, deep links, and analytics are unambiguous.  
- Final version committed & pushed to GitHub.  





















