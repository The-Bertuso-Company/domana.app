// src/components/DomanaMap.tsx
import React, { useEffect, useState, useRef } from "react";
import MapboxGL from "@rnmapbox/maps";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type MarkerData = {
  id: number;
  longitude: number;
  latitude: number;
  label?: string;
};

const mapboxToken = Constants.expoConfig?.extra?.mapboxAccessToken;
MapboxGL.setAccessToken(mapboxToken);

// Philippines bounding box
const PH_BOUNDS = {
  sw: [116.933, 4.225],
  ne: [126.601, 21.321],
};

export default function DomanaMap({ markers = [] as MarkerData[] }) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [inPH, setInPH] = useState(false);
  const cameraRef = useRef<MapboxGL.Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === "granted");

      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;
        const coords: [number, number] = [longitude, latitude];
        setUserCoords(coords);

        // check if inside PH
        if (
          latitude >= PH_BOUNDS.sw[1] &&
          latitude <= PH_BOUNDS.ne[1] &&
          longitude >= PH_BOUNDS.sw[0] &&
          longitude <= PH_BOUNDS.ne[0]
        ) {
          setInPH(true);
        }
      }
    })();
  }, []);

  const recenterOnUser = () => {
    if (cameraRef.current && userCoords && inPH) {
      cameraRef.current.setCamera({
        centerCoordinate: userCoords,
        zoomLevel: 9,
        animationDuration: 1000,
      });
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Requesting location permission…</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={{ textAlign: "center", color: "#555" }}>
          Location permission denied.{"\n"}
          Showing Philippines map.
        </Text>
        <View style={{ flex: 1, width: "100%", marginTop: 10 }}>
          <MapboxGL.MapView style={styles.map}>
            <MapboxGL.Camera bounds={{ sw: PH_BOUNDS.sw, ne: PH_BOUNDS.ne }} />
          </MapboxGL.MapView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v12"
        compassEnabled
        scaleBarEnabled
        logoEnabled={false}
        attributionEnabled={false}
      >
        {inPH && userCoords ? (
          <MapboxGL.Camera
            ref={cameraRef}
            centerCoordinate={userCoords}
            zoomLevel={9} // ~50 mile radius
          />
        ) : (
          <MapboxGL.Camera bounds={{ sw: PH_BOUNDS.sw, ne: PH_BOUNDS.ne }} />
        )}

        {inPH && <MapboxGL.UserLocation visible />}

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

      {inPH && (
        <TouchableOpacity style={styles.locButton} onPress={recenterOnUser}>
          <Text style={styles.locButtonText}>◎</Text>
        </TouchableOpacity>
      )}
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
