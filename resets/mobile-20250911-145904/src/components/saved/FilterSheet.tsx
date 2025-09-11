import { Modal, View, Text, Pressable, TextInput, ScrollView } from "react-native";
import type { HomesFilters } from "../../features/saved/uiState";

export function FilterSheet({
  visible, onClose, value, onChange, tagOptions,
}: {
  visible: boolean;
  onClose: () => void;
  value: HomesFilters;
  onChange: (f: HomesFilters) => void;
  tagOptions: string[];
}) {
  const update = (patch: Partial<HomesFilters>) => onChange({ ...value, ...patch });
  let priceMinStr = value.priceMin?.toString() ?? "";
  let priceMaxStr = value.priceMax?.toString() ?? "";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "#0006" }}>
        <View style={{ backgroundColor: "white", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: "80%" }}>
          <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 12 }}>Filters</Text>

          <ScrollView>
            <Text style={{ fontWeight: "600", marginBottom: 6 }}>Tags</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {tagOptions.map((t) => {
                const active = value.tags.includes(t);
                return (
                  <Pressable key={t} onPress={() => {
                    const next = active ? value.tags.filter(x => x!==t) : [...value.tags, t];
                    update({ tags: next });
                  }}>
                    <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, backgroundColor: active ? "#eee" : "white" }}>
                      <Text>{t}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 16, alignItems: "center" }}>
              <Text>Match</Text>
              <Pressable onPress={() => update({ tagsMode: "any" })}>
                <Text style={{ fontWeight: value.tagsMode==="any" ? "700" : "400" }}>Any</Text>
              </Pressable>
              <Text>•</Text>
              <Pressable onPress={() => update({ tagsMode: "all" })}>
                <Text style={{ fontWeight: value.tagsMode==="all" ? "700" : "400" }}>All</Text>
              </Pressable>
            </View>

            <View style={{ flexDirection: "row", gap: 16, marginTop: 16 }}>
              <Pressable onPress={() => update({ verifiedOnly: !value.verifiedOnly })}>
                <Text>{value.verifiedOnly ? "☑" : "☐"} Verified only</Text>
              </Pressable>
              <Pressable onPress={() => update({ hasNotes: !value.hasNotes })}>
                <Text>{value.hasNotes ? "☑" : "☐"} Has notes</Text>
              </Pressable>
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 16, alignItems: "center" }}>
              <Text>Price</Text>
              <TextInput
                keyboardType="number-pad"
                placeholder="Min"
                defaultValue={priceMinStr}
                onChangeText={(txt)=> update({ priceMin: txt? Number(txt): undefined })}
                style={{ borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, minWidth: 80 }}
              />
              <Text>to</Text>
              <TextInput
                keyboardType="number-pad"
                placeholder="Max"
                defaultValue={priceMaxStr}
                onChangeText={(txt)=> update({ priceMax: txt? Number(txt): undefined })}
                style={{ borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, minWidth: 80 }}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 16, marginTop: 16 }}>
              <Pressable onPress={() => update({ showArchived: !value.showArchived })}>
                <Text>{value.showArchived ? "☑" : "☐"} Show archived</Text>
              </Pressable>
            </View>
          </ScrollView>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
            <Pressable onPress={() => onChange({ tagsMode: "any", tags: [], verifiedOnly: false, hasNotes: false, showArchived: value.showArchived, priceMin: undefined, priceMax: undefined })}>
              <Text style={{ fontWeight: "600" }}>Clear all</Text>
            </Pressable>
            <Pressable onPress={onClose}>
              <Text style={{ fontWeight: "700" }}>Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
