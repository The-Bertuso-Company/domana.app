"use client";

import DomanaMap from "../../components/Map";

const placeholderListings = [
  {
    id: 1,
    price: "₱3,500,000",
    beds: 3,
    baths: 2,
    size: "120 sqm",
    location: "Quezon City, Metro Manila",
    image: "https://via.placeholder.com/600x380?text=Quezon+City+Home",
    longitude: 121.0437,
    latitude: 14.676,
  },
  {
    id: 2,
    price: "₱5,200,000",
    beds: 4,
    baths: 3,
    size: "180 sqm",
    location: "Cebu City, Cebu",
    image: "https://via.placeholder.com/600x380?text=Cebu+City+Home",
    longitude: 123.8854,
    latitude: 10.3157,
  },
  {
    id: 3,
    price: "₱2,900,000",
    beds: 2,
    baths: 1,
    size: "85 sqm",
    location: "Davao City, Davao del Sur",
    image: "https://via.placeholder.com/600x380?text=Davao+City+Home",
    longitude: 125.6117,
    latitude: 7.1907,
  },
  {
    id: 4,
    price: "₱4,800,000",
    beds: 3,
    baths: 2,
    size: "150 sqm",
    location: "Taguig City, Metro Manila",
    image: "https://via.placeholder.com/600x380?text=Taguig+City+Home",
    longitude: 121.0537,
    latitude: 14.5176,
  },
  {
    id: 5,
    price: "₱6,750,000",
    beds: 5,
    baths: 4,
    size: "220 sqm",
    location: "Makati City, Metro Manila",
    image: "https://via.placeholder.com/600x380?text=Makati+City+Home",
    longitude: 121.0244,
    latitude: 14.5547,
  },
];

export default function ListingsPage() {
  return (
    <section className="full-bleed">
      <div className="listings-grid">
        {/* Map (left) */}
        <div className="map-pane">
          <DomanaMap
            markers={placeholderListings.map((l) => ({
              id: l.id,
              longitude: l.longitude,
              latitude: l.latitude,
              label: l.price,
            }))}
          />
        </div>

        {/* Results (right) */}
        <aside className="results-pane">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: 16 }}>
            Homes for Sale
          </h2>

          <div className="results-grid">
            {placeholderListings.map((listing) => (
              <div key={listing.id} className="card">
                <Image /
                  src={listing.image}
                  alt={`Listing in ${listing.location}`}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 12,
                    marginBottom: 12,
                    display: "block",
                  }}
                />
                <h3 style={{ fontWeight: 700 }}>{listing.price}</h3>
                <p className="muted">
                  {listing.beds} Beds • {listing.baths} Baths • {listing.size}
                </p>
                <p className="muted">{listing.location}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
