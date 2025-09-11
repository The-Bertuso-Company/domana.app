import { View, Text, Pressable } from "react-native";
import type { SavedHome } from "../../features/saved/types";

export function SavedHomeCard({
  home, onPress, onLongPress, selected,
}: {
  home: SavedHome;
  onPress?: () => void;
  onLongPress?: () => void;
  selected?: boolean;
}) {
  const s = home.snapshot;

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress}>
      <View style={{
        padding: 12, borderRadius: 12, borderWidth: selected ? 2 : 1,
        borderColor: selected ? "#3b82f6" : "#ccc", marginBottom: 8
      }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>{s?.price ? `$${s.price.toLocaleString()}` : "Saved home"}</Text>
          {!!s?.verifiedTier && <Text style={{ color: "#0a7" }}>Verified {s.verifiedTier}</Text>}
        </View>
        <Text style={{ color: "#444", marginTop: 2 }}>
          {s?.beds ?? "—"} bd • {s?.baths ?? "—"} ba • {s?.sqft ? `${s.sqft.toLocaleString()} sqft` : "—"}
        </Text>
        {!!s?.addressLine && <Text style={{ color: "#666", marginTop: 2 }}>{s.addressLine}</Text>}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
          {!!home.userNoteCount && <Text>Notes ({home.userNoteCount})</Text>}
          {!!home.tags?.length && <Text>Tags: {home.tags.join(", ")}</Text>}
          {!home.userNoteCount && !(home.tags?.length) && <Text style={{ color: "#999" }}>Saved {new Date(home.createdAt).toLocaleDateString()}</Text>}
        </View>
      </View>
    </Pressable>
  );
}
