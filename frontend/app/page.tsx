export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Find your next home with <span className="text-blue-600">Domana</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          Simple, trustworthy property search built for Southeast Asia. No spam, no scams—just verified listings.
        </p>

        {/* Search */}
        <div className="mt-8 flex gap-3">
          <input
            type="text"
            placeholder="City, neighborhood, or property ID"
            className="w-full md:w-2/3 rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
            Search
          </button>
        </div>
      </section>

      {/* Sample cards */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-4 text-xl font-semibold">Featured listings</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5,6].map((i) => (
            <article key={i} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="h-40 bg-gray-200" />
              <div className="p-4">
                <h3 className="font-semibold">2BR Condo in BGC</h3>
                <p className="mt-1 text-sm text-gray-600">Taguig · 58 sqm</p>
                <p className="mt-2 font-bold">₱8.4M</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
