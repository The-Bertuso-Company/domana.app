import SearchBar from "../src/components/SearchBar";
import Reveal from "../src/components/Reveal";
import DomanaMap from "../src/components/DomanaMap";

const placeholderListings = [
  { id: 1, longitude: 121.05, latitude: 14.55, label: "₱2.5M" },
  { id: 2, longitude: 123.89, latitude: 10.31, label: "₱4.2M" },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <Reveal>
        <section
          className="hero-gradient container hero-frame"
          style={{
            textAlign: "center",
            color: "#fff",
            padding: "64px 24px",
            borderRadius: "16px",
            marginTop: 18,
          }}
        >
          <h1 style={{ fontSize: "2.4rem", lineHeight: 1.2, marginBottom: 16 }}>
            Find Your Dream Home in the Philippines
          </h1>
          <p style={{ color: "rgba(255,255,255,.95)", marginBottom: 24 }}>
            Domana makes buying, selling, and exploring real estate easy and accessible for everyone.
          </p>
          <a href="/listings" className="btn-primary">Browse Listings</a>
        </section>
      </Reveal>

      {/* Search bar */}
      <Reveal delay={80}>
        <SearchBar />
      </Reveal>

      {/* Map + Listings layout */}
      <section
        className="container"
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "60% 40%",
          gap: 20,
          minHeight: "500px",
        }}
      >
        {/* Map */}
        <div style={{ borderRadius: 12, overflow: "hidden" }}>
          <DomanaMap markers={placeholderListings} />
        </div>

        {/* Placeholder listings */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Featured Listings</h3>
          <ul>
            {placeholderListings.map((l) => (
              <li key={l.id} style={{ marginBottom: 8 }}>
                {l.label} – ({l.latitude}, {l.longitude})
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
