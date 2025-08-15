/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence Prisma/OpenTelemetry warnings during dev builds
  webpack: (config) => {
    const out = config;
    out.ignoreWarnings = [
      ...(out.ignoreWarnings || []),
      { module: /@opentelemetry\/instrumentation/ },
    ];
    return out; // <-- important
  },

  // Fix Next.js dev cross-origin warning on your network IP/ports
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://169.254.126.23:3000",
    "http://169.254.126.23:3001"
  ],
};

module.exports = nextConfig;
