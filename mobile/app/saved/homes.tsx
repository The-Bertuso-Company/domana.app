import { Stack, useRouter } from "expo-router";
import { FlatList, View, Text, Pressable, BackHandler, Alert } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useSavedHomes, useSavedActions } from "../../src/features/saved/hooks";
import { useSavedUi } from "../../src/features/saved/uiState";
import { matchesFilters, sortHomes, uniqueTags } from "../../src/features/saved/selectors";
import { SavedHomeCard } from "../../src/components/saved/SavedHomeCard";
import { SavedHeaderControls } from "../../src/components/saved/SavedHeaderControls";
import { SortMenu } from "../../src/components/saved/SortMenu";
import { FilterSheet } from "../../src/components/saved/FilterSheet";
import { TagManagerSheet } from "../../src/components/saved/TagManagerSheet";
import { ActionsMenu } from "../../src/components/saved/ActionsMenu";
import { OfflineBanner } from "../../src/components/saved/OfflineBanner";
import { useSavedStore } from "../../src/features/saved/store";

export default function SavedHomesScreen() {
  const router = useRouter();
  const homesMap = useSavedHomes();
  const { removeHome, addHomeTag, removeHomeTag, setHomeArchived } = useSavedActions();

  const sortBy = useSavedUi((s) => s.sortBy);
  const filters = useSavedUi((s) => s.filters);
  const selectMode = useSavedUi((s) => s.selectMode);
  const selectedIds = useSavedUi((s) => s.selectedIds);
  const setSortBy = useSavedUi((s) => s.setSortBy);
  const setFilters = useSavedUi((s) => s.setFilters);
  const clearFilters = useSavedUi((s) => s.clearFilters);
  const enterSelect = useSavedUi((s) => s.enterSelect);
  const exitSelect = useSavedUi((s) => s.exitSelect);
  const toggleSelect = useSavedUi((s) => s.toggleSelect);
  const clearSelection = useSavedUi((s) => s.clearSelection);

  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);

  const homes = useMemo(() => Object.values(homesMap), [homesMap]);
  const tagOptions = useMemo(() => uniqueTags(homes), [homes]);
  const filteredSorted = useMemo(() => sortHomes(homes.filter(h => matchesFilters(h, filters)), sortBy), [homes, filters, sortBy]);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (selectMode) { exitSelect(); return true; }
      return false;
    });
    return () => sub.remove();
  }, [selectMode]);

  const qlen = useSavedStore((s) => s.queue?.length ?? 0);

  const selectedCount = selectedIds.size;
  const headerRight = selectMode
    ? () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Pressable onPress={() => exitSelect()} accessibilityLabel="Exit selection mode"><Text>Cancel</Text></Pressable>
          <Text style={{ fontWeight: "700" }}>{selectedCount} selected</Text>
          <Pressable onPress={() => setActionsOpen(true)} disabled={selectedCount===0} accessibilityLabel="Open actions">
            <Text style={{ color: selectedCount===0 ? "#aaa" : undefined }}>Actions</Text>
          </Pressable>
        </View>
      )
    : () => (
        <SavedHeaderControls mode="homes" onSort={() => setSortOpen(true)} onFilter={() => setFilterOpen(true)} onSelect={() => enterSelect()} />
      );

  const selectedArray = Array.from(selectedIds);
  const selectedHomes = filteredSorted.filter(h => selectedIds.has(h.listingId));
  const selectedTagsUnion = Array.from(new Set(selectedHomes.flatMap(h => h.tags ?? [])));

  const handleAddTag = (tag: string) => selectedArray.forEach(id => addHomeTag(id, tag));
  const handleRemoveTag = (tag: string) => selectedArray.forEach(id => removeHomeTag(id, tag));

  const handleRemoveSelected = () => {
    Alert.alert("Remove selected homes?", "They will be unsaved.", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => { selectedArray.forEach((id) => removeHome(id)); clearSelection(); exitSelect(); } }
    ]);
  };

  const handleArchiveSelected = () => { selectedArray.forEach((id) => setHomeArchived(id, true)); clearSelection(); exitSelect(); };
  const handleCompareSelected = () => {
    const ids = selectedArray.slice(0,4);
    if (ids.length < 2) return;
    const q = encodeURIComponent(ids.join(","));
    router.push(`/compare?ids=${q}`);
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Saved", headerRight }} />
      <OfflineBanner />
      {!!qlen && (<View style={{ paddingHorizontal: 16, paddingVertical: 6 }}><Text style={{ color: "#666" }}>{qlen} change(s) pending sync</Text></View>)}

      {filteredSorted.length === 0 ? (
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>No saved homes match your filters.</Text>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Pressable onPress={() => clearFilters()}><Text>Clear filters</Text></Pressable>
            <Pressable onPress={() => router.push("/search")}><Text>Go to Search</Text></Pressable>
          </View>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16 }}
          data={filteredSorted}
          keyExtractor={(h) => h.listingId}
          renderItem={({ item }) => (
            <SavedHomeCard
              home={item}
              selected={selectedIds.has(item.listingId)}
              onPress={() => { if (selectMode) { toggleSelect(item.listingId); } else { /* router.push(`/listing/${item.listingId}`) */ } }}
              onLongPress={() => { if (!selectMode) enterSelect(item.listingId); }}
            />
          )}
        />
      )}

      <SortMenu visible={sortOpen} onClose={()=>setSortOpen(false)} value={sortBy} onChange={setSortBy} />
      <FilterSheet visible={filterOpen} onClose={()=>setFilterOpen(false)} value={filters} onChange={setFilters} tagOptions={tagOptions} />
      <TagManagerSheet visible={tagOpen} onClose={()=>setTagOpen(false)} selectedTags={selectedTagsUnion} onAdd={(t)=>handleAddTag(t)} onRemove={(t)=>handleRemoveTag(t)} allTags={tagOptions.filter(t => !selectedTagsUnion.includes(t))} />
      <ActionsMenu visible={actionsOpen} onClose={()=>setActionsOpen(false)} selectedCount={selectedCount} onCompare={()=>handleCompareSelected()} onTag={()=>setTagOpen(true)} onArchive={()=>handleArchiveSelected()} onRemove={()=>handleRemoveSelected()} />
    </>
  );
}
