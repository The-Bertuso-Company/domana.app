import { View, Text, StyleSheet } from "react-native";

export default function SearchMap() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map Placeholder (DomanaMap will live here)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 18, fontWeight: "600", textAlign: "center", paddingHorizontal: 24 },
});
