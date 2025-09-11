import React, { useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { View, Text, TextInput, Pressable } from "react-native";
import { useSearchStore } from "../../store/useSearchStore";
import { normalizeFilters, type Filters } from "../../schemas/filters";
import { saveFilters } from "../../utils/filterPersist";
import { track } from "../../utils/analytics";

type Tab = "price" | "beds" | "baths" | "type" | "all";

export default function FiltersSheet({ openRef }: { openRef: React.MutableRefObject<(tab?: Tab) => void> }) {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["45%","92%"], []);
  const { filters, setFilters } = useSearchStore();
  const [tab, setTab] = useState<Tab>("all");

  // local state for inputs
  const [priceMin, setPriceMin] = useState<string>(filters.priceMin?.toString() ?? "");
  const [priceMax, setPriceMax] = useState<string>(filters.priceMax?.toString() ?? "");
  const [beds, setBeds] = useState<number>(filters.beds ?? 0);
  const [baths, setBaths] = useState<number>(filters.baths ?? 0);
  const [types, setTypes] = useState<string[]>(filters.propertyType ?? []);

  // expose open method
  openRef.current = (focus?: Tab) => {
    if (focus) setTab(focus);
    sheetRef.current?.expand();
  };

  const apply = async () => {
    const next: Filters = normalizeFilters({
      priceMin: priceMin ? parseInt(priceMin, 10) : undefined,
      priceMax: priceMax ? parseInt(priceMax, 10) : undefined,
      beds, baths,
      propertyType: types.length ? (types as any) : undefined,
    });
    setFilters(next);
    await saveFilters(next);
    track("filters_applied", {
      hasPrice: !!(next.priceMin || next.priceMax),
      beds: next.beds ?? 0,
      baths: next.baths ?? 0,
      typeCount: next.propertyType?.length ?? 0,
    });
    sheetRef.current?.close();
  };

  const reset = async () => {
    setPriceMin(""); setPriceMax(""); setBeds(0); setBaths(0); setTypes([]);
    setFilters({});
    await saveFilters({});
    track("filters_reset");
  };

  const Pill = ({ selected, onPress, label }: any) => (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999,
        borderWidth: 1, borderColor: selected ? "#D32F2F" : "#ddd",
        backgroundColor: selected ? "#FBE9E7" : "#fff", marginRight: 8,
      }}
    >
      <Text style={{ fontWeight: "600", color: selected ? "#B71C1C" : "#222" }}>{label}</Text>
    </Pressable>
  );

  const Section = ({ title, children }: any) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 12, fontWeight: "700", color: "#666", marginBottom: 8 }}>{title}</Text>
      {children}
    </View>
  );

  return (
    <BottomSheet ref={sheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose>
      <BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Tabs */}
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          {(["all","price","beds","baths","type"] as Tab[]).map((t) => (
            <Pill key={t} selected={tab===t} onPress={() => setTab(t)} label={t.toUpperCase()} />
          ))}
        </View>

        {(tab === "all" || tab === "price") && (
          <Section title="Price (PHP)">
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ marginBottom: 6 }}>Min</Text>
                <TextInput keyboardType="number-pad" value={priceMin} onChangeText={setPriceMin} placeholder="e.g. 2000000"
                  style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10 }} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ marginBottom: 6 }}>Max</Text>
                <TextInput keyboardType="number-pad" value={priceMax} onChangeText={setPriceMax} placeholder="e.g. 8000000"
                  style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10 }} />
              </View>
            </View>
          </Section>
        )}

        {(tab === "all" || tab === "beds") && (
          <Section title="Bedrooms">
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {[0,1,2,3,4,5].map((n) => (
                <Pill key={n} selected={beds===n} onPress={() => setBeds(n)} label={n===0 ? "Any" : `${n}+`} />
              ))}
            </View>
          </Section>
        )}

        {(tab === "all" || tab === "baths") && (
          <Section title="Bathrooms">
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {[0,1,2,3,4,5].map((n) => (
                <Pill key={n} selected={baths===n} onPress={() => setBaths(n)} label={n===0 ? "Any" : `${n}+`} />
              ))}
            </View>
          </Section>
        )}

        {(tab === "all" || tab === "type") && (
          <Section title="Property Type">
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {[
                { key: "condo", label: "Condo" },
                { key: "house", label: "House & Lot" },
                { key: "townhouse", label: "Townhouse" },
                { key: "lot", label: "Lot Only" },
              ].map(({ key, label }) => {
                const selected = types.includes(key);
                return (
                  <Pill
                    key={key}
                    selected={selected}
                    onPress={() =>
                      setTypes((prev) => selected ? prev.filter((x) => x !== key) : [...prev, key])
                    }
                    label={label}
                  />
                );
              })}
            </View>
          </Section>
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
          <Pressable onPress={reset} style={{ paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: "#ddd" }}>
            <Text style={{ fontWeight: "700" }}>Reset</Text>
          </Pressable>
          <Pressable onPress={apply} style={{ paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, backgroundColor: "#D32F2F" }}>
            <Text style={{ color: "#fff", fontWeight: "800" }}>Apply</Text>
          </Pressable>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
