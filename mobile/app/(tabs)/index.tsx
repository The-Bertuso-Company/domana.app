import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import Constants from "expo-constants";

const token = Constants.expoConfig?.extra?.mapboxAccessToken;
MapboxGL.setAccessToken(token);

export default function App() {
  useEffect(() => {
    MapboxGL.requestAndroidLocationPermissions();
  }, []);

  return (
    <View style={styles.page}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera zoomLevel={12} centerCoordinate={[121.0583, 14.6042]} />
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  map: { flex: 1 },
});
