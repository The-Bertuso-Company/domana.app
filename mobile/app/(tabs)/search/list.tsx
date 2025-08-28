// app/(tabs)/search/list.tsx
import { useEffect, useState } from "react";
import { View, FlatList, Pressable, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import PropertyCard from "@/components/PropertyCard";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { fetchListings } from "@/lib/api";

function ToggleRow({ active }: { active: "list" | "map" }) {
  const base = "flex-1 py-3 rounded-2xl items-center";
  return (
    <View className="flex-row gap-2 px-4 pt-2">
      <Pressable onPress={() => router.replace("/search/list")} className={`${base} ${active === "list" ? "bg-black" : "bg-neutral-200"}`}>
        <Text className={`${active === "list" ? "text-white" : "text-black"} font-semibold`}>List</Text>
      </Pressable>
      <Pressable onPress={() => router.replace("/search/map")} className={`${base} ${active === "map" ? "bg-black" : "bg-neutral-200"}`}>
        <Text className={`${active === "map" ? "text-white" : "text-black"} font-semibold`}>Map</Text>
      </Pressable>
    </View>
  );
}

function HeaderActions() {
  return (
    <View className="flex-row gap-3 px-4 pt-3 pb-2">
      <Pressable onPress={() => router.push("/(modals)/filters")} className="px-4 py-3 rounded-2xl bg-neutral-200">
        <Text className="font-semibold">Filters</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/(modals)/sort")} className="px-4 py-3 rounded-2xl bg-neutral-200">
        <Text className="font-semibold">Sort</Text>
      </Pressable>
    </View>
  );
}

// Flip this to true to simulate an error and see ErrorState
const SHOULD_FAIL = false;

export default function ListScreen() {
  const [data, setData] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchListings({ shouldFail: SHOULD_FAIL, delayMs: 600 });
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <ToggleRow active="list" />
      <HeaderActions />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : error ? (
        <ErrorState title="Couldn’t load listings" message={error} onRetry={load} />
      ) : !data.length ? (
        <EmptyState
          title="No results found"
          description="Try adjusting your filters or moving the map."
          ctaLabel="Open filters"
          onPress={() => router.push("/(modals)/filters")}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <PropertyCard item={item} />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}
