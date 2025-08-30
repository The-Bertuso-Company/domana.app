import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { Listing } from "../../types/listing";
import { useRouter } from "expo-router";

const TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

function mapboxStaticUrl(lat: number, lng: number) {
  const zoom = 14;
  const w = 600, h = 320; // expo scales well
  const pin = `pin-s+ff0000(${lng},${lat})`;
  return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${pin}/${lng},${lat},${zoom},0,0/${w}x${h}@2x?access_token=${TOKEN}`;
}

export function MapMini({ listing }: { listing: Listing }) {
  const router = useRouter();

  if (!listing.latitude || !listing.longitude) {
    return null;
  }

  const hasToken = !!TOKEN;
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Location</Text>
      <Pressable
        onPress={() => router.push({ pathname: "/(tabs)/search", params: { center: `${listing.latitude},${listing.longitude}`, highlight: listing.id } })}
        accessibilityRole="button"
        accessibilityLabel="Open on map"
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
      >
        {hasToken ? (
          <Image source={{ uri: mapboxStaticUrl(listing.latitude, listing.longitude) }} style={styles.img} />
        ) : (
          <View style={[styles.img, styles.fallback]}>
            <Text style={styles.fallbackTxt}>Map preview requires EXPO_PUBLIC_MAPBOX_TOKEN</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  img: { width: "100%", height: 180, borderRadius: 12, overflow: "hidden", backgroundColor: "#ddd" },
  fallback: { alignItems: "center", justifyContent: "center" },
  fallbackTxt: { color: "#333", fontWeight: "600", textAlign: "center", paddingHorizontal: 12 },
});
