import React from "react";
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ViewToken, Pressable } from "react-native";
import { useSearchStore } from "../../store/useSearchStore";
import { useQuery } from "@tanstack/react-query";
import { fetchListings } from "../../services/listings";
import { debounce } from "../../utils/debounce";
import { saveLastSearch } from "../../utils/offlineCache";
import { on, off, emit } from "../../utils/events";
import { track } from "../../utils/analytics";
import { useIsOnline } from "../../hooks/useConnectivity";

export default function SearchList() {
  const online = useIsOnline();
  const {
    bounds, polygon, filters, sort,
    setResults, results, status, setStatus,
    setSelectedId, setHoverId, selectedId,
    center, zoom, setError,
  } = useSearchStore() as any;

  const { data, isFetching, refetch, isError, error } = useQuery({
    queryKey: ["listings", { bounds, polygon, filters, sort }],
    queryFn: async () => {
      track("search_fetch_start", { withPolygon: !!polygon, hasBounds: !!bounds });
      return fetchListings({ bounds: bounds!, polygon, filters, sort });
    },
    enabled: !!bounds || !!polygon,
    retry: 1,
  });

  React.useEffect(() => {
    if (isFetching) setStatus("loading");
  }, [isFetching, setStatus]);

  React.useEffect(() => {
    if (data) {
      setResults(data);
      setStatus("success");
      track("search_fetch_success", { count: data.length });
      // persist last successful search
      saveLastSearch({
        timestamp: new Date().toISOString(),
        inputs: { filters, bounds, polygon, sort, center, zoom },
        results: data,
      });
      setError(null);
    }
  }, [data, setResults, setStatus, filters, bounds, polygon, sort, center, zoom, setError]);

  React.useEffect(() => {
    if (isError) {
      const msg = online ? (error as any)?.message ?? "Failed to load listings." : "Offline: cannot fetch latest listings.";
      setStatus("error");
      setError(msg);
      track("search_fetch_error", { online, message: String(msg) });
    }
  }, [isError, error, setStatus, setError, online]);

  // Retry wiring from banner & button below
  React.useEffect(() => {
    const handler = () => { track("search_retry_clicked"); refetch(); };
    on("refetch-listings", handler);
    return () => off("refetch-listings", handler);
  }, [refetch]);

  const listRef = React.useRef<FlatList<any>>(null);

  // Debounced hover update while scrolling list
  const debouncedHover = React.useMemo(
    () => debounce((id: string) => setHoverId(id), 90),
    [setHoverId]
  );

  const onViewableItemsChanged = React.useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      const first = viewableItems.find((v) => v.isViewable);
      const id = (first as any)?.item?.id as string | undefined;
      if (id) debouncedHover(id);
    }
  ).current;

  const viewabilityConfig = React.useMemo(
    () => ({ itemVisiblePercentThreshold: 60 }),
    []
  );

  // Scroll to selected card when pin tapped
  React.useEffect(() => {
    if (!selectedId || !results?.length) return;
    const idx = results.findIndex((r) => r.id === selectedId);
    if (idx < 0) return;
    try { listRef.current?.scrollToIndex({ index: idx, viewPosition: 0.2, animated: true }); } catch {}
  }, [selectedId, results]);

  const onPressItem = (id: string) => {
    setSelectedId(id);
    track("listing_tapped", { id });
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={{
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
        backgroundColor: item.id === selectedId ? "#FFF5F5" : "#fff",
      }}
      onPress={() => onPressItem(item.id)}
    >
      <Text style={{ fontWeight: "600" }}>{item.title}</Text>
      <Text>
        ₱{item.price.toLocaleString()} · {item.bedrooms} BR · {item.baths} BA · {item.area_sqm} sqm
      </Text>
    </TouchableOpacity>
  );

  if (status === "error") {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ marginBottom: 8 }}>{online ? "We hit an error loading listings." : "You’re offline. Showing any cached results above if available."}</Text>
        <Pressable
          onPress={() => { track("search_retry_clicked"); emit("refetch-listings"); }}
          style={{ alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: "#111" }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (status === "idle" || (status === "loading" && results.length === 0)) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Loading listings…</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={listRef}
      data={results}
      keyExtractor={(it) => it.id}
      renderItem={renderItem}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
      ListEmptyComponent={
        <View style={{ padding: 16 }}>
          <Text>No results found here.</Text>
        </View>
      }
      initialNumToRender={10}
      windowSize={8}
      removeClippedSubviews
    />
  );
}
