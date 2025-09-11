import { useQuery } from "@tanstack/react-query";
import type { ListingTrust, TrustLevel } from "../types/trust";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

function fallbackTrust(id: string): ListingTrust {
  const levelCycle: TrustLevel[] = ["UNVERIFIED", "CLAIMED", "VERIFIED_BASIC", "VERIFIED_FULL"];
  // lightweight deterministic rotation for demos
  const idx = Math.abs(hashCode(id)) % levelCycle.length;
  const level = levelCycle[idx];

  return {
    listingId: id,
    level,
    verified_at: new Date().toISOString(),
    source: level === "UNVERIFIED" ? undefined : "Domana ingest (dev)",
    agent: level === "VERIFIED_FULL" ? { name: "Jane Cruz", prc: "12345", brokerage: "Domana Realty" } : undefined,
    provenance: [
      { stage: "source", label: level === "UNVERIFIED" ? "Community upload" : "Partner feed", at: timestamp(-5), by: "Lamudi/dev" },
      { stage: "ingest", label: "Parsed & normalized", at: timestamp(-4), by: "Domana ETL" },
      { stage: "validation", label: level === "UNVERIFIED" ? "Minimal checks" : "Source + agent validation", at: timestamp(-3), by: "Domana Validator" },
      { stage: "update", label: "Last updated", at: timestamp(-1), by: "Domana Sync" },
    ],
    docs: level === "VERIFIED_FULL"
      ? [
          { type: "deed", label: "Deed on file", verified: true },
          { type: "agent_id", label: "Agent PRC verified", verified: true },
          { type: "brokerage_letter", label: "Brokerage letter", verified: true },
        ]
      : level === "VERIFIED_BASIC"
      ? [{ type: "agent_id", label: "Agent/Source verified", verified: true }]
      : [],
    issues_count: 0,
  };
}

function timestamp(daysAgo: number) {
  return new Date(Date.now() + daysAgo * 86400000).toISOString();
}

function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  return h;
}

async function fetchTrust(id: string): Promise<ListingTrust> {
  if (!API_URL) {
    await new Promise(r => setTimeout(r, 200));
    return fallbackTrust(id);
  }
  const res = await fetch(`${API_URL}/listings/${encodeURIComponent(id)}/trust`);
  if (!res.ok) throw new Error(`Failed to load trust for ${id}`);
  return res.json();
}

export function useTrustByListingId(id: string) {
  return useQuery({
    queryKey: ["trustByListingId", id],
    queryFn: () => fetchTrust(id),
    staleTime: 24 * 60 * 60 * 1000, // 24h
  });
}