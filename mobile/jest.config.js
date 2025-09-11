module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: { "^.+\\.[jt]sx?$": "babel-jest" },
  // pnpm + RN Flow => transform everything
  transformIgnorePatterns: [],
  testMatch: ["**/__tests__/**/*.test.(ts|tsx|js|jsx)"],
  moduleNameMapper: {
    "^expo(?:/.*)?$": "<rootDir>/__mocks__/expoMock.js",
    "^react-native-reanimated$": "<rootDir>/__mocks__/reanimatedMock.js",
    "^@react-native-async-storage/async-storage$": "@react-native-async-storage/async-storage/jest/async-storage-mock",
    "^react-native/Libraries/Animated/NativeAnimatedHelper$": "<rootDir>/__mocks__/NativeAnimatedHelper.js",
  },
};
