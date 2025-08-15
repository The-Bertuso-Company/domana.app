import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domana",
  description: "Real estate made simple.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-[system-ui] page-bg">
        {/* Neutral, sticky header with red brand accent */}
        <header className="bg-white border-b border-subtle sticky top-0 z-50">
          <div className="container py-3 flex items-center justify-between">
            <div className="font-semibold tracking-wide text-[var(--color-primary)]">
              Domana
            </div>
            <nav className="flex items-center gap-5">
              <a className="nav-link" href="#">Buy</a>
              <a className="nav-link" href="#">Rent</a>
              <a className="nav-link" href="#">Sell</a>
              <a className="btn-outline" href="#">Login</a>
            </nav>
          </div>
        </header>

        <main className="container py-8">
          {children}
        </main>

        <footer className="mt-12 border-t border-subtle">
          <div className="container py-6 text-sm muted">
            © {new Date().getFullYear()} Domana. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
