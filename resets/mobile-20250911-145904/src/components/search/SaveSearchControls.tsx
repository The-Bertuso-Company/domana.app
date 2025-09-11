import React from "react";
import { View, Text, Pressable } from "react-native";
import { useSearchStore } from "../../store/useSearchStore";
import { listSavedSearches, makeFingerprint, saveCurrentSearch, toggleAlert } from "../../services/savedSearches";
import { router } from "expo-router";
import { track } from "../../utils/analytics";

export default function SaveSearchControls() {
  const { filters, bounds, polygon, sort } = useSearchStore();
  const [matchedId, setMatchedId] = React.useState<string | null>(null);
  const [alertOn, setAlertOn] = React.useState<boolean>(false);
  const [busy, setBusy] = React.useState<boolean>(false);

  const refreshMatch = React.useCallback(async () => {
    const all = await listSavedSearches();
    const fp = makeFingerprint({ filters, bounds, polygon, sort });
    const hit = all.find((s) => s.fingerprint === fp);
    setMatchedId(hit?.id ?? null);
    setAlertOn(hit?.alertEnabled ?? false);
  }, [filters, bounds, polygon, sort]);

  React.useEffect(() => { refreshMatch(); }, [refreshMatch]);

  const onSave = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { saved } = await saveCurrentSearch({ filters, bounds, polygon, sort });
      track("search_saved", { id: saved.id, name: saved.name, alertEnabled: saved.alertEnabled });
      await refreshMatch();
    } finally { setBusy(false); }
  };

  const onToggleAlert = async () => {
    if (!matchedId || busy) return;
    setBusy(true);
    try {
      const nextOn = !alertOn;
      await toggleAlert(matchedId, nextOn);
      setAlertOn(nextOn);
      track("search_alert_toggled", { id: matchedId, on: nextOn });
    } finally { setBusy(false); }
  };

  return (
    <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
      {!matchedId ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 }}>
          <Pressable
            onPress={onSave}
            disabled={busy}
            style={{ backgroundColor: "#D32F2F", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 }}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>{busy ? "Saving…" : "Save search"}</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/saved-searches")} style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
            <Text style={{ fontWeight: "700" }}>Manage saved</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 }}>
          <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: "#FBE9E7" }}>
            <Text style={{ color: "#B71C1C", fontWeight: "800" }}>Saved ✓</Text>
          </View>

          <Pressable
            onPress={onToggleAlert}
            disabled={busy}
            style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: "#ddd", backgroundColor: alertOn ? "#FFF5F5" : "#fff" }}
          >
            <Text style={{ fontWeight: "800" }}>{alertOn ? "Alerts: On" : "Alerts: Off"}</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/saved-searches")} style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
            <Text style={{ fontWeight: "700" }}>Manage saved</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
