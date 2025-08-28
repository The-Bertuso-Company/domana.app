// app/(tabs)/inbox/index.tsx
import { View, Text, Pressable, FlatList } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";
import useAppStore from "@/store/useAppStore";

export default function InboxIndex() {
  const threads = useAppStore((s) => s.threads);

  if (!threads.length) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <EmptyState
          title="No messages yet"
          description="Contact a seller from a property to start a conversation."
          ctaLabel="Browse homes"
          onPress={() => router.push("/search/list")}
        />
      </SafeAreaView>
    );
  }

  function Row({ threadId, last }: { threadId: string; last: string }) {
    return (
      <Pressable
        onPress={() => router.push({ pathname: "/inbox/[threadId]", params: { threadId } })}
        className="p-4 mx-4 mb-3 rounded-2xl bg-neutral-100"
      >
        <Text className="font-semibold" numberOfLines={1}>{threadId}</Text>
        <Text className="text-neutral-600" numberOfLines={1}>{last}</Text>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <Text className="text-xl font-bold px-4 pt-2 mb-4">Inbox</Text>
        <FlatList
          data={threads}
          keyExtractor={(t) => t.threadId}
          renderItem={({ item }) => <Row threadId={item.threadId} last={item.last} />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>
    </SafeAreaView>
  );
}
