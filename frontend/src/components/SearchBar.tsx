"use client";

import { useState } from "react";

export default function SearchBar() {
  const [location, setLocation] = useState("");
  const [activePrice, setActivePrice] = useState<string | null>(null);

  const prices = ["₱1–3M", "₱3–6M", "₱6–10M", "₱10M+"];

  return (
    <section className="container" style={{ marginTop: 18 }}>
      <div
        className="card glass"
        style={{
          padding: 16,
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr auto",
          gap: 12,
          alignItems: "center",
        }}
      >
        {/* Location input */}
        <div>
          <label className="muted" style={{ display: "block", fontSize: 12, marginBottom: 6 }}>
            Location
          </label>
          <div style={{ position: "relative" }}>
            <input
              className="input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, neighborhood, or landmark"
            />
            <span
              aria-hidden
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                translate: "0 -50%",
                opacity: .7,
              }}
            >
              🔍
            </span>
          </div>
        </div>

        {/* Price quick chips */}
        <div>
          <label className="muted" style={{ display: "block", fontSize: 12, marginBottom: 6 }}>
            Price
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {prices.map((p) => (
              <button
                key={p}
                type="button"
                className={`chip ${activePrice === p ? "chip--active" : ""}`}
                onClick={() => setActivePrice(activePrice === p ? null : p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div style={{ alignSelf: "end" }}>
          <button className="btn-primary" style={{ width: 140 }}>
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
