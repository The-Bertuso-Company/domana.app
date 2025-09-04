const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);
config.resolver = config.resolver || {};
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  tslib: path.resolve(__dirname, "src/polyfills/tslib.cjs"),
};

module.exports = config;
