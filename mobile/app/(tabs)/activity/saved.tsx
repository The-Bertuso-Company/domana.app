import * as React from "react";
import { FlatList, View } from "react-native";
import Screen from "@/src/components/Screen";
import EmptyState from "@/src/components/EmptyState";
import { Typography, Divider } from "@/src/components/ds";
import { useFavs } from "@/src/state/favs";
import { listings } from "@/src/data/mock";
import ListingCard from "@/src/components/listing/ListingCard";

export default function SavedScreen() {
  const favs = useFavs();
  const data = listings.filter(l => favs.ids[l.id]);

  return (
    <Screen scroll={false} contentContainerStyle={{ paddingBottom: 24 }}>
      <Typography.H1>Saved</Typography.H1>
      <Divider />
      {data.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="No saved homes yet"
          message="Tap the heart on any listing to save it here."
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          renderItem={({ item }) => <ListingCard listing={item} />}
          contentContainerStyle={{ gap: 16, paddingBottom: 16 }}
        />
      )}
    </Screen>
  );
}
