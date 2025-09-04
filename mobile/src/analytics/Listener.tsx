import { useEffect, useRef } from "react";
import { usePathname } from "expo-router";
import { trackAppStarted, trackScreenViewed } from "./track";

export function AnalyticsListener() {
  const pathname = usePathname();
  const didStart = useRef(false);
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!didStart.current) {
      trackAppStarted();
      didStart.current = true;
    }
  }, []);

  useEffect(() => {
    if (pathname && last.current !== pathname) {
      trackScreenViewed({ pathname });
      last.current = pathname;
    }
  }, [pathname]);

  return null;
}
