import { View, Text, StyleSheet } from "react-native";

export default function SortModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sort</Text>
      <Text style={styles.caption}>Coming soon: relevance, newest, price, etc.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 8 },
  title: { fontSize: 22, fontWeight: "700" },
  caption: { color: "#666" },
});
