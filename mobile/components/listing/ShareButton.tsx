import React from "react";
import { Alert, Pressable, Share, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import type { Listing } from "../../types/listing";
import { formatMoney, metaRow } from "../../lib/format";
import { buildListingUrl } from "../../lib/deeplink";
import { track } from "../../lib/analytics";

export function ShareButton({ listing }: { listing: Listing }) {
  async function onShare() {
    const url = buildListingUrl(listing.id);
    const title = `${formatMoney(listing.price)} — ${metaRow(listing.beds, listing.baths, listing.sqft)}`;
    const subtitle = [listing.address?.line1, listing.address?.city].filter(Boolean).join(", ");
    try {
      track("tap_share", { listingId: listing.id });
      await Share.share({
        title: `Domana • ${title}`,
        message: `${title}\n${subtitle}\n\n${url}`,
        url,
      });
    } catch (e) {
      // Swallow user cancellations; surface other errors
      if ((e as any)?.message && !String((e as any).message).includes("canceled")) {
        Alert.alert("Share failed", String((e as any).message));
      }
    }
  }

  async function onCopy() {
    const url = buildListingUrl(listing.id);
    await Clipboard.setStringAsync(url);
    track("share_copied", { listingId: listing.id });
    Alert.alert("Link copied", "You can paste it anywhere.");
  }

  return (
    <View style={styles.row}>
      <Pressable onPress={onShare} style={({ pressed }) => [styles.btn, styles.primary, pressed && { opacity: 0.9 }]} accessibilityRole="button">
        <Text style={styles.primaryTxt}>Share</Text>
      </Pressable>
      <Pressable onPress={onCopy} style={({ pressed }) => [styles.btn, styles.ghost, pressed && { opacity: 0.9 }]} accessibilityRole="button">
        <Text style={styles.ghostTxt}>Copy link</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  primary: { backgroundColor: "#111" },
  primaryTxt: { color: "white", fontWeight: "800" },
  ghost: { backgroundColor: "#f5f5f5" },
  ghostTxt: { color: "#111", fontWeight: "800" },
});