import React, { useEffect, useMemo, useRef } from "react";
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { View, StyleSheet, Text, Image, Platform, Pressable } from "react-native";
import { useSearchStore } from "../../store/useSearchStore";
import { debounce } from "../../utils/debounce";
import Supercluster from "supercluster";
import { listingsToFeatureCollection, clampZoom, regionFromCenterZoom } from "../../utils/geo";
import type { Feature, FeatureCollection, Point } from "geojson";
import { router } from "expo-router";

type ClusterPoint = Feature<Point, { cluster: true; point_count: number; cluster_id: number }>;
type ListingPoint = Feature<Point, { id: string; price: number; title: string; photo?: string }>;
type AnyPoint = ClusterPoint | ListingPoint;

export default function MapWrapper() {
  const mapRef = useRef<MapView>(null);
  const { results, selectedId, setBounds, setCenter, setZoom, zoom, bounds, setSelectedId } = useSearchStore();

  const initialRegion: Region = {
    latitude: 14.5995,      // Manila default
    longitude: 120.9842,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  };

  const onRegionChangeComplete = debounce((region: Region) => {
    const w = region.longitude - region.longitudeDelta / 2;
    const e = region.longitude + region.longitudeDelta / 2;
    const s = region.latitude - region.latitudeDelta / 2;
    const n = region.latitude + region.latitudeDelta / 2;
    setBounds([w, s, e, n]);
    setCenter({ lat: region.latitude, lon: region.longitude });
    const z = Math.round(Math.log2(360 / region.latitudeDelta));
    setZoom(z);
  }, 200);

  // Build supercluster index from current results
  const { index, fc } = useMemo(() => {
    const fc: FeatureCollection<Point, any> = listingsToFeatureCollection(results);
    const index = new Supercluster({
      radius: 60, // px
      maxZoom: 20,
      minPoints: 2,
    }).load(fc.features as any);
    return { index, fc };
  }, [results]);

  const clusters: AnyPoint[] = useMemo(() => {
    if (!bounds) return [];
    const [w, s, e, n] = bounds;
    const z = clampZoom(zoom);
    return index.getClusters([w, s, e, n], z) as AnyPoint[];
  }, [index, bounds, zoom]);

  useEffect(() => {
    // seed bounds on mount
    onRegionChangeComplete(initialRegion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animateToCenterZoom = (lat: number, lon: number, targetZoom: number) => {
    const region = regionFromCenterZoom({ lat, lon }, clampZoom(targetZoom));
    mapRef.current?.animateToRegion(region, 300);
  };

  const renderClusterMarker = (f: ClusterPoint) => {
    const [lon, lat] = f.geometry.coordinates;
    const count = f.properties.point_count;
    return (
      <Marker key={`c-${f.properties.cluster_id}`} coordinate={{ latitude: lat, longitude: lon }} onPress={() => {
        const exp = index.getClusterExpansionZoom(f.properties.cluster_id);
        animateToCenterZoom(lat, lon, exp);
      }}>
        <View style={styles.clusterBubble}>
          <Text style={styles.clusterText}>{count}</Text>
        </View>
      </Marker>
    );
  };

  const renderListingMarker = (f: ListingPoint) => {
    const [lon, lat] = f.geometry.coordinates;
    const id = f.properties.id;
    const isSelected = selectedId === id;
    const price = f.properties.price;
    const title = f.properties.title;
    const photo = f.properties.photo;

    return (
      <Marker
        key={id}
        coordinate={{ latitude: lat, longitude: lon }}
        pinColor={isSelected ? undefined : undefined}
        onPress={() => setSelectedId(id)}
      >
        <Callout tooltip onPress={() => router.push(`/listing/${id}`)}>
          <View style={styles.calloutCard}>
            {photo ? <Image source={{ uri: photo }} style={styles.calloutImage} /> : null}
            <View style={{ padding: 8, maxWidth: 220 }}>
              <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 2 }}>₱{price.toLocaleString()}</Text>
              <Text numberOfLines={1} style={{ opacity: 0.8 }}>{title}</Text>
              <Pressable style={styles.viewBtn}>
                <Text style={styles.viewBtnText}>View details</Text>
              </Pressable>
            </View>
          </View>
        </Callout>
      </Marker>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        onRegionChangeComplete={onRegionChangeComplete as any}
      >
        {clusters.map((f) =>
          (f as any).properties.cluster
            ? renderClusterMarker(f as ClusterPoint)
            : renderListingMarker(f as ListingPoint)
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  clusterBubble: {
    minWidth: 40,
    minHeight: 40,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "#D32F2F", // Domana red-ish
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  clusterText: { color: "#fff", fontWeight: "800" },
  calloutCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  calloutImage: { width: 100, height: 80, backgroundColor: "#eee" },
  viewBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#111",
  },
  viewBtnText: { color: "#fff", fontWeight: "700" },
});
