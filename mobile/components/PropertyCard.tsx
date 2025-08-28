// components/PropertyCard.tsx
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useAppStore from "@/store/useAppStore";

export default function PropertyCard({ item }: { item: { id: string; title: string } }) {
  const isSaved = useAppStore((s) => s.isSaved(item.id));
  const toggleSaved = useAppStore((s) => s.toggleSaved);

  return (
    <Pressable
      onPress={() => router.push(`/property/${item.id}`)}
      className="px-4 py-3 border-b border-neutral-200 flex-row items-center justify-between bg-white"
    >
      <View className="flex-1 pr-3">
        <Text className="text-base font-semibold" numberOfLines={1}>
          {item.title}
        </Text>
        <Text className="text-xs text-neutral-500">Tap to view details</Text>
      </View>

      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          toggleSaved(item.id);
        }}
        hitSlop={10}
        className="p-2"
      >
        <Ionicons
          name={isSaved ? "heart" : "heart-outline"}
          size={22}
          color={isSaved ? "#ef4444" : "#111111"}
        />
      </Pressable>
    </Pressable>
  );
}
