// metro.config.js
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// --- SVG as React components
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// --- Make Metro resolve from mobile/node_modules (pnpm-friendly)
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [path.join(__dirname, 'node_modules')];
config.resolver.extraNodeModules = {
  'expo-router': path.join(__dirname, 'node_modules', 'expo-router'),
};

module.exports = config;
