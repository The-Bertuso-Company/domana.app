import { View, Text, StyleSheet, Platform } from "react-native";
import Constants from "expo-constants";

// Try to load Mapbox only when native module exists (avoids Expo Go crash)
let MapboxGL: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  MapboxGL = require("@rnmapbox/maps");
  if (MapboxGL?.setAccessToken) {
    MapboxGL.setAccessToken(Constants.expoConfig?.extra?.MAPBOX_TOKEN ?? "");
  }
} catch (e) {
  MapboxGL = null;
}

export default function Explore() {
  const missingNative = !MapboxGL || Platform.OS === "web";
  if (missingNative) {
    return (
      <View style={[styles.page, styles.center]}>
        <Text style={styles.msg}>
          Map requires a Development Build (not Expo Go).
          {"\n"}Next step: run a dev build and reopen the app.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera
            zoomLevel={12}
            centerCoordinate={[121.056269, 14.576381]} // default center
          />
        </MapboxGL.MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  container: { flex: 1 },
  map: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center", padding: 16 },
  msg: { textAlign: "center" }
});
