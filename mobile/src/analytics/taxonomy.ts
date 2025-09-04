export const EVENTS = {
  AppStarted: "app_started",
  ScreenViewed: "screen_viewed",
  // ready for later:
  SearchPerformed: "search_performed",
  ListingViewed: "listing_viewed",
  FavoriteToggled: "favorite_toggled",
  Error: "error",
} as const;

export type EventName = typeof EVENTS[keyof typeof EVENTS];

export type BaseProps = {
  app_version?: string;
  platform?: "ios" | "android" | "web";
  locale?: string;
};
