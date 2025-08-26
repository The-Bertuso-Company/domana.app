import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function SearchHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Tab (map will go here)</Text>

      <View style={styles.row}>
        <Link href="/(modals)/filters" style={styles.pill}>Open Filters</Link>
        <Link href="/(modals)/sort" style={styles.pill}>Open Sort</Link>
      </View>

      <View style={styles.row}>
        <Link href="/(tabs)/search/list" style={styles.link}>Go to List</Link>
        <Link href="/(tabs)/search/map" style={styles.link}>Go to Map</Link>
      </View>

      <Link href="/property/123" style={[styles.pill, { marginTop: 16 }]}>
        View Sample Property
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16, gap: 12 },
  title: { fontSize: 18, fontWeight: "600", color: "#333" },
  row: { flexDirection: "row", gap: 12 },
  link: { color: "#0a84ff", fontSize: 16, fontWeight: "600" },
  pill: {
    backgroundColor: "#f2f2f7",
    color: "#0a84ff",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    fontWeight: "600",
  },
});
