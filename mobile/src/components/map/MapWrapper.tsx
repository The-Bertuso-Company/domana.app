import React, { useEffect, useMemo, useRef } from "react";
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Region, Polygon as RNPolygon, Polyline } from "react-native-maps";
import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import { useSearchStore } from "../../store/useSearchStore";
import { debounce } from "../../utils/debounce";
import Supercluster from "supercluster";
import { listingsToFeatureCollection, clampZoom, regionFromCenterZoom } from "../../utils/geo";
import type { Feature, FeatureCollection, Point } from "geojson";
import { router } from "expo-router";
import { verticesToPolygon, polygonAreaKm2 } from "../../utils/polygon";
import { track } from "../../utils/analytics";

type ClusterPoint = Feature<Point, { cluster: true; point_count: number; cluster_id: number }>;
type ListingPoint = Feature<Point, { id: string; price: number; title: string; photo?: string }>;
type AnyPoint = ClusterPoint | ListingPoint;

export default function MapWrapper() {
  const mapRef = useRef<MapView>(null);
  const {
    results, selectedId, hoverId, setBounds, setCenter, setZoom, zoom, bounds, setSelectedId,
    drawMode, vertices, addVertex, undoVertex, clearVertices, setPolygon, polygon
  } = useSearchStore();

  const initialRegion: Region = {
    latitude: 14.5995,
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
  }, 180);

  useEffect(() => {
    onRegionChangeComplete(initialRegion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build supercluster index from current results
  const { index } = useMemo(() => {
    const fc: FeatureCollection<Point, any> = listingsToFeatureCollection(results);
    const index = new Supercluster({ radius: 60, maxZoom: 20, minPoints: 2 }).load(fc.features as any);
    return { index };
  }, [results]);

  const clusters: AnyPoint[] = useMemo(() => {
    if (!bounds) return [];
    const [w, s, e, n] = bounds;
    const z = clampZoom(zoom);
    return index.getClusters([w, s, e, n], z) as AnyPoint[];
  }, [index, bounds, zoom]);

  const animateToCenterZoom = (lat: number, lon: number, targetZoom: number) => {
    const region = regionFromCenterZoom({ lat, lon }, clampZoom(targetZoom));
    mapRef.current?.animateToRegion(region, 280);
  };

  // Center map when a new selection happens (from list or pin)
  useEffect(() => {
    if (!selectedId) return;
    const sel = results.find((r) => r.id === selectedId);
    if (!sel) return;
    mapRef.current?.animateToRegion(
      {
        latitude: sel.lat,
        longitude: sel.lon,
        latitudeDelta: Math.min(0.05, 360 / Math.pow(2, clampZoom(zoom))),
        longitudeDelta: Math.min(0.05, 360 / Math.pow(2, clampZoom(zoom))),
      },
      240
    );
  }, [selectedId, results, zoom]);

  const renderClusterMarker = (f: ClusterPoint) => {
    const [lon, lat] = f.geometry.coordinates;
    const count = f.properties.point_count;
    return (
      <Marker
        key={`c-${f.properties.cluster_id}`}
        coordinate={{ latitude: lat, longitude: lon }}
        onPress={() => {
          track("cluster_tapped", { count });
          const exp = index.getClusterExpansionZoom(f.properties.cluster_id);
          animateToCenterZoom(lat, lon, exp);
        }}
      >
        <View style={styles.clusterBubble}><Text style={styles.clusterText}>{count}</Text></View>
      </Marker>
    );
  };

  const renderListingMarker = (f: ListingPoint) => {
    const [lon, lat] = f.geometry.coordinates;
    const id = f.properties.id;
    const isSelected = selectedId === id;
    const isHover = !isSelected && hoverId === id; // selection has priority
    const price = f.properties.price;
    const title = f.properties.title;
    const photo = f.properties.photo;

    return (
      <Marker key={id} coordinate={{ latitude: lat, longitude: lon }} onPress={() => { setSelectedId(id); track("pin_tapped", { id }); }}>
        {/* Custom pin visuals */}
        <View style={[styles.pin, isSelected ? styles.pinSelected : isHover ? styles.pinHover : styles.pinDefault]}>
          <View style={styles.pinDot} />
        </View>

        <Callout tooltip onPress={() => { track("preview_opened", { id }); router.push(`/listing/${id}`); }}>
          <View style={styles.calloutCard}>
            {photo ? <Image source={{ uri: photo }} style={styles.calloutImage} /> : null}
            <View style={{ padding: 8, maxWidth: 220 }}>
              <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 2 }}>₱{price.toLocaleString()}</Text>
              <Text numberOfLines={1} style={{ opacity: 0.8 }}>{title}</Text>
              <Pressable style={styles.viewBtn}><Text style={styles.viewBtnText}>View details</Text></Pressable>
            </View>
          </View>
        </Callout>
      </Marker>
    );
  };

  const finishPolygon = () => {
    const poly = verticesToPolygon(vertices);
    if (!poly) return;
    const area = polygonAreaKm2(poly);
    if (area < 0.01) return; // too small
    if (area > 1500) return; // too large
    setPolygon(poly);
    clearVertices();
    track("draw_completed", { vertices: vertices.length, area_km2: Math.round(area * 100) / 100 });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        onRegionChangeComplete={onRegionChangeComplete as any}
        onPress={(e) => {
          if (drawMode) {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            if (vertices.length === 0) track("draw_started");
            addVertex({ lat: latitude, lon: longitude });
          }
        }}
      >
        {/* Polyline while drawing */}
        {drawMode && vertices.length >= 1 ? (
          <Polyline
            coordinates={vertices.map(v => ({ latitude: v.lat, longitude: v.lon }))}
            strokeWidth={3}
            strokeColor="#D32F2F"
          />
        ) : null}

        {/* Finalized polygon */}
        {polygon ? (
          <RNPolygon
            coordinates={(polygon.geometry.coordinates[0] as number[][]).map(([lon, lat]) => ({ latitude: lat, longitude: lon }))}
            strokeColor="#D32F2F"
            fillColor="rgba(211,47,47,0.12)"
            strokeWidth={2}
          />
        ) : null}

        {/* Clusters + pins */}
        {clusters.map((f) =>
          (f as any).properties.cluster
            ? renderClusterMarker(f as ClusterPoint)
            : renderListingMarker(f as ListingPoint)
        )}
      </MapView>

      {/* Draw overlay controls */}
      {drawMode ? (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Tap the map to add points ({vertices.length}).</Text>
          <View style={styles.row}>
            <Pressable style={styles.btn} onPress={() => { undoVertex(); }} disabled={vertices.length === 0}><Text style={styles.btnTxt}>Undo</Text></Pressable>
            <Pressable style={styles.btn} onPress={() => { clearVertices(); track("draw_cleared_temp"); }} disabled={vertices.length === 0}><Text style={styles.btnTxt}>Clear</Text></Pressable>
            <Pressable style={[styles.btn, styles.btnPrimary]} onPress={finishPolygon} disabled={vertices.length < 3}><Text style={styles.btnPrimaryTxt}>Finish</Text></Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Cluster bubble */
  clusterBubble: {
    minWidth: 40, minHeight: 40, paddingHorizontal: 8, borderRadius: 20,
    backgroundColor: "#D32F2F", alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#fff",
  },
  clusterText: { color: "#fff", fontWeight: "800" },

  /* Pin visuals */
  pin: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 2, alignItems: "center", justifyContent: "center",
  },
  pinDefault: { backgroundColor: "#ffffff", borderColor: "#222" },
  pinHover: { backgroundColor: "#FFE9E9", borderColor: "#D32F2F" },
  pinSelected: { backgroundColor: "#D32F2F", borderColor: "#B71C1C" },
  pinDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#111" },

  /* Callout card */
  calloutCard: {
    flexDirection: "row", backgroundColor: "#fff", borderRadius: 12, overflow: "hidden",
    elevation: 3, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  calloutImage: { width: 100, height: 80, backgroundColor: "#eee" },
  viewBtn: { marginTop: 8, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: "#111" },
  viewBtnText: { color: "#fff", fontWeight: "700" },

  /* Draw overlay */
  overlay: {
    position: "absolute", top: 10, left: 10, right: 10, padding: 12,
    backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 12,
  },
  overlayText: { color: "#fff", marginBottom: 8 },
  row: { flexDirection: "row", gap: 8 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: "#333" },
  btnTxt: { color: "#fff", fontWeight: "700" },
  btnPrimary: { backgroundColor: "#D32F2F" },
  btnPrimaryTxt: { color: "#fff", fontWeight: "800" },
});
