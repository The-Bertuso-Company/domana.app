import { View, Text, StyleSheet } from "react-native";

export default function FiltersModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filters</Text>
      <Text style={styles.caption}>Coming soon: price, beds, baths, etc.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 8 },
  title: { fontSize: 22, fontWeight: "700" },
  caption: { color: "#666" },
});
