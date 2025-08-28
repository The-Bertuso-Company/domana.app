// app/property/[id].tsx
import { Stack, useLocalSearchParams, router } from "expo-router";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppStore from "@/store/useAppStore";
import { getListingById } from "@/data/listings";

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isSaved = useAppStore((s) => s.isSaved(id));
  const toggleSaved = useAppStore((s) => s.toggleSaved);
  const openThreadForProperty = useAppStore((s) => s.openThreadForProperty);

  const listing = id ? getListingById(id) : null;

  const onContact = () => {
    const threadId = openThreadForProperty(id);
    router.push({ pathname: "/inbox/[threadId]", params: { threadId, propertyId: id } });
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <View className="flex-1 bg-white">
        <Stack.Screen options={{ title: listing ? listing.title : `Property ${id}`, headerShown: true }} />

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text className="text-2xl font-bold mb-2">{listing?.title ?? `Property ${id}`}</Text>
          <Text className="text-neutral-600 mb-12">Mock address • 3 beds • 2 baths • 120 sqm</Text>

          <View className="h-48 bg-neutral-200 rounded-2xl mb-12 items-center justify-center">
            <Text className="text-neutral-600">Photo gallery (coming soon)</Text>
          </View>

          <View className="gap-3 mb-16">
            <Text className="text-base font-semibold">Overview</Text>
            <Text className="text-neutral-700">Clean placeholder description. Replace with real listing fields later.</Text>
          </View>
        </ScrollView>

        <View className="flex-row gap-3 p-4 border-t border-neutral-200">
          <Pressable onPress={() => toggleSaved(id)} className="flex-1 rounded-2xl bg-neutral-200 py-3 items-center">
            <Text className="font-semibold">{isSaved ? "Saved ✓" : "Save"}</Text>
          </Pressable>
          <Pressable onPress={onContact} className="flex-1 rounded-2xl bg-black py-3 items-center">
            <Text className="font-semibold text-white">Contact seller</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
