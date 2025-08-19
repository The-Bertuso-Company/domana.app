import React, { useEffect } from "react";
import MapboxGL from "@rnmapbox/maps";
import Constants from "expo-constants";
import { View, Text, StyleSheet } from "react-native";

type MarkerData = {
  id: number;
  longitude: number;
  latitude: number;
  label?: string; // e.g., price
};

// Get token from app.config.js → extra.mapboxAccessToken
const mapboxToken = Constants.expoConfig?.extra?.mapboxAccessToken;
MapboxGL.setAccessToken(mapboxToken);

export default function DomanaMap({ markers = [] as MarkerData[] }) {
  // request location permissions when map loads
  useEffect(() => {
    (async () => {
      await MapboxGL.requestAndroidLocationPermissions();
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} styleURL="mapbox://styles/mapbox/streets-v12">
        {/* Default center on the Philippines */}
        <MapboxGL.Camera
          zoomLevel={5}
          centerCoordinate={[121.774, 12.8797]}
        />

        {/* Render markers */}
        {markers.map((m) => (
          <MapboxGL.PointAnnotation
            key={m.id}
            id={`marker-${m.id}`}
            coordinate={[m.longitude, m.latitude]}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>{m.label ?? "●"}</Text>
            </View>
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  marker: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#DA291C",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  markerText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
