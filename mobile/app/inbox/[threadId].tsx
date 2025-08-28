// app/inbox/[threadId].tsx
import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, TextInput, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppStore from "@/store/useAppStore";

export default function ThreadScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const thread = useAppStore((s) => s.threads.find((t) => t.threadId === threadId));
  const addMessage = useAppStore((s) => s.addMessage);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <Stack.Screen options={{ title: "Chat", headerShown: true }} />

        {!thread ? (
          <View className="flex-1 items-center justify-center p-16">
            <Text className="text-neutral-600">Thread not found.</Text>
          </View>
        ) : (
          <>
            <View className="px-4 pt-2 pb-3 border-b border-neutral-200">
              <Text className="text-sm text-neutral-500">Thread: {thread.threadId}</Text>
              {thread.propertyId ? <Text className="text-sm">Regarding property: {thread.propertyId}</Text> : null}
            </View>

            <FlatList
              data={thread.messages}
              keyExtractor={(m) => m.id}
              renderItem={({ item }) => (
                <View
                  className={`max-w-[70%] px-4 py-2 mb-2 rounded-2xl ${
                    item.from === "me" ? "self-end bg-blue-500" : "self-start bg-neutral-200"
                  }`}
                >
                  <Text className={item.from === "me" ? "text-white" : ""}>{item.text}</Text>
                </View>
              )}
              contentContainerStyle={{ padding: 16 }}
            />

            <View className="flex-row items-center border-t border-neutral-200 p-2">
              <TextInput
                placeholder="Type a message..."
                className="flex-1 bg-neutral-100 rounded-full px-4 py-2 mr-2"
                onSubmitEditing={(e) => {
                  const text = e.nativeEvent.text?.trim();
                  if (text) addMessage(thread.threadId, text, "me");
                  // @ts-ignore clear value
                  e.currentTarget.clear?.();
                }}
              />
              <Pressable
                className="bg-blue-500 px-4 py-2 rounded-full"
                onPress={() => addMessage(thread.threadId, "👍", "me")}
              >
                <Text className="text-white font-semibold">Send</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
