import { View, Text } from "react-native";
import type { SavedSearch } from "../../features/saved/types";

export function SavedSearchRow({ search }: { search: SavedSearch }) {
  return (
    <View style={{ paddingVertical: 10, borderBottomWidth: 1 }}>
      <Text style={{ fontWeight: "600" }}>{search.name}</Text>
      <Text>Saved: {new Date(search.createdAt).toLocaleDateString()}</Text>
      {typeof search.resultsCount === "number" && <Text>Last results: {search.resultsCount}</Text>}
    </View>
  );
}
