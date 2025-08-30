import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../src/sentry";
import { QueryProvider } from "../src/providers/QueryProvider";
import { ThemeProvider } from "../src/providers/ThemeProvider";
import { I18nProvider } from "../src/i18n/I18nProvider";
import { useEffect } from "react";
import { initAnalytics } from "../src/analytics";

export default function RootLayout() {
  useEffect(() => { initAnalytics(); }, []);
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <ThemeProvider>
          <QueryProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </QueryProvider>
        </ThemeProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
