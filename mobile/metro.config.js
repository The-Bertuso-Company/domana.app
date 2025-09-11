const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, ".."); // covers mobile/ and mobile/mobile/

const config = getDefaultConfig(projectRoot);

// Allow Metro to resolve packages from the workspace root (pnpm hoisting)
config.watchFolders = Array.from(new Set([
  ...(config.watchFolders || []),
  workspaceRoot,
]));

// Prefer local node_modules, but also look in the workspace root
config.resolver = {
  ...(config.resolver || {}),
  nodeModulesPaths: [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
  ],
  // Keep a fallback for `import "_"` just in case the expo-router alias isn't applied
  extraNodeModules: {
    ...(config.resolver?.extraNodeModules || {}),
    _: path.join(projectRoot, "shims", "empty-module.js"),
  },
};

module.exports = config;
