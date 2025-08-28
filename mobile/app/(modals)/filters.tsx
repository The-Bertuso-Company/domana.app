// app/(modals)/filters.tsx
import { Stack, router } from "expo-router";
import { View, Text, Pressable, ScrollView } from "react-native";

export default function FiltersModal() {
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: "Filters", headerShown: true }} />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-base font-semibold mb-8">
          Coming soon: price, beds, baths, home type, lot size, keywords, etc.
        </Text>

        <View className="gap-8">
          <View>
            <Text className="font-semibold mb-2">Price</Text>
            <Text className="text-neutral-600">₱ Any — TBD</Text>
          </View>

          <View>
            <Text className="font-semibold mb-2">Beds & Baths</Text>
            <Text className="text-neutral-600">Any — TBD</Text>
          </View>

          <View>
            <Text className="font-semibold mb-2">Home Type</Text>
            <Text className="text-neutral-600">Any — TBD</Text>
          </View>
        </View>
      </ScrollView>

      <View className="p-4 flex-row gap-8">
        <Pressable
          onPress={() => router.back()}
          className="flex-1 rounded-2xl bg-neutral-200 py-3 items-center"
        >
          <Text className="font-semibold">Cancel</Text>
        </Pressable>
        <Pressable
          onPress={() => router.back()}
          className="flex-1 rounded-2xl bg-black py-3 items-center"
        >
          <Text className="font-semibold text-white">Apply</Text>
        </Pressable>
      </View>
    </View>
  );
}
