import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  // Hide the native splash as soon as the app JS is ready.
  useEffect(() => {
    (async () => {
      try {
        await SplashScreen.hideAsync();
      } catch {}
    })();
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Main tab navigator */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Modal routes (present like iOS modals) */}
        <Stack.Screen
          name="(modals)"
          options={{ presentation: "modal", headerShown: true }}
        />

        {/* Property detail stack with standard headers */}
        <Stack.Screen
          name="property"
          options={{ headerShown: true, title: "Property" }}
        />

        {/* Optional auth flow (kept out of the way for now) */}
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: true, title: "" }}
        />

        {/* Standalone screens */}
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: true, title: "Oops!" }} />
      </Stack>
    </>
  );
}
