// lib/api.ts
import { LISTINGS } from "@/data/listings";

export async function fetchListings(opts?: { shouldFail?: boolean; delayMs?: number }) {
  const delay = opts?.delayMs ?? 700;
  const shouldFail = !!opts?.shouldFail;

  await new Promise((r) => setTimeout(r, delay));

  if (shouldFail) {
    throw new Error("Network error (simulated). Please try again.");
  }

  // could randomize failures for testing:
  // if (Math.random() < 0.15) throw new Error("Flaky network (simulated).");

  return LISTINGS;
}
