import { View, Text, StyleSheet } from "react-native";

export default function InboxTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Inbox Tab (map will go here)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 18, fontWeight: "600" },
});
