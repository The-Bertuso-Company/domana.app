import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { track } from "../lib/analytics";

const KEY = "notes:v1";

export interface Note { id: string; listingId: string; text: string; createdAt: string; updatedAt?: string; }

type NotesMap = Record<string, Note[]>; // listingId -> notes[]

export function useNotesForListing(listingId: string) {
  const [map, setMap] = useState<NotesMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) setMap(JSON.parse(raw));
    } finally { setLoading(false); }
  })(); }, []);

  const notes = map[listingId] || [];

  const persist = async (next: NotesMap) => { setMap(next); await AsyncStorage.setItem(KEY, JSON.stringify(next)); };

  const add = useCallback(async (text: string) => {
    const note: Note = { id: cryptoRandomId(), listingId, text, createdAt: new Date().toISOString() };
    const next = { ...map, [listingId]: [note, ...(map[listingId] || [])] };
    await persist(next);
    track("add_note", { listingId, chars: text.length });
  }, [map, listingId]);

  const update = useCallback(async (id: string, text: string) => {
    const arr = map[listingId] || [];
    const nextArr = arr.map(n => n.id === id ? { ...n, text, updatedAt: new Date().toISOString() } : n);
    await persist({ ...map, [listingId]: nextArr });
  }, [map, listingId]);

  const remove = useCallback(async (id: string) => {
    const arr = map[listingId] || [];
    const nextArr = arr.filter(n => n.id !== id);
    await persist({ ...map, [listingId]: nextArr });
    track("remove_note", { listingId });
  }, [map, listingId]);

  return { loading, notes, add, update, remove };
}

function cryptoRandomId() {
  try {
    // @ts-ignore
    const b = (globalThis.crypto?.getRandomValues?.(new Uint8Array(8))) || null;
    if (b) return Array.from(b).map(x => x.toString(16).padStart(2, "0")).join("");
  } catch {}
  return Math.random().toString(36).slice(2);
}