// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null; // Prevent flicker during font load
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#DA291C" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        {/* Tabs are the main entry point */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Explore Map */}
        <Stack.Screen name="explore" options={{ title: "Explore Map" }} />

        {/* Single Map screen */}
        <Stack.Screen name="map" options={{ title: "Map" }} />

        {/* Catch-all for unknown routes */}
        <Stack.Screen name="+not-found" options={{ title: "Not Found" }} />
      </Stack>

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
