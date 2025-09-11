import React, { useMemo, useState, useRef, useEffect } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import type { Listing } from "../../types/listing";
import type { ListingTrust, TrustLevel } from "../../types/trust";
import { useTrustByListingId } from "../../hooks/useTrustByListingId";
import { track } from "../../lib/analytics";

const COLORS: Record<TrustLevel, string> = {
  UNVERIFIED: "#9ca3af",
  CLAIMED: "#3b82f6",
  VERIFIED_BASIC: "#10b981",
  VERIFIED_FULL: "#f59e0b",
};

export function TrustBlock({ listing, onReadyY }: { listing: Listing; onReadyY?: (y: number) => void }) {
  const { data, isLoading, isError, refetch } = useTrustByListingId(listing.id);
  const [open, setOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState("");

  const wrapRef = useRef<View>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      wrapRef.current?.measure?.((x, y, w, h, px, py) => onReadyY?.(py));
    }, 150);
    return () => clearTimeout(t);
  }, [onReadyY]);

  const trust = data;
  const level: TrustLevel = trust?.level || "UNVERIFIED";
  const color = COLORS[level];

  const title = useMemo(() => {
    switch (level) {
      case "VERIFIED_FULL": return "Verified (Full)";
      case "VERIFIED_BASIC": return "Verified (Basic)";
      case "CLAIMED": return "Claimed";
      default: return "Unverified";
    }
  }, [level]);

  const microcopy = useMemo(() => {
    if (!trust) return isLoading ? "Checking listing status…" : isError ? "Couldn’t load trust data." : "Unverified source.";
    const when = trust.verified_at ? new Date(trust.verified_at).toLocaleDateString() : "—";
    const src = trust.source ? ` · Source: ${trust.source}` : "";
    return `${title} by Domana on ${when}${src}`;
  }, [trust, title, isLoading, isError]);

  function onOpenDetails() {
    setOpen(true);
    track("open_trust_details", { listingId: listing.id, level });
  }

  function submitReport() {
    if (!reportText.trim()) {
      Alert.alert("Add details", "Please include a short description of the issue.");
      return;
    }
    track("report_listing", { listingId: listing.id, text_len: reportText.length });
    setReportOpen(false);
    setReportText("");
    Alert.alert("Thanks", "We’ve recorded your report. Our team will review it.");
  }

  return (
    <View ref={wrapRef} onLayout={() => {}} style={styles.wrap}>
      <Text style={styles.sectionTitle}>Trust & Provenance</Text>

      <View style={styles.row}>
        <Badge color={color} text={title} />
        <Text style={styles.subtext} numberOfLines={2}>{microcopy}</Text>
      </View>

      <View style={styles.actions}>
        <Action text="Why trust this?" onPress={onOpenDetails} />
        <Action text="Report an issue" onPress={() => setReportOpen(true)} />
        {isError ? <Action text="Retry" onPress={refetch} /> : null}
      </View>

      {/* Details bottom sheet */}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.sheetOverlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Verification details</Text>
            {trust ? (
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <Row label="Level" value={title} color={color} />
                {trust.agent?.name || trust.agent?.prc || trust.agent?.brokerage ? (
                  <Row label="Agent" value={[trust.agent?.name, trust.agent?.brokerage, trust.agent?.prc ? `PRC ${trust.agent.prc}` : undefined].filter(Boolean).join(" · ")} />
                ) : null}
                {trust.source ? <Row label="Source" value={trust.source} /> : null}
                {trust.verified_at ? <Row label="Verified" value={new Date(trust.verified_at).toLocaleString()} /> : null}

                <Text style={styles.subhead}>Provenance</Text>
                {trust.provenance?.length ? trust.provenance.map((p, i) => (
                  <TimelineItem key={i} stage={p.stage} label={p.label} at={p.at} by={p.by} />
                )) : <Text style={styles.dim}>No provenance provided.</Text>}

                {trust.docs && trust.docs.length ? (
                  <>
                    <Text style={styles.subhead}>Documents</Text>
                    <View style={styles.docWrap}>
                      {trust.docs.map((d, i) => (
                        <DocPill key={i} label={d.label} verified={d.verified} />
                      ))}
                    </View>
                  </>
                ) : null}

                <Text style={styles.footerCopy}>
                  Domana verifies sources and identities where possible. Learn more in our Trust Policy (coming soon).
                </Text>
              </ScrollView>
            ) : (
              <Text style={styles.dim}>{isLoading ? "Loading…" : isError ? "Couldn’t load details." : "No details available."}</Text>
            )}

            <Pressable onPress={() => setOpen(false)} style={styles.closeSheetBtn} accessibilityRole="button" accessibilityLabel="Close details">
              <Text style={styles.closeSheetTxt}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Report modal */}
      <Modal visible={reportOpen} transparent animationType="fade" onRequestClose={() => setReportOpen(false)}>
        <View style={styles.reportOverlay}>
          <View style={styles.reportCard}>
            <Text style={styles.sheetTitle}>Report an issue</Text>
            <TextInput
              placeholder="Describe what looks wrong (e.g., price, photos, status)…"
              placeholderTextColor="#888"
              value={reportText}
              onChangeText={setReportText}
              style={styles.input}
              multiline
              numberOfLines={4}
            />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Pressable onPress={() => setReportOpen(false)} style={[styles.btn, styles.btnGhost]}>
                <Text style={styles.btnGhostTxt}>Cancel</Text>
              </Pressable>
              <Pressable onPress={submitReport} style={[styles.btn, styles.btnPrimary]}>
                <Text style={styles.btnPrimaryTxt}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Badge({ color, text }: { color: string; text: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeTxt}>{text}</Text>
    </View>
  );
}

