import SearchBar from "./components/SearchBar";
import Reveal from "./components/Reveal";

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

      {/* Features */}
      <section
        className="container"
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        <Reveal delay={60}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 10, fontWeight: 600 }}>Wide Property Selection</h3>
            <p className="muted">
              From city condos to beachfront villas, browse properties that match your lifestyle.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 10, fontWeight: 600 }}>User‑Friendly Search</h3>
            <p className="muted">
              Interactive maps and filters help you find the perfect place faster.
            </p>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 10, fontWeight: 600 }}>Trusted Connections</h3>
            <p className="muted">
              Connect with verified agents, sellers, and developers with confidence.
            </p>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
