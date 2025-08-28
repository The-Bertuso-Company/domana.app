// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import TabBarIcon from "@/components/TabBarIcon";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#111111",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 12, marginTop: -2 },
      }}
    >
      <Tabs.Screen
        name="search/index"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "search" : "search-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="updates/index"
        options={{
          title: "Updates",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "notifications" : "notifications-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved/index"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "heart" : "heart-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sell/index"
        options={{
          title: "Sell",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "add-circle" : "add-circle-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox/index"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              color={color}
            />
          ),
        }}
      />

      {/* Hide child routes so they never render as tabs */}
      <Tabs.Screen name="search/list" options={{ href: null }} />
      <Tabs.Screen name="search/map" options={{ href: null }} />
      {/* Do NOT declare inbox/[threadId] here; it auto-registers from /app/inbox */}
    </Tabs>
  );
}