function Action({ text, onPress }: { text: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.action, pressed && { opacity: 0.8 }]} accessibilityRole="button">
      <Text style={styles.actionTxt}>{text}</Text>
    </Pressable>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.kv}>
      <Text style={styles.kvLabel}>{label}</Text>
      <Text style={[styles.kvValue, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

function TimelineItem({ stage, label, at, by }: { stage: string; label: string; at?: string; by?: string }) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.bullet} />
      <View style={{ flex: 1 }}>
        <Text style={styles.timelineLabel}>{label}</Text>
        <Text style={styles.timelineMeta}>
          {stage.toUpperCase()} {at ? `· ${new Date(at).toLocaleString()}` : ""} {by ? `· ${by}` : ""}
        </Text>
      </View>
    </View>
  );
}

function DocPill({ label, verified }: { label: string; verified: boolean }) {
  return (
    <View style={[styles.docPill, verified ? styles.docOk : styles.docDim]}>
      <Text style={styles.docTxt}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  row: { gap: 6 },
  subtext: { color: "#555" },
  actions: { flexDirection: "row", gap: 16, paddingTop: 8 },
  action: { paddingVertical: 8 },
  actionTxt: { color: "#0ea5e9", fontWeight: "700" },

  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgeTxt: { color: "white", fontWeight: "800", fontSize: 12 },

  sheetOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "white", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: "80%" },
  sheetHandle: { alignSelf: "center", width: 40, height: 5, backgroundColor: "#ddd", borderRadius: 999, marginBottom: 10 },
  sheetTitle: { fontSize: 16, fontWeight: "800", marginBottom: 8 },
  subhead: { marginTop: 16, fontWeight: "800" },
  dim: { color: "#777" },
  kv: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  kvLabel: { color: "#666" },
  kvValue: { fontWeight: "700" },

  timelineRow: { flexDirection: "row", gap: 10, alignItems: "flex-start", paddingVertical: 6 },
  bullet: { width: 8, height: 8, borderRadius: 999, backgroundColor: "#bbb", marginTop: 6 },
  timelineLabel: { fontWeight: "700" },
  timelineMeta: { color: "#666", fontSize: 12, marginTop: 2 },

  docWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  docPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth },
  docOk: { backgroundColor: "#ecfdf5", borderColor: "#10b98155" },
  docDim: { backgroundColor: "#f5f5f5", borderColor: "#e5e5e5" },
  docTxt: { fontWeight: "700", color: "#111" },

  closeSheetBtn: { marginTop: 8, alignSelf: "center", paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#111", borderRadius: 999 },
  closeSheetTxt: { color: "white", fontWeight: "700" },

  reportOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", padding: 20 },
  reportCard: { backgroundColor: "white", borderRadius: 16, padding: 16, gap: 12 },
  input: { borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 10, padding: 10, minHeight: 100, textAlignVertical: "top", color: "#111" },
  btn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  btnPrimary: { backgroundColor: "#0ea5e9" },
  btnPrimaryTxt: { color: "white", fontWeight: "800" },
  btnGhost: { backgroundColor: "#f5f5f5" },
  btnGhostTxt: { color: "#111", fontWeight: "700" },
});