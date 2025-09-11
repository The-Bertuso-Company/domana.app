export default ({ config }) => {
  const scheme = process.env.EXPO_PUBLIC_APP_SCHEME || "domana";
  const associated = process.env.EXPO_PUBLIC_ASSOC_DOMAINS
    ? process.env.EXPO_PUBLIC_ASSOC_DOMAINS.split(",").map(s => s.trim()).filter(Boolean)
    : ["applinks:domana.app"];

  return {
    ...config,
    scheme,
    extra: {
      ...config.extra,
      webBaseUrl: process.env.EXPO_PUBLIC_WEB_BASE_URL || "https://domana.app",
    },
    ios: {
      ...config.ios,
      associatedDomains: [...(config.ios?.associatedDomains || []), ...associated],
    },
    android: {
      ...config.android,
      intentFilters: [
        ...(config.android?.intentFilters || []),
        {
          action: ["VIEW"],
          category: ["BROWSABLE", "DEFAULT"],
          data: [{ scheme: "https", host: "domana.app", pathPrefix: "/listing" }],
        },
        {
          action: ["VIEW"],
          category: ["BROWSABLE", "DEFAULT"],
          data: [{ scheme, host: "*", pathPrefix: "/listing" }],
        },
      ],
    },
  };
};