# Phase 2 — Information Architecture
Step 14 — Empty & Error States (v1)
Generated: 2025-09-01 19:14

## Global patterns
- **Offline:** show offline banner; actions queue locally; retry button.
- **Auth expired:** show re-auth modal; preserve in-progress action.
- **Maintenance/Rate limit:** toast + non-blocking banner; auto-retry backoff.
- **Generic error:** friendly message + primary CTA (**Retry**) + secondary (**Report**).

---

## Explore (map + list)
**Empty**
- [ ] Fresh install, no search yet → onboarding tip card.
- [ ] Filters too restrictive (0 results) → reset filters CTA.
- [ ] Out-of-coverage area → change region CTA.

**Error**
- [ ] Location permission denied → enable location sheet.
- [ ] Network offline → cached last results (if any) + retry.
- [ ] Server error / 5xx → retry + contact support.
- [ ] Map tiles failed → fallback solid map + retry.

---

## Listing Detail (/listing/[id])
**Empty**
- [ ] No similar listings → hide section, show discover CTA.

**Error**
- [ ] Listing removed/unavailable → back to Explore + toast.
- [ ] Media load failure → placeholder + retry.
- [ ] Contact methods unavailable → disable buttons with helper text.

---

## Activity / Saved
**Empty**
- [ ] No saved homes yet → show “save first” explainer + browse CTA.
- [ ] No recent activity → hint to enable notifications.

**Error**
- [ ] Sync error restoring saved list → local cache view + retry.

---

## Sell
**Empty**
- [ ] No drafts yet → “Create a listing” CTA.

**Error**
- [ ] Upload failed (images/docs) → retry with progress.
- [ ] Verification pending/failed → status banner + support CTA.

---

## Pro
**Empty**
- [ ] Not onboarded → start KYC/organization flow.

**Error**
- [ ] Subscription inactive → paywall sheet.
- [ ] Permission error → request elevated access.

---

## Surface-specific
**Contact sheet**
- [ ] SMS/call/email failure → show clipboard copy fallback of contact info.

**Save toggle**
- [ ] Local storage full/offline → optimistic UI; queue for sync; warn if never synced.

---

## Copy & components (reuse)
- **Banner:** title, short body, primary CTA, optional secondary.
- **Empty placeholder:** icon, 1–2 lines, primary CTA.
- **Toast:** success/error/info variants.
- **Retry button pattern:** onRetry() with exponential backoff.

## Acceptance criteria to close Step 14
- Documented empty & error states for every MVP surface above.
- Each state specifies **what the user sees** and **what they can do** (CTA).
- Reusable components (banner/placeholder/toast/retry) identified.

**Status:** ✅ Documented — Step 14 (v1)
