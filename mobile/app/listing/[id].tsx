import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useListingById } from "../../hooks/useListingById";
import { Gallery } from "../../components/listing/Gallery";
import { FactGrid } from "../../components/listing/FactGrid";
import { TrustBlock } from "../../components/listing/TrustBlock";
import { MapMini } from "../../components/listing/MapMini";
import { track } from "../../lib/analytics";

export default function ListingDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = params?.id as string;
  const { data, isLoading, isError, refetch } = useListingById(id);
  const router = useRouter();

  useEffect(() => {
    if (id) track("view_listing", { listingId: id, source: (params as any)?.source });
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading listing…</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Text style={{ fontWeight: "700", marginBottom: 6 }}>Couldn’t load this listing.</Text>
        <Text onPress={() => refetch()} style={{ color: "#d00", fontWeight: "700" }}>Retry</Text>
        <Text onPress={() => router.back()} style={{ marginTop: 8 }}>Go back</Text>
      </View>
    );
  }

  // Lightweight image prefetch for first 6
  useEffect(() => {
    (async () => {
      const firstSix = data.images?.slice(0, 6) || [];
      await Promise.allSettled(firstSix.map(uri => (Image as any).prefetch?.(uri)));
    })();
  }, [data?.images]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ flex: 1 }}>
      <Gallery images={data.images} />
      <FactGrid listing={data} />
      <TrustBlock listing={data} />
      <MapMini listing={data} />
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
});