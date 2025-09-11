import React, { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View, FlatList } from "react-native";
import { useNotesForListing } from "../../hooks/useNotes";
import { track } from "../../lib/analytics";

export function NotesButton({ listingId }: { listingId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable onPress={() => { setOpen(true); track("open_notes", { listingId }); }} style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}>
        <Text style={styles.btnTxt}>Notes</Text>
      </Pressable>
      <NotesSheet listingId={listingId} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function NotesSheet({ listingId, open, onClose }: { listingId: string; open: boolean; onClose: () => void }) {
  const { loading, notes, add, update, remove } = useNotesForListing(listingId);
  const [text, setText] = useState("");

  function addNote() {
    if (!text.trim()) {
      Alert.alert("Add some text", "Your note is empty.");
      return;
    }
    add(text.trim());
    setText("");
  }

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Your notes</Text>

          <View style={{ marginBottom: 10 }}>
            <TextInput
              placeholder="Type a quick note…"
              placeholderTextColor="#888"
              value={text}
              onChangeText={setText}
              style={styles.input}
              multiline
              numberOfLines={3}
            />
            <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
              <Pressable onPress={addNote} style={[styles.btnSmall, styles.btnPrimary]}><Text style={styles.btnPrimaryTxt}>Add note</Text></Pressable>
              <Pressable onPress={onClose} style={[styles.btnSmall, styles.btnGhost]}><Text style={styles.btnGhostTxt}>Close</Text></Pressable>
            </View>
          </View>

          <FlatList
            data={notes}
            keyExtractor={(n) => n.id}
            ListEmptyComponent={<Text style={{ color: "#666" }}>{loading ? "Loading…" : "No notes yet."}</Text>}
            renderItem={({ item }) => (
              <View style={styles.note}>
                <Text style={styles.noteTxt}>{item.text}</Text>
                <Text style={styles.noteMeta}>{new Date(item.updatedAt || item.createdAt).toLocaleString()}</Text>
                <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
                  <Pressable onPress={() => remove(item.id)} style={[styles.noteBtn, styles.noteDel]}><Text style={styles.noteDelTxt}>Delete</Text></Pressable>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: "#f5f5f5" },
  btnTxt: { fontWeight: "800", color: "#111" },

  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "white", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: "85%" },
  handle: { alignSelf: "center", width: 40, height: 5, backgroundColor: "#ddd", borderRadius: 999, marginBottom: 8 },
  title: { fontSize: 16, fontWeight: "800", marginBottom: 6 },

  input: { borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 10, padding: 10, minHeight: 70, color: "#111" },

  btnSmall: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  btnPrimary: { backgroundColor: "#0ea5e9" },
  btnPrimaryTxt: { color: "white", fontWeight: "800" },
  btnGhost: { backgroundColor: "#f5f5f5" },
  btnGhostTxt: { color: "#111", fontWeight: "800" },

  note: { borderWidth: 1, borderColor: "#eee", borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: "white" },
  noteTxt: { color: "#111" },
  noteMeta: { color: "#666", fontSize: 12, marginTop: 4 },
  noteBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
  noteDel: { backgroundColor: "#fee2e2" },
  noteDelTxt: { color: "#991b1b", fontWeight: "800" },
});