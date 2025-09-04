import { Modal, View, Text, Pressable } from "react-native";

export function ActionsMenu({
  visible, onClose, onRemove, onTag, onCompare, onArchive, selectedCount,
}: {
  visible: boolean;
  onClose: () => void;
  onRemove: () => void;
  onTag: () => void;
  onCompare: () => void;
  onArchive: () => void;
  selectedCount: number;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "#0006", justifyContent: "center", padding: 24 }} onPress={onClose}>
        <View style={{ backgroundColor: "white", borderRadius: 16, padding: 12 }}>
          <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 8 }}>Actions ({selectedCount} selected)</Text>
          <Pressable onPress={() => { onCompare(); onClose(); }}>
            <View style={{ paddingVertical: 10 }}><Text>Compare</Text></View>
          </Pressable>
          <Pressable onPress={() => { onTag(); onClose(); }}>
            <View style={{ paddingVertical: 10 }}><Text>Tag…</Text></View>
          </Pressable>
          <Pressable onPress={() => { onArchive(); onClose(); }}>
            <View style={{ paddingVertical: 10 }}><Text>Archive</Text></View>
          </Pressable>
          <Pressable onPress={() => { onRemove(); onClose(); }}>
            <View style={{ paddingVertical: 10 }}><Text style={{ color: "#b00020" }}>Remove</Text></View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
