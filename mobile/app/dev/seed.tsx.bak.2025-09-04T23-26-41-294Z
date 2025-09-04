import { useEffect } from "react";
import { router } from "expo-router";
import { useSavedStore } from "../../src/features/saved/store";

export const options = { title: "Seed demo data" };

export default function SeedDemoData() {
  useEffect(() => {
    const s = useSavedStore.getState();
    const now = new Date().toISOString();

    const demos = [
      { id: "demo-101", price: 525000, beds: 3, baths: 2, sqft: 1420, address: "101 Oak St" },
      { id: "demo-202", price: 749000, beds: 4, baths: 3, sqft: 1980, address: "202 Pine Ave" },
      { id: "demo-303", price: 399000, beds: 2, baths: 2, sqft: 980,  address: "303 Maple Ct" },
      { id: "demo-404", price: 899000, beds: 5, baths: 4, sqft: 2850, address: "404 Cedar Dr" },
    ];

    demos.forEach(d => {
      s.addHome({
        listingId: d.id,
        createdAt: now,
        tags: ["demo"],
        userNoteCount: 0,
        snapshot: { price: d.price, beds: d.beds, baths: d.baths, sqft: d.sqft, addressLine: d.address, verifiedTier: 1, reduced: false },
      });
    });

    // return to Showcase
    setTimeout(() => router.replace("/dev"), 300);
  }, []);

  return null;
}
