import { Modal, View, Text, Pressable, Alert } from "react-native";

export function MoreMenu({
  visible, onClose, onRun, onRename, onEditFilters, onToggleNotify, notifyOn, onArchive, archived, onDelete,
}: {
  visible: boolean;
  onClose: () => void;
  onRun: () => void;
  onRename: () => void;
  onEditFilters: () => void;
  onToggleNotify: () => void;
  notifyOn: boolean;
  onArchive: () => void;
  archived: boolean;
  onDelete: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "#0006", justifyContent: "center", padding: 24 }} onPress={onClose}>
        <View style={{ backgroundColor: "white", borderRadius: 16, padding: 12 }}>
          <Pressable onPress={() => { onRun(); onClose(); }}>
            <View style={{ paddingVertical: 10 }}><Text>Run now</Text></View>
          </Pressable>
          <Pressable onPress={() => { onRename(); onClose(); }}>
            <View style={{ paddingVertical: 10 }}><Text>Rename</Text></View>
          </Pressable>
          <Pressable onPress={() => { onEditFilters(); onClose(); }}>
            <View style={{ paddingVertical: 10 }}><Text>Edit filters</Text></View>
          </Pressable>
          <Pressable onPress={() => { onToggleNotify(); onClose(); }}>
            <View style={{ paddingVertical: 10 }}><Text>{notifyOn ? "Turn notifications off" : "Turn notifications on"}</Text></View>
          </Pressable>
          <Pressable onPress={() => { onArchive(); onClose(); }}>
            <View style={{ paddingVertical: 10 }}><Text>{archived ? "Unarchive" : "Archive"}</Text></View>
          </Pressable>
          <Pressable onPress={() => {
            Alert.alert("Delete saved search?", "This cannot be undone.", [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive", onPress: () => { onDelete(); onClose(); } }
            ]);
          }}>
            <View style={{ paddingVertical: 10 }}><Text style={{ color: "#b00020" }}>Delete</Text></View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
