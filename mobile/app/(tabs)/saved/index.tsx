// app/(tabs)/saved/index.tsx
import { View, Text, Pressable, FlatList } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";
import useAppStore from "@/store/useAppStore";
import { getListingById } from "@/data/listings";

export default function SavedIndex() {
  const savedIds = useAppStore((s) => s.savedIds);
  const data = savedIds
    .map((id) => getListingById(id))
    .filter(Boolean) as { id: string; title: string }[];

  if (!data.length) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <EmptyState
          title="No saved homes yet"
          description="Tap the heart on any property to save it here."
          ctaLabel="Start searching"
          onPress={() => router.push("/search/list")}
        />
      </SafeAreaView>
    );
  }

  function Row({ id, title }: { id: string; title: string }) {
    return (
      <Pressable onPress={() => router.push(`/property/${id}`)} className="p-4 mx-4 mb-3 rounded-2xl bg-neutral-100">
        <Text className="font-semibold">{title}</Text>
        <Text className="text-neutral-600">Tap to view</Text>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <Text className="text-xl font-bold px-4 pt-2 mb-4">Saved</Text>
        <FlatList
          data={data}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <Row {...item} />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>
    </SafeAreaView>
  );
}
