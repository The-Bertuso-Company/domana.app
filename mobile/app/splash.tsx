import { View, Text, StyleSheet, Image } from "react-native";

export default function SplashRoute() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/splash-icon.png")}
        style={{ width: 96, height: 96, marginBottom: 16 }}
        resizeMode="contain"
      />
      <Text style={styles.text}>The trusted app for every home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 18, fontWeight: "600", color: "#333" },
});
