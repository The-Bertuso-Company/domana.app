import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useCompare } from "../../hooks/useCompare";
import { useRouter } from "expo-router";
import { track } from "../../lib/analytics";

export function CompareBar() {
  const { list, clear } = useCompare();
  const router = useRouter();
  if (list.length < 2) return null;

  function openCompare() {
    track("open_compare", { count: list.length });
    router.push("/compare");
  }

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <View style={styles.bar}>
        <Text style={styles.txt}>{list.length} selected</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable onPress={clear} style={[styles.btn, styles.ghost]}><Text style={styles.ghostTxt}>Clear</Text></Pressable>
          <Pressable onPress={openCompare} style={[styles.btn, styles.primary]}><Text style={styles.primaryTxt}>Compare</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 0, right: 0, bottom: 12, paddingHorizontal: 16 },
  bar: { backgroundColor: "white", borderRadius: 999, borderWidth: 1, borderColor: "#e5e5e5", paddingHorizontal: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  txt: { fontWeight: "800" },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  ghost: { backgroundColor: "#f5f5f5" },
  ghostTxt: { color: "#111", fontWeight: "800" },
  primary: { backgroundColor: "#0ea5e9" },
  primaryTxt: { color: "white", fontWeight: "900" },
});