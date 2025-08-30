import React from "react";
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { useSearchStore } from "../../store/useSearchStore";
import { useQuery } from "@tanstack/react-query";
import { fetchListings } from "../../services/listings";

export default function SearchList() {
  const { bounds, filters, sort, setResults, results, status, setStatus, setSelectedId } = useSearchStore();

  const { data, isFetching, refetch, isError } = useQuery({
    queryKey: ["listings", { bounds, filters, sort }],
    queryFn: () => fetchListings({ bounds: bounds!, filters, sort }),
    enabled: !!bounds,
  });

  React.useEffect(() => {
    if (isFetching) setStatus("loading");
  }, [isFetching, setStatus]);

  React.useEffect(() => {
    if (data) {
      setResults(data);
      setStatus("success");
    }
  }, [data, setResults, setStatus]);

  React.useEffect(() => {
    if (isError) setStatus("error");
  }, [isError, setStatus]);

  const onPressItem = (id: string) => setSelectedId(id);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={{ padding: 12, borderBottomWidth: 1, borderColor: "#eee" }} onPress={() => onPressItem(item.id)}>
      <Text style={{ fontWeight: "600" }}>{item.title}</Text>
      <Text>
        ₱{item.price.toLocaleString()} · {item.bedrooms} BR · {item.baths} BA · {item.area_sqm} sqm
      </Text>
    </TouchableOpacity>
  );

  if (status === "error") {
    return (
      <View style={{ padding: 16 }}>
        <Text>There was a problem fetching listings. Pull to retry.</Text>
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
      data={results}
      keyExtractor={(it) => it.id}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
      ListEmptyComponent={
        <View style={{ padding: 16 }}>
          <Text>No results found here.</Text>
        </View>
      }
    />
  );
}
