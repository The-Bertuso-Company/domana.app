import { Stack, useRouter } from "expo-router";
import { FlatList, View, Text, Pressable } from "react-native";
import { useState, useMemo } from "react";
import { useSavedSearches, useSavedActions } from "../../src/features/saved/hooks";
import { SavedSearchRow } from "../../src/components/saved/SavedSearchRow";
import { SavedHeaderControls } from "../../src/components/saved/SavedHeaderControls";
import { MoreMenu } from "../../src/components/saved/MoreMenu";
import { OfflineBanner } from "../../src/components/saved/OfflineBanner";

function uid() { return Math.floor(Date.now() + Math.random()*1e6).toString(36); }

export default function SavedSearchesScreen() {
  const router = useRouter();
  const searchesMap = useSavedSearches();
  const { addSearch, updateSearch, removeSearch } = useSavedActions();

  const [menuId, setMenuId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const searchesAll = useMemo(() => Object.values(searchesMap).sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [searchesMap]);
  const searches = searchesAll.filter(s => showArchived ? true : !s.isArchived);
  const active = menuId ? searchesMap[menuId] : undefined;

  const headerRight = () => (
    <SavedHeaderControls
      mode="searches"
      onNew={() => {
        const id = uid();
        addSearch({ id, name: "New saved search", createdAt: new Date().toISOString(), params: {}, notifySettings: { priceDrop: false, newMatches: false } });
      }}
    />
  );

  const openMenu = (id: string) => { setMenuId(id); setMenuOpen(true); };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Saved", headerRight }} />
      <OfflineBanner />

      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
        <Pressable onPress={() => setShowArchived(!showArchived)}>
          <Text>{showArchived ? "☑" : "☐"} Show archived</Text>
        </Pressable>
      </View>

      {searches.length === 0 ? (
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>No saved searches {showArchived ? "(including archived)" : "yet"}.</Text>
          <Pressable onPress={() => router.push("/search")}><Text>Save your current search</Text></Pressable>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16 }}
          data={searches}
          keyExtractor={(s) => s.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => openMenu(item.id)} accessibilityLabel={`Open options for ${item.name}`}>
              <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: "#eee" }}>
                <SavedSearchRow search={item} />
                <Text style={{ color: "#777", marginTop: 4 }}>(tap for options)</Text>
              </View>
            </Pressable>
          )}
        />
      )}

      <MoreMenu
        visible={menuOpen}
        onClose={()=>setMenuOpen(false)}
        onRun={()=>{ if (!active) return; router.push("/search"); updateSearch(active.id, { lastRunAt: new Date().toISOString() }); }}
        onRename={()=>{ if (!active) return; const newName = "Renamed search"; updateSearch(active.id, { name: newName }); }}
        onEditFilters={()=>{ if (!active) return; router.push("/search"); }}
        onToggleNotify={()=>{ if (!active) return; const cur = active.notifySettings?.newMatches ?? false; updateSearch(active.id, { notifySettings: { ...(active.notifySettings ?? {}), newMatches: !cur } }); }}
        notifyOn={!!active?.notifySettings?.newMatches}
        onArchive={()=>{ if (!active) return; updateSearch(active.id, { isArchived: !active.isArchived }); }}
        archived={!!active?.isArchived}
        onDelete={()=>{ if (!active) return; removeSearch(active.id); }}
      />
    </>
  );
}
