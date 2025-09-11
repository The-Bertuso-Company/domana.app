import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import type { Listing } from "../../types/listing";
import { useCompare } from "../../hooks/useCompare";

export function CompareToggle({ listing }: { listing: Listing }) {
  const { has, toggle, ids, max } = useCompare();
  const inList = has(listing.id);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={inList ? "Remove from compare" : "Add to compare"}
      onPress={() => toggle(listing.id)}
      style={({ pressed }) => [styles.btn, inList ? styles.on : styles.off, pressed && { opacity: 0.85 }]}
    >
      <Text style={[styles.txt, inList ? styles.txtOn : styles.txtOff]}>
        {inList ? `In compare (${ids.length}/${max})` : `Add to compare (${ids.length}/${max})`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  off: { borderColor: "#e5e5e5", backgroundColor: "white" },
  on: { borderColor: "#111", backgroundColor: "#111" },
  txt: { fontWeight: "800" },
  txtOff: { color: "#111" },
  txtOn: { color: "white" },
});