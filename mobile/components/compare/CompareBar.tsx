import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useCompare } from "../../hooks/useCompare";
import { useRouter } from "expo-router";

export function CompareBar() {
  const { ids, clear } = useCompare();
  const router = useRouter();
  if ((ids?.length || 0) < 2) return null;

  return (
    <View style={styles.wrap} accessibilityRole="summary" accessibilityLabel={`Compare ${ids.length} homes`}>
      <Text style={styles.txt}>{ids.length} selected</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable onPress={() => router.push("/compare")} style={[styles.btn, styles.primary]}><Text style={styles.primaryTxt}>Compare</Text></Pressable>
        <Pressable onPress={clear} style={[styles.btn, styles.ghost]}><Text style={styles.ghostTxt}>Clear</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 16, right: 16, bottom: 16, backgroundColor: "white", borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  txt: { fontWeight: "800" },
  btn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  primary: { backgroundColor: "#111" },
  primaryTxt: { color: "white", fontWeight: "800" },
  ghost: { backgroundColor: "#f5f5f5" },
  ghostTxt: { color: "#111", fontWeight: "800" },
});