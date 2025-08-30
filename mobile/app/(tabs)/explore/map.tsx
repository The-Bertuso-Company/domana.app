// app/(tabs)/search/map.tsx
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";

type Pin = { id: string; title: string; x: number; y: number }; // x/y are % positions

// Change to [] to test the empty state
const PINS: Pin[] = [
  { id: "ph-1001", title: "2BR in BGC", x: 32, y: 38 },
  { id: "ph-1002", title: "House in Cebu", x: 68, y: 61 },
];

function ToggleRow({ active }: { active: "list" | "map" }) {
  const base = "flex-1 py-3 rounded-2xl items-center";
  return (
    <View className="flex-row gap-2 px-4 pt-2">
      <Pressable
        onPress={() => router.replace("/search/list")}
        className={`${base} ${active === "list" ? "bg-black" : "bg-neutral-200"}`}
      >
        <Text className={`${active === "list" ? "text-white" : "text-black"} font-semibold`}>
          List
        </Text>
      </Pressable>
      <Pressable
        onPress={() => router.replace("/search/map")}
        className={`${base} ${active === "map" ? "bg-black" : "bg-neutral-200"}`}
      >
        <Text className={`${active === "map" ? "text-white" : "text-black"} font-semibold`}>
          Map
        </Text>
      </Pressable>
    </View>
  );
}

function HeaderActions() {
  return (
    <View className="flex-row gap-3 px-4 pt-3 pb-2">
      <Pressable
        onPress={() => router.push("/(modals)/filters")}
        className="px-4 py-3 rounded-2xl bg-neutral-200"
      >
        <Text className="font-semibold">Filters</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/(modals)/sort")}
        className="px-4 py-3 rounded-2xl bg-neutral-200"
      >
        <Text className="font-semibold">Sort</Text>
      </Pressable>
    </View>
  );
}

export default function MapScreen() {
  if (!PINS.length) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <EmptyState
          title="Move the map to find homes"
          description="Pan or zoom to search new areas. You can also adjust filters."
          ctaLabel="Open filters"
          onPress={() => router.push("/(modals)/filters")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <ToggleRow active="map" />
      <HeaderActions />

      {/* Map placeholder with absolute-positioned pins */}
      <View
        style={{ position: "relative" }}
        className="flex-1 m-4 rounded-2xl bg-neutral-200 overflow-hidden"
      >
        {PINS.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => router.push(`/property/${p.id}`)}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: [{ translateX: -10 }, { translateY: -10 }],
            }}
          >
            <View className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white" />
          </Pressable>
        ))}
        <View className="absolute bottom-2 left-2 right-2 items-center">
          <Text className="text-neutral-700 bg-white/80 px-3 py-1 rounded-full">
            Tap a pin to open details
          </Text>
        </View>
      </View>

      {/* Footer count */}
      <View className="p-4 border-t border-neutral-200">
        <Text className="text-neutral-600">{PINS.length} results in view</Text>
      </View>
    </SafeAreaView>
  );
}
