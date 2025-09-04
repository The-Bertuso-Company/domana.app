import { View, Pressable, Text } from "react-native";
import { Link } from "expo-router";

export function SavedHeaderControls({
  mode, onSort, onFilter, onSelect, onNew,
}: {
  mode: "homes" | "searches";
  onSort?: () => void;
  onFilter?: () => void;
  onSelect?: () => void;
  onNew?: () => void;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Link href="/saved/homes" asChild>
        <Pressable style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: mode==="homes" ? 2 : 1 }}>
          <Text style={{ fontWeight: mode==="homes" ? "700" : "500" }}>Homes</Text>
        </Pressable>
      </Link>
      <Link href="/saved/searches" asChild>
        <Pressable style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: mode==="searches" ? 2 : 1 }}>
          <Text style={{ fontWeight: mode==="searches" ? "700" : "500" }}>Searches</Text>
        </Pressable>
      </Link>

      {mode === "homes" && (
        <View style={{ flexDirection: "row", gap: 8, marginLeft: 8 }}>
          <Pressable onPress={onSort}><Text>Sort</Text></Pressable>
          <Pressable onPress={onFilter}><Text>Filter</Text></Pressable>
          <Pressable onPress={onSelect}><Text>Select</Text></Pressable>
        </View>
      )}
      {mode === "searches" && (
        <View style={{ flexDirection: "row", gap: 8, marginLeft: 8 }}>
          <Pressable onPress={onNew}><Text>New</Text></Pressable>
        </View>
      )}
    </View>
  );
}
