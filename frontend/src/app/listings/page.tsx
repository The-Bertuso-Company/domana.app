"use client";

import Image from "next/image";
import DomanaMap from "@/components/Map";
import styles from "./page.module.css"; // ✅ scoped CSS for this page

// Temporary demo data until DB or API is ready
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
    <section className={styles.fullBleed}>
      <div className={styles.listingsGrid}>
        {/* Map (left, 60%) */}
        <div className={styles.mapPane}>
          <DomanaMap
            markers={placeholderListings.map((l) => ({
              id: l.id,
              longitude: l.longitude,
              latitude: l.latitude,
              label: l.price,
            }))}
          />
        </div>

        {/* Listings (right, 40%) */}
        <aside className={styles.resultsPane}>
          <h2 className={styles.resultsTitle}>Homes for Sale</h2>

          <div className={styles.resultsGrid}>
            {placeholderListings.map((listing) => (
              <div key={listing.id} className={styles.card}>
                <Image
                  src={listing.image}
                  alt={`Listing in ${listing.location}`}
                  width={600}
                  height={380}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 12,
                    marginBottom: 12,
                    display: "block",
                  }}
                />
                <h3 className={styles.cardPrice}>{listing.price}</h3>
                <p className={styles.muted}>
                  {listing.beds} Beds • {listing.baths} Baths • {listing.size}
                </p>
                <p className={styles.muted}>{listing.location}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
