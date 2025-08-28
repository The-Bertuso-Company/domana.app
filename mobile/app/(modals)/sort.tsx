// app/(modals)/sort.tsx
import { Stack, router } from "expo-router";
import { View, Text, Pressable } from "react-native";

const OPTIONS = ["Relevance", "Newest", "Price: Low to High", "Price: High to Low"];

export default function SortModal() {
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: "Sort", headerShown: true }} />
      <View className="p-4">
        <Text className="text-base font-semibold mb-12">Choose how listings are ordered</Text>
        <View className="gap-3">
          {OPTIONS.map((label) => (
            <Pressable
              key={label}
              onPress={() => router.back()}
              className="rounded-2xl border border-neutral-200 px-4 py-3"
            >
              <Text className="font-medium">{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
