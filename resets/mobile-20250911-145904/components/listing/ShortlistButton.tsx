import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import type { Listing } from "../../types/listing";
import { useShortlist } from "../../hooks/useShortlist";

export function ShortlistButton({ listing }: { listing: Listing }) {
  const { isSaved, toggle } = useShortlist();
  const saved = isSaved(listing.id);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? "Remove from shortlist" : "Save to shortlist"}
      onPress={() => toggle(listing.id)}
      style={({ pressed }) => [styles.btn, saved ? styles.btnOn : styles.btnOff, pressed && { opacity: 0.85 }]}
    >
      <Text style={[styles.txt, saved ? styles.txtOn : styles.txtOff]}>{saved ? "♥ Saved" : "♡ Save"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  btnOff: { borderColor: "#e5e5e5", backgroundColor: "white" },
  btnOn: { borderColor: "#111", backgroundColor: "#111" },
  txt: { fontWeight: "800" },
  txtOff: { color: "#111" },
  txtOn: { color: "white" },
});