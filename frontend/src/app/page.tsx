"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">Find Your Dream Home in the Philippines</h1>
        <p className="hero-subtitle">
          Domana makes buying, selling, and exploring real estate easy and accessible for everyone.
        </p>
        <Link href="/listings" className="btn-primary">
          Browse Listings
        </Link>
      </section>
    </main>
  );
}
