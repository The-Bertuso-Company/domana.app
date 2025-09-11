import { log } from "./client";
import { EVENTS } from "./taxonomy";

export const trackAppStarted = () => log(EVENTS.AppStarted);
export const trackScreenViewed = (p: { pathname: string; params?: Record<string, any> }) =>
  log(EVENTS.ScreenViewed, p);

// Stubs ready for later wiring:
// export const trackSearchPerformed = (p: { query: string; hits: number }) => log(EVENTS.SearchPerformed, p);
// export const trackListingViewed = (p: { id: string }) => log(EVENTS.ListingViewed, p);
// export const trackFavoriteToggled = (p: { id: string; on: boolean }) => log(EVENTS.FavoriteToggled, p);
