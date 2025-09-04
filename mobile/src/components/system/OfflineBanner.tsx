import React from "react";
import { View, Text, Pressable } from "react-native";
import { useIsOnline } from "../../hooks/useConnectivity";
import { loadLastSearch } from "../../utils/offlineCache";
import { emit } from "../../utils/events";
import { track } from "../../utils/analytics";

function timeAgo(iso?: string) {
  if (!iso) return "";
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 0) return "just now";
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr${h>1?"s":""} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d>1?"s":""} ago`;
}

export default function OfflineBanner() {
  const online = useIsOnline();
  const [ts, setTs] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const cache = await loadLastSearch();
      if (!mounted) return;
      setTs(cache?.timestamp ?? null);
    })();
    return () => { mounted = false; };
  }, []);

  if (online || !ts) return null;

  return (
    <View style={{ backgroundColor: "#FFF3CD", borderBottomColor: "#FFE8A1", borderBottomWidth: 1 }}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 8, flexDirection: "row", alignItems: "center" }}>
        <Text style={{ color: "#7A5D00", fontWeight: "700" }}>Offline</Text>
        <Text style={{ color: "#7A5D00", marginLeft: 8, flexShrink: 1 }}>Showing cached results from {timeAgo(ts)}.</Text>
        <Pressable
          style={{ marginLeft: "auto", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: "#7A5D00" }}
          onPress={() => { track("offline_retry_clicked"); emit("refetch-listings"); }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>Retry</Text>
        </Pressable>
      </View>
    </View>
  );
}
