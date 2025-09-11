export default ({ config }) => ({
  ...config,
  name: "Domana",
  slug: "domana",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "domana",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.domana.app",
    buildNumber: "1.0.0"
  },

  android: {
    package: "com.domana.app",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true
  },

  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },

  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        // splash logo
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        // solid background
        backgroundColor: "#ffffff",
        // keep splash until we manually hide it
        // (gives you time to fade into search tab)
        static: true
      }
    ],
    [
      "@rnmapbox/maps",
      {
        RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOADS_TOKEN
      }
    ]
  ],

  experiments: {
    typedRoutes: true
  },

  extra: {
    mapboxAccessToken:
      "pk.eyJ1IjoidGhlYmVydHVzb2NvbXBhbnkiLCJhIjoiY21lOHdkcHJkMGs1NTJrcHZubTJ1cDQ5NyJ9.BTMxP06x844eVQtQHBRzaQ",
    router: {},
    eas: {
      projectId: "69982f4e-c195-48d6-923a-986f1b67cd1d"
    }
  }
});

