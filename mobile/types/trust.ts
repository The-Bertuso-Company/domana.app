export type TrustLevel = "UNVERIFIED" | "CLAIMED" | "VERIFIED_BASIC" | "VERIFIED_FULL";

export interface TrustProvenanceItem {
  stage: "source" | "ingest" | "validation" | "update";
  label: string;
  at?: string;      // ISO timestamp
  by?: string;      // system, service, or person
}

export interface TrustDoc {
  type: "deed" | "ownership" | "agent_id" | "brokerage_letter" | "utility" | string;
  label: string;
  verified: boolean;
}

export interface ListingTrust {
  listingId: string;
  level: TrustLevel;
  verified_at?: string;
  source?: string;      // e.g. "Lamudi feed"
  agent?: { name?: string; prc?: string; brokerage?: string };
  provenance: TrustProvenanceItem[];
  docs?: TrustDoc[];
  issues_count?: number;
}