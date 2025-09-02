# Phase 2 — Information Architecture
Step 15 — Surface Patterns (Modals, Sheets, Drawers)
Generated: 2025-09-01 19:15

## Purpose
Document when to use each surface so UX is consistent across platforms and easy to implement in Expo Router.

## Definitions
- Modal: Focused, interruptive UI that demands a decision or explicit dismissal. Blocks underlying screen.
- Bottom sheet: Contextual, transient UI that augments the current screen. Non-blocking background but captures focus while open. Snap points allowed.
- Drawer: Left/right slide navigation container. Not used for MVP (discoverability and gesture conflicts with map).

## Selection principles
- Use a MODAL when the user must decide or confirm (filters apply, re-auth, report issue).
- Use a SHEET when the user is previewing, choosing from quick actions, or needs keyboard-friendly space (contact, gallery preview, paywall).
- Avoid DRAWERS in MVP to preserve map gestures and keep IA simple.

## Pattern matrix (MVP)
| Interaction                         | Pattern     | Entry point                          | Dismiss behavior                          | Rationale |
|------------------------------------|-------------|--------------------------------------|--------------------------------------------|----------|
| Filters                            | Modal       | Explore → Filters button             | Apply, Clear, Cancel/backdrop/back         | Requires explicit apply/clear; reversible |
| Sort                               | Modal       | Explore → Sort button                | Apply, Cancel/backdrop/back                | Small, decisive choice set |
| Contact seller/agent               | Bottom sheet| Listing Detail → Contact CTA         | Tap outside, drag down, Done               | Quick actions (Call/SMS/WhatsApp/Email) |
| Gallery preview                    | Bottom sheet| Listing Detail → Media/Gallery       | Drag down, X, back                         | Peek/expand; stays in context |
| Re-auth needed                     | Modal       | Global (token expiry)                | Sign in, Cancel (returns to prior screen)  | Blocking security action |
| Paywall / subscription notice      | Bottom sheet| Pro features gated                   | Subscribe, Later/back/drag                 | Informational with actionable CTA |
| Enable location                    | Bottom sheet| Explore when permission denied        | Open settings, Not now                     | Contextual nudge with quick action |
| Report a problem                   | Modal       | Overflow menu                        | Submit, Cancel                             | Form-like flow needs focus |
| Error details (non-blocking)       | Modal       | From banners/toasts “Learn more”     | Close/backdrop/back                        | Rich explanation without leaving screen |

## Navigation & state rules
- Open on top of current route; do not push a new screen unless full-screen flow.
- Back button/gesture closes the topmost surface first.
- Preserve underlying screen state (map region, scroll) while surface is open.
- If a modal has unsaved changes, show a confirm-before-dismiss dialog.
- Avoid deep-linking into sheets; modals may be deep-linked for auth/paywall only.

## Accessibility
- Focus trap inside surface; set initial focus to primary control.
- Provide accessible labels for close buttons and actions.
- Support screen reader announcements on open/close.
- Ensure keyboard avoidance for sheets (contact form) and respect safe areas.

## Telemetry (names)
- surface.open (name: filters|sort|contact|gallery|reauth|paywall|enable_location|report)
- surface.close (name: ...)
- filters.apply, sort.apply, contact.submit, paywall.subscribe

## Implementation notes (non-binding)
- Expo Router: keep modal routes under pp/(modals)/... for Filters/Sort/Reauth/Paywall; sheets can be component-driven from current screen.
- Centralize sheet and modal primitives under src/components/system/ so visuals match DS tokens.

## Acceptance criteria to close Step 15
- The matrix above is source-controlled and referenced by design and engineering.
- Each MVP interaction is mapped to a chosen surface with defined dismiss rules.
- Back/gesture behavior and accessibility expectations are documented.

Status: Documented (v1)
