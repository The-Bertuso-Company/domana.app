/* app/(tabs)/search/list.tsx */
import * as React from "react";
import { FlatList, View } from "react-native";
import Screen from "@/src/components/Screen";
import { Divider, Typography } from "@/src/components/ds";
import ListingCard from "@/src/components/listing/ListingCard";
import { listings } from "@/src/data/mock";

export default function SearchList() {
  return (
    <Screen scroll={false} contentContainerStyle={{ paddingBottom: 24 }}>
      <Typography.H1>Listings</Typography.H1>
      <Divider />
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({ item }) => <ListingCard listing={item} />}
        contentContainerStyle={{ gap: 16, paddingBottom: 16 }}
      />
    </Screen>
  );
}
