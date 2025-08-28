// app/(tabs)/updates/index.tsx
import { View, Text, Pressable, FlatList } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";

type Notif =
  | { id: string; type: "priceDrop"; title: string; subtitle?: string; propertyId: string }
  | { id: string; type: "message";   title: string; subtitle?: string; threadId: string; propertyId?: string };

const NOTIFS: Notif[] = [
  { id: "n1", type: "priceDrop", title: "Price drop: 2BR in BGC", subtitle: "₱12.3M → ₱11.9M", propertyId: "ph-1001" },
  { id: "n2", type: "message",   title: "New message: House in Cebu", subtitle: "“Is this still available?”", threadId: "thread-ph-1002", propertyId: "ph-1002" },
];

function Row({ item }: { item: Notif }) {
  const onPress = () => {
    if (item.type === "priceDrop") {
      router.push(`/property/${item.propertyId}`);
    } else {
      router.push({ pathname: "/inbox/[threadId]", params: { threadId: item.threadId, propertyId: item.propertyId } });
    }
  };

  return (
    <Pressable onPress={onPress} className="mx-4 mb-3 rounded-2xl border border-neutral-200 px-4 py-3 bg-white">
      <Text className="font-semibold mb-1" numberOfLines={1}>{item.title}</Text>
      {item.subtitle ? <Text className="text-neutral-600" numberOfLines={1}>{item.subtitle}</Text> : null}
      <View className="mt-3 flex-row">
        <Text className="text-xs text-neutral-500">Tap to open</Text>
      </View>
    </Pressable>
  );
}

export default function UpdatesIndex() {
  if (!NOTIFS.length) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <EmptyState
          title="No updates yet"
          description="You’ll see price drops, new matches, and messages here."
          ctaLabel="Start browsing"
          onPress={() => router.push("/search/list")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <Text className="text-xl font-bold px-4 pt-2 mb-4">Updates</Text>
        <FlatList
          data={NOTIFS}
          keyExtractor={(n) => n.id}
          renderItem={({ item }) => <Row item={item} />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>
    </SafeAreaView>
  );
}
