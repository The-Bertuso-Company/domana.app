import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import * as Location from "expo-location";
import Constants from "expo-constants";

type MarkerData = {
  id: string;
  latitude: number;
  longitude: number;
  price: string;
};

// ✅ Get token from app.config.js → extra.mapboxAccessToken
const MAPBOX_ACCESS_TOKEN = Constants.expoConfig?.extra?.mapboxAccessToken || "";

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

export default function Explore() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Dummy listings (50-mile radius placeholders)
  const listings: MarkerData[] = [
    { id: "1", latitude: 14.5995, longitude: 120.9842, price: "₱1.2M" }, // Manila
    { id: "2", latitude: 14.6760, longitude: 121.0437, price: "₱850k" },  // Quezon City
    { id: "3", latitude: 14.5547, longitude: 121.0244, price: "₱2.5M" },  // Makati
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let loc = await Location.getCurrentPositionAsync({});
      setUserLocation([loc.coords.longitude, loc.coords.latitude]);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {userLocation && (
        <MapboxGL.MapView style={styles.map} styleURL={MapboxGL.StyleURL.Street}>
          <MapboxGL.Camera zoomLevel={11} centerCoordinate={userLocation} />

          {/* User marker */}
          <MapboxGL.PointAnnotation id="user" coordinate={userLocation}>
            <View style={styles.userMarker} />
          </MapboxGL.PointAnnotation>

          {/* Listings */}
          {listings.map((listing) => (
            <MapboxGL.PointAnnotation
              key={listing.id}
              id={listing.id}
              coordinate={[listing.longitude, listing.latitude]}
            >
              <View style={styles.marker} />
              <MapboxGL.Callout title={listing.price} />
            </MapboxGL.PointAnnotation>
          ))}
        </MapboxGL.MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#007AFF", // Blue dot
    borderWidth: 2,
    borderColor: "#fff",
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "red",
    borderWidth: 2,
    borderColor: "#fff",
  },
});
