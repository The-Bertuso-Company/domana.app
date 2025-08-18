"use client";
import DomanaMap from "./DomanaMap";

type Listing = {
  id: number;
  title: string;
  price: string;
  longitude: number;
  latitude: number;
};

export default function ListingsGrid({ listings }: { listings: Listing[] }) {
  return (
    <div className="grid grid-cols-[60%_40%] h-[80vh] gap-4">
      {/* Map */}
      <DomanaMap
        markers={listings.map((l) => ({
          id: l.id,
          longitude: l.longitude,
          latitude: l.latitude,
          label: l.price,
        }))}
      />

      {/* Listings */}
      <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2">
        {listings.map((l) => (
          <div key={l.id} className="card">
            <h3>{l.title}</h3>
            <p>{l.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
