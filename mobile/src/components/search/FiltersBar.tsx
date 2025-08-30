import React, { useMemo, useRef } from "react";
import { View, ScrollView } from "react-native";
import { Chip } from "../ui/Chip";
import { useSearchStore } from "../../store/useSearchStore";
import FiltersSheet from "./FiltersSheet";
import { peso } from "../../utils/currency";

export default function FiltersBar() {
  const { filters } = useSearchStore();
  const openRef = useRef<(tab?: "price" | "beds" | "baths" | "type" | "all") => void>(()=>{});

  const priceLabel = useMemo(() => {
    const { priceMin, priceMax } = filters as any;
    if (priceMin && priceMax) return `${peso(priceMin)}–${peso(priceMax)}`;
    if (priceMin) return `≥ ${peso(priceMin)}`;
    if (priceMax) return `≤ ${peso(priceMax)}`;
    return "Price";
  }, [filters]);

  const bedsLabel = useMemo(() => {
    const v = (filters as any).beds ?? 0;
    return v ? `${v}+ BR` : "Beds";
  }, [filters]);

  const bathsLabel = useMemo(() => {
    const v = (filters as any).baths ?? 0;
    return v ? `${v}+ BA` : "Baths";
  }, [filters]);

  const typeLabel = useMemo(() => {
    const t = (filters as any).propertyType as string[] | undefined;
    if (!t || !t.length) return "Type";
    if (t.length === 1) {
      const map: any = { condo: "Condo", house: "House", townhouse: "Townhouse", lot: "Lot" };
      return map[t[0]] ?? "Type";
    }
    return `${t.length} types`;
  }, [filters]);

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
      >
        <Chip label={priceLabel} onPress={() => openRef.current("price")} active={!!(filters as any).priceMin || !!(filters as any).priceMax} />
        <Chip label={bedsLabel} onPress={() => openRef.current("beds")} active={!!(filters as any).beds} />
        <Chip label={bathsLabel} onPress={() => openRef.current("baths")} active={!!(filters as any).baths} />
        <Chip label={typeLabel} onPress={() => openRef.current("type")} active={!!(filters as any).propertyType?.length} />
        <Chip label="More" onPress={() => openRef.current("all")} />
      </ScrollView>

      {/* Bottom sheet lives here */}
      <FiltersSheet openRef={openRef} />
    </View>
  );
}
