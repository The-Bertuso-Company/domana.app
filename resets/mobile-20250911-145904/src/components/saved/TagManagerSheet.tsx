import { Modal, View, Text, Pressable, TextInput, ScrollView } from "react-native";

export function TagManagerSheet({
  visible, onClose, selectedTags, onAdd, onRemove, allTags,
}: {
  visible: boolean;
  onClose: () => void;
  selectedTags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  allTags: string[];
}) {
  let newTag = "";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "#0006" }}>
        <View style={{ backgroundColor: "white", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: "70%" }}>
          <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 12 }}>Tags</Text>

          <Text style={{ marginBottom: 6 }}>Selected</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {selectedTags.map((t) => (
              <Pressable key={t} onPress={() => onRemove(t)}>
                <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, backgroundColor: "#eef" }}>
                  <Text>{t} ×</Text>
                </View>
              </Pressable>
            ))}
            {!selectedTags.length && <Text style={{ color: "#666" }}>No tags yet</Text>}
          </View>

          <Text style={{ marginBottom: 6 }}>Suggestions</Text>
          <ScrollView style={{ maxHeight: 160 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {allTags.map((t) => (
                <Pressable key={t} onPress={() => onAdd(t)}>
                  <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 }}>
                    <Text>{t}</Text>
                  </View>
                </Pressable>
              ))}
              {!allTags.length && <Text style={{ color: "#666" }}>No existing tags</Text>}
            </View>
          </ScrollView>

          <View style={{ flexDirection: "row", gap: 8, marginTop: 12, alignItems: "center" }}>
            <TextInput placeholder="Add a tag" onChangeText={(t)=>{ newTag = t; }} style={{ flex: 1, borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6 }} />
            <Pressable onPress={() => { if (newTag && newTag.trim()) { onAdd(newTag.trim()); } }}>
              <Text style={{ fontWeight: "700" }}>Add</Text>
            </Pressable>
          </View>

          <View style={{ alignItems: "flex-end", marginTop: 14 }}>
            <Pressable onPress={onClose}>
              <Text style={{ fontWeight: "700" }}>Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
