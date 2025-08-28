// store/useAppStore.ts
import { create } from "zustand";

export type Message = { id: string; text: string; from: "me" | "them"; ts: number };
export type Thread = { threadId: string; propertyId?: string; last: string; messages: Message[] };

type State = {
  savedIds: string[];
  threads: Thread[];
  // selectors
  isSaved: (id: string) => boolean;
  // actions
  toggleSaved: (id: string) => void;
  openThreadForProperty: (propertyId: string) => string; // returns threadId
  addMessage: (threadId: string, text: string, from?: "me" | "them") => void;
};

const useAppStore = create<State>((set, get) => ({
  savedIds: [],
  threads: [],
  isSaved: (id) => get().savedIds.includes(id),
  toggleSaved: (id) =>
    set((s) => ({
      savedIds: s.savedIds.includes(id)
        ? s.savedIds.filter((x) => x !== id)
        : [...s.savedIds, id],
    })),
  openThreadForProperty: (propertyId) => {
    const existing = get().threads.find((t) => t.propertyId === propertyId);
    if (existing) return existing.threadId;

    const threadId = `thread-${propertyId}`;
    const now = Date.now();
    const starter: Thread = {
      threadId,
      propertyId,
      last: "Started conversation",
      messages: [{ id: String(now), text: "Hi! I'm interested.", from: "me", ts: now }],
    };
    set((s) => ({ threads: [starter, ...s.threads] }));
    return threadId;
  },
  addMessage: (threadId, text, from = "me") =>
    set((s) => ({
      threads: s.threads.map((t) =>
        t.threadId === threadId
          ? {
              ...t,
              messages: [...t.messages, { id: String(Date.now()), text, from, ts: Date.now() }],
              last: text,
            }
          : t
      ),
    })),
}));

export default useAppStore;
