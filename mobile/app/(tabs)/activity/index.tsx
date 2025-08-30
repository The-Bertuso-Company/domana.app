/* app/(tabs)/activity/index.tsx */
import * as React from "react";
import { View, FlatList } from "react-native";
import Screen from "@/src/components/Screen";
import EmptyState from "@/src/components/EmptyState";
import { Chip, Divider, Typography } from "@/src/components/ds";
import { useFavs } from "@/src/state/favs";
import { listings } from "@/src/data/mock";
import ListingCard from "@/src/components/listing/ListingCard";

type Tab = "saved" | "updates" | "messages";

export default function Activity() {
  const [tab, setTab] = React.useState<Tab>("saved");
  const favs = useFavs();
  const saved = listings.filter(l => favs.ids[l.id]);

  return (
    <Screen scroll={false} contentContainerStyle={{ paddingBottom: 24 }}>
      <Typography.H1>Activity</Typography.H1>
      <Divider />
      <View style={{ flexDirection:"row", gap:8, flexWrap:"wrap" }}>
        <Chip label="Saved"   selected={tab==="saved"}   onPress={() => setTab("saved")} />
        <Chip label="Updates" selected={tab==="updates"} onPress={() => setTab("updates")} />
        <Chip label="Messages" selected={tab==="messages"} onPress={() => setTab("messages")} />
      </View>
      <Divider />

      {tab === "saved" && (
        saved.length === 0 ? (
          <EmptyState icon="heart-outline" title="No saved homes" message="Tap the heart on any listing to save it." />
        ) : (
          <FlatList
            data={saved}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            renderItem={({ item }) => <ListingCard listing={item} />}
            contentContainerStyle={{ gap: 16, paddingBottom: 16 }}
          />
        )
      )}

      {tab === "updates" && (
        <EmptyState
          icon="notifications-outline"
          title="You’re all caught up"
          message="Price drops, new matches, and tour reminders will appear here."
        />
      )}

      {tab === "messages" && (
        <EmptyState
          icon="chatbubbles-outline"
          title="No messages yet"
          message="When you contact sellers or agents, conversations show here."
        />
      )}
    </Screen>
  );
}
