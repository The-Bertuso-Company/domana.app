# Domana Mobile — Information Architecture Charter & Scope

## 1. Problem Statement & Goals
Domana’s mission is to **build trust in Philippine real estate through verified listings, transparent flows, and world-class user experience**. Without a well-defined Information Architecture (IA), we risk:
- Duplicate flows, inconsistent navigation, and broken user journeys.  
- Confusing deep links and analytics gaps that block scale.  
- Costly rework across frontend, backend, and design.

**Goals for Phase 2 (IA):**
- Create a **single source of truth** for how users move through Domana Mobile.  
- Standardize routes, flows, filters, and deep links for consistency.  
- Ensure every MVP screen has defined empty/error states and analytics coverage.  
- Lay the groundwork for scalable, testable, and extensible app architecture.

## 2. Scope In (What IA Covers)
Phase 2 Information Architecture **includes**:
1. App navigation model (Explore, Activity, Sell, Pro, Me tabs).  
2. Route conventions (expo-router foldering, naming, slugs).  
3. Path schema (tabs, modals, nested routes, error boundaries).  
4. Cross-tab flows (e.g., Explore → Detail → Contact/Save).  
5. Search filter schema (canonical fields for Explore + serialization).  
6. Filter serialization contract (URL, local, API payload consistency).  
7. Deep linking map (scheme + HTTPS patterns).  
8. Empty/error state catalog (copy, CTAs, illustrations).  
9. Analytics taxonomy (screen views, key interactions).  

## 3. Scope Out (Not Covered in Phase 2)
IA **does not cover**:
- Non-MVP features (mortgage calculators, school overlays, chat v2).  
- Backend API design (handled in Phases 5–6).  
- Advanced localization & accessibility (Phase 3+).  
- Visual tokens or theming (handled in Design System workstream).  

## 4. Constraints
- Must align with Stage 1 product principles (simplicity, trust, verification-first).  
- Device support: Android 9+ / iOS 14+.  
- Offline support limited to retry and error states.  
- Auth gating:  
  - Required for saving listings, contacting agents, creating listings, Pro features.  
  - Not required for browsing Explore, viewing detail pages, or basic search.  

## 5. Definition of Done (DoD)
Phase 2 is complete when:
1. All 10 IA deliverables (Steps 11–27) exist with no TBDs.  
2. Every MVP screen appears in the path schema.  
3. No contradictions across navigation, routes, filters, deep links, or analytics.  
4. Empty/error states catalog covers all screens.  
5. Analytics taxonomy covers all core flows (browse → engage → convert).  
6. Deliverables live in a single source of truth (GitHub repo → /docs/ia/phase2.md).  
7. Final sign-off from product (you), frontend lead, backend lead, and design lead.  

## 6. Owners & Review Process
- **Primary Owner:** Dinj Valric Bertuso (Product/Founder).  
- **Reviewers:**  
  - Frontend Lead → navigation/Expo-router compliance.  
  - Backend Lead → filter schema, serialization, deep link compatibility.  
  - Design Lead → empty/error state patterns and consistency with Figma.  

**Review cadence:**  
- Async review after each major step (12–27).  
- One final DoD review before marking Phase 2 complete.  
