/* app/(tabs)/_layout.tsx */
import * as React from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBarIcon from "@/components/TabBarIcon";
import { ToastProvider } from "@/src/components/Toast";
import SystemBars from "@/src/components/SystemBars";
import { useScheme } from "@/src/hooks/useScheme";
import { c } from "@/src/design/theme";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const scheme = useScheme();
  const colors = c(scheme);
  const bottomPad = Math.max(insets.bottom, 12);

  return (
    <ToastProvider>
      <SystemBars />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: colors.brand.hex,
          tabBarInactiveTintColor: colors.muted?.hex ?? "#9CA3AF",
          tabBarStyle: {
            height: 60 + bottomPad,
            paddingBottom: bottomPad,
            paddingTop: 8,
            borderTopWidth: 0.5,
            borderTopColor: scheme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            backgroundColor: colors.bg.hex,
          },
          tabBarLabelStyle: { fontSize: 12, marginTop: -2 },
        }}
      >
        {/* The 5 real tabs */}
        <Tabs.Screen
          name="explore/index"
          options={{
            title: "Explore",
            tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          }}
        />
        <Tabs.Screen
          name="activity/index"
          options={{
            title: "Activity",
            tabBarIcon: ({ color }) => <TabBarIcon name="notifications-outline" color={color} />,
          }}
        />
        <Tabs.Screen
          name="sell/index"
          options={{
            title: "Sell",
            tabBarIcon: ({ color }) => <TabBarIcon name="add-circle-outline" color={color} />,
          }}
        />
        <Tabs.Screen
          name="pro/index"
          options={{
            title: "Pro",
            tabBarIcon: ({ color }) => <TabBarIcon name="briefcase-outline" color={color} />,
          }}
        />
        <Tabs.Screen
          name="me/index"
          options={{
            title: "Me",
            tabBarIcon: ({ color }) => <TabBarIcon name="person-outline" color={color} />,
          }}
        />

        {/* Hide nested screens so they don't become tabs */}
        <Tabs.Screen name="explore/list" options={{ href: null }} />
        <Tabs.Screen name="explore/map" options={{ href: null }} />
        <Tabs.Screen name="activity/inbox" options={{ href: null }} />
        <Tabs.Screen name="activity/saved" options={{ href: null }} />
        <Tabs.Screen name="activity/updates" options={{ href: null }} />
      </Tabs>
    </ToastProvider>
  );
}
