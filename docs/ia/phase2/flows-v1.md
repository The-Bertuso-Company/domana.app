# Phase 2 — Information Architecture
Step 13 — Canonical User Flows (v1)
Generated: 2025-09-01 18:12

Route tree (high level):
/(tabs): explore, activity, sell, pro, me
/listing/[id]: detail

Flows:
A) Search  → Explore → Filters (modal) → Sort (modal) → Results (map/list) → Listing Detail
B) View    → Listing Detail → Media sheet → Facts/Map/Similar → Back to Explore (state preserved)
C) Contact → Listing Detail → Contact sheet (Call/SMS/WhatsApp/Email) → Success toast
D) Save    → Card/Detail Save toggle → Toast → Activity/Me badge → Local cache + online sync

Telemetry: search.apply_filters, search.apply_sort, listing.open, gallery.open, contact.submit, save.toggle

Acceptance to close Step 13:
- Flows above are source-controlled in this repo
- Surfaces referenced exist (tabs, modals, sheets) or are planned
- Event names listed for future wiring
