module.exports = {
  // minimal shims used by some libs; extend if needed
  Linking: { addEventListener: () => ({ remove: () => {} }), removeEventListener: () => {}, openURL: () => Promise.resolve() },
  Platform: { OS: "test", select: (v) => v.default ?? v.test ?? v },
  registerRootComponent: () => {},
  // router shim (if referenced indirectly)
  router: { push: () => {}, back: () => {}, replace: () => {}, navigate: () => {} },
};
