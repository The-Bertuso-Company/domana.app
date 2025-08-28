// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      try {
        await SplashScreen.hideAsync();
      } catch {
        // ignore
      }
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Main tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Modals group; each modal sets its own header */}
        <Stack.Screen
          name="(modals)"
          options={{ presentation: "modal", headerShown: false }}
        />

        {/* Property stack */}
        <Stack.Screen
          name="property"
          options={{ headerShown: true, title: "Property" }}
        />

        {/* Auth (stub) */}
        <Stack.Screen name="(auth)" options={{ headerShown: true, title: "" }} />

        {/* Standalone */}
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: true, title: "Oops!" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
