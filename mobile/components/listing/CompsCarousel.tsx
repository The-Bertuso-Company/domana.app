import React, { useEffect } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Listing } from "../../types/listing";
import { useCompsForListing } from "../../hooks/useCompsForListing";
import { formatMoney, metaRow } from "../../lib/format";
import { useRouter } from "expo-router";
import { track } from "../../lib/analytics";

export function CompsCarousel({ listing }: { listing: Listing }) {
  const { data, isLoading, isError, refetch } = useCompsForListing(listing);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) track("view_comps", { listingId: listing.id, count: data?.length || 0 });
  }, [isLoading]);

  // Prefetch first few comp images for snappier scroll
  useEffect(() => {
    if (!data?.length) return;
    const first = data.slice(0, 4).flatMap(c => c.images?.slice(0,1) || []);
    Promise.allSettled(first.map(uri => (Image as any).prefetch?.(uri)));
  }, [data]);

  function openAll() {
    // Pre-filter search around price ±15% and ±1 bed/bath; include compOf marker
    const price = listing.price || 0;
    const priceMin = Math.max(0, Math.round(price * 0.85));
    const priceMax = Math.round(price * 1.15);
    const params: Record<string, any> = {
      compOf: listing.id,
      priceMin: String(priceMin),
      priceMax: String(priceMax),
    };
    if (listing.beds != null) params.beds = String(listing.beds);
    if (listing.baths != null) params.baths = String(listing.baths);
    if (listing.latitude && listing.longitude) params.center = `${listing.latitude},${listing.longitude}`;
    track("open_all_comps", { listingId: listing.id });
    router.push({ pathname: "/(tabs)/search", params });
  }

  if (isLoading) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.title}>Similar nearby</Text>
        <Text style={styles.dim}>Loading…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.title}>Similar nearby</Text>
        <Text style={styles.dim}>Couldn’t load comps.</Text>
        <Pressable onPress={refetch} style={styles.retry}><Text style={styles.retryTxt}>Retry</Text></Pressable>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.title}>Similar nearby</Text>
        <Text style={styles.dim}>No close comps. Try a wider radius.</Text>
        <Pressable onPress={openAll} style={styles.btn}><Text style={styles.btnTxt}>View all comps</Text></Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Similar nearby</Text>
        <Pressable onPress={openAll} accessibilityRole="button"><Text style={styles.link}>View all</Text></Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
        {data.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => { track("tap_comp_card", { listingId: listing.id, compId: c.id }); router.push({ pathname: "/listing/[id]", params: { id: c.id, source: "comps" } }); }}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
            accessibilityRole="button"
            accessibilityLabel={`Open comp ${c.address?.line1 || ""}`}
          >
            <Image source={{ uri: c.images?.[0] || "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop" }} style={styles.img} />
            <View style={{ padding: 10 }}>
              <Text style={styles.price} numberOfLines={1}>{formatMoney(c.price)}</Text>
              <Text style={styles.meta} numberOfLines={1}>{metaRow(c.beds, c.baths, c.sqft)}</Text>
              <Text style={styles.addr} numberOfLines={1}>{c.address?.city || ""}</Text>
            </View>
            {!!c.distanceKm && (
              <View style={styles.badge}>
                <Text style={styles.badgeTxt}>{c.distanceKm.toFixed(1)} km</Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "700" },
  link: { color: "#0ea5e9", fontWeight: "700" },
  dim: { color: "#666" },

  card: { width: 240, marginRight: 12, backgroundColor: "white", borderRadius: 12, overflow: "hidden", borderWidth: StyleSheet.hairlineWidth, borderColor: "#eee" },
  img: { width: "100%", height: 120, backgroundColor: "#ddd" },
  price: { fontWeight: "800" },
  meta: { color: "#444", marginTop: 2 },
  addr: { color: "#666", fontSize: 12 },

  badge: { position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgeTxt: { color: "white", fontWeight: "700", fontSize: 12 },

  btn: { marginTop: 6, alignSelf: "flex-start", backgroundColor: "#111", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  btnTxt: { color: "white", fontWeight: "800" },

  retry: { marginTop: 6, alignSelf: "flex-start", backgroundColor: "#f5f5f5", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  retryTxt: { color: "#111", fontWeight: "800" },
});