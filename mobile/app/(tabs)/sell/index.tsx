// app/(tabs)/sell/index.tsx
import { View, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SellIndex() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <Text className="text-xl font-bold px-4 pt-2 mb-4">Post your property</Text>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          <View className="h-40 rounded-2xl bg-neutral-200 items-center justify-center mb-6">
            <Text className="text-neutral-600">Photo uploader (coming soon)</Text>
          </View>

          <View className="gap-4">
            <View>
              <Text className="font-semibold mb-1">Title</Text>
              <Text className="text-neutral-600">e.g., “2BR Condo in BGC”</Text>
            </View>
            <View>
              <Text className="font-semibold mb-1">Price</Text>
              <Text className="text-neutral-600">₱ —</Text>
            </View>
            <View>
              <Text className="font-semibold mb-1">Details</Text>
              <Text className="text-neutral-600">Beds • Baths • Size</Text>
            </View>
          </View>
        </ScrollView>

        <View className="p-4 border-t border-neutral-200">
          <Pressable
            onPress={() => router.push("/updates/index")}
            className="rounded-2xl bg-black py-3 items-center"
          >
            <Text className="text-white font-semibold">Submit (stub)</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
