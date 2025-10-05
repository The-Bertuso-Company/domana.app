// app.config.js
export default ({ config }) => {
  const projectId = "69982f4e-c195-48d6-923a-986f1b67cd1d";
  const updatesUrl = `https://u.expo.dev/${projectId}`;
  const runtimeVersion = "1.0.0"; // keep in sync with native config

  // optional: expose your local stage to the app if you want
  const appStage = process.env.APP_STAGE ?? "DEV";

  return {
    ...config,

    // App identity
    owner: "domana",
    name: "Domana",
    slug: "domana",
    version: "0.1.0",
    scheme: "domana",

    // Display & runtime
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    // EAS Update
    updates: {
      url: updatesUrl,
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.domana.app",
      buildNumber: "1.0.0",
      runtimeVersion, // keep consistent with your native Expo.plist if set
    },

    android: {
      package: "com.domana.app",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      runtimeVersion, // keep consistent with AndroidManifest meta-data if set
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      "expo-asset", // ✅ newly added
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
          static: true,
        },
      ],
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOADS_TOKEN,
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      ...(config?.extra || {}),
      appStage,
      router: {},
      mapboxAccessToken:
        "pk.eyJ1IjoidGhlYmVydHVzb2NvbXBhbnkiLCJhIjoiY21lOHdkcHJkMGs1NTJrcHZubTJ1cDQ5NyJ9.BTMxP06x844eVQtQHBRzaQ",
      eas: {
        projectId,
      },
    },

    icon: "./assets/images/icon.png",
  };
};
