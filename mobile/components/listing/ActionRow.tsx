import React, { useState } from "react";
import { Alert, Modal, Pressable, Share, StyleSheet, Text, TextInput, View } from "react-native";
import type { Listing } from "../../types/listing";
import type { SavedListingSummary } from "../../types/userdata";
import { useShortlist } from "../../hooks/useShortlist";
import { useNotes } from "../../hooks/useNotes";
import { useCompare } from "../../hooks/useCompare";
import { formatMoney } from "../../lib/format";
import { buildListingUrls, shareTitleFromBits } from "../../lib/deeplink";
import { track } from "../../lib/analytics";

function toSummary(listing: Listing): SavedListingSummary {
  return {
    id: listing.id,
    price: listing.price,
    addressLine: listing.address?.line1,
    city: listing.address?.city,
    state: listing.address?.state,
    thumb: listing.images?.[0],
    beds: listing.beds, baths: listing.baths, sqft: listing.sqft,
    type: listing.type,
    latitude: listing.latitude, longitude: listing.longitude,
  };
}

export function ActionRow({ listing }: { listing: Listing }) {
  const summary = toSummary(listing);
  const { isSaved, save, remove } = useShortlist();
  const { getNote, setNote } = useNotes();
  const { has, toggle } = useCompare();

  const saved = isSaved(listing.id);
  const inCompare = has(listing.id);

  const [noteOpen, setNoteOpen] = useState(false);
  const [text, setText] = useState(getNote(listing.id));

  async function onSaveToggle() {
    if (saved) await remove(listing.id);
    else await save(summary);
  }

  async function onCompareToggle() {
    await toggle(summary);
  }

  function openNotes() {
    setText(getNote(listing.id));
    setNoteOpen(true);
    track("open_notes", { listingId: listing.id });
  }

  async function saveNotes() {
    await setNote(listing.id, text.trim());
    setNoteOpen(false);
    Alert.alert("Saved", "Your note was saved for this listing.");
  }

  async function doShare() {
    const { shareUrl } = buildListingUrls(listing.id, { ref: "share" });
    const price = formatMoney(listing.price);
    const address = [listing.address?.line1, listing.address?.city].filter(Boolean).join(", ");
    const title = shareTitleFromBits(price, address);
    track("tap_share", { listingId: listing.id });
    try {
      await Share.share({ message: `${title}\n${shareUrl}` });
    } catch {}
  }

  async function copyLink() {
    const { shareUrl } = buildListingUrls(listing.id, { ref: "share" });
    try {
      // dynamic import to avoid hard dependency
      // @ts-ignore
      const mod = await import("expo-clipboard");
      await (mod?.default?.setStringAsync?.(shareUrl) ?? Promise.resolve());
      Alert.alert("Link copied", "Share URL copied to your clipboard.");
      track("share_copied", { listingId: listing.id });
    } catch {
      // fallback
      track("share_copied", { listingId: listing.id, fallback: true });
    }
  }

  return (
    <View style={styles.wrap}>
      <RowBtn label={saved ? "Saved" : "Save"} active={saved} onPress={onSaveToggle} />
      <RowBtn label="Notes" onPress={openNotes} />
      <RowBtn label={inCompare ? "In Compare" : "Compare"} active={inCompare} onPress={onCompareToggle} />
      <RowBtn label="Share" onPress={doShare} />
      <RowBtn label="Copy link" onPress={copyLink} />

      <Modal visible={noteOpen} transparent animationType="fade" onRequestClose={() => setNoteOpen(false)}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Notes for this listing</Text>
            <TextInput
              value={text}
              onChangeText={setText}
              style={styles.input}
              placeholder="House feels bright in the afternoon. Ask about roof age..."
              placeholderTextColor="#888"
              multiline
              numberOfLines={6}
            />
            <View style={styles.row}>
              <Pressable onPress={() => setNoteOpen(false)} style={[styles.btn, styles.ghost]}>
                <Text style={styles.ghostTxt}>Close</Text>
              </Pressable>
              <Pressable onPress={saveNotes} style={[styles.btn, styles.primary]}>
                <Text style={styles.primaryTxt}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function RowBtn({ label, onPress, active }: { label: string; onPress: () => void; active?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[styles.btnRow, active && styles.btnRowActive]} accessibilityRole="button">
      <Text style={[styles.btnRowTxt, active && styles.btnRowTxtActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8, flexDirection: "row", gap: 10, flexWrap: "wrap" },
  btnRow: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: "#e5e5e5", backgroundColor: "white" },
  btnRowActive: { backgroundColor: "#111", borderColor: "#111" },
  btnRowTxt: { fontWeight: "800", color: "#111" },
  btnRowTxtActive: { color: "white" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", padding: 20 },
  card: { backgroundColor: "white", borderRadius: 16, padding: 16, gap: 10 },
  title: { fontWeight: "800", fontSize: 16 },
  input: { borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 10, padding: 10, minHeight: 140, textAlignVertical: "top", color: "#111" },
  row: { flexDirection: "row", gap: 10, marginTop: 6, justifyContent: "flex-end" },
  btn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  primary: { backgroundColor: "#0ea5e9" },
  primaryTxt: { color: "white", fontWeight: "900" },
  ghost: { backgroundColor: "#f5f5f5" },
  ghostTxt: { color: "#111", fontWeight: "800" },
});