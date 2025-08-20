import React, { useEffect, useState, useRef } from "react";
import MapboxGL from "@rnmapbox/maps";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

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
  const [mapReady, setMapReady] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);

  // Ask for permissions
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Handle "My Location" button tap
  const recenterOnUser = () => {
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        followUserLocation: true,
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
  };

  // Show fallback while checking permission
  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Requesting location permission…</Text>
      </View>
    );
  }

  // Show fallback if permission denied
  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={{ textAlign: "center", color: "#555" }}>
          Location permission denied.  
          Showing default map view.
        </Text>
        {/* Still render PH map with markers */}
        <View style={{ flex: 1, width: "100%", marginTop: 10 }}>
          <MapboxGL.MapView style={styles.map}>
            <MapboxGL.Camera
              zoomLevel={5}
              centerCoordinate={[121.774, 12.8797]}
            />
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
      </View>
    );
  }

  // Normal render (permission granted)
  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v12"
        compassEnabled={true}
        scaleBarEnabled={true}
        logoEnabled={false}
        attributionEnabled={false}
        onDidFinishLoadingMap={() => setMapReady(true)}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={13}
          followUserLocation={true}
          followUserMode="normal"
        />

        {mapReady && (
          <>
            <MapboxGL.UserLocation visible={true} />
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
          </>
        )}
      </MapboxGL.MapView>

      {/* Floating "My Location" button */}
      <TouchableOpacity style={styles.locButton} onPress={recenterOnUser}>
        <Text style={styles.locButtonText}>◎</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, borderRadius: 12, overflow: "hidden" },
  map: { flex: 1 },
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
  markerText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  locButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  locButtonText: { fontSize: 20, fontWeight: "bold", color: "#333" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
