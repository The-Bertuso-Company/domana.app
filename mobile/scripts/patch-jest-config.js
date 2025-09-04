const cfg = `
module.exports = {
  preset: "jest-expo",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: { "^.+\\\\.[jt]sx?$": "babel-jest" },
  transformIgnorePatterns: [],  // transform all for pnpm + RN
  testMatch: ["**/__tests__/**/*.test.(ts|tsx|js|jsx)"],
  moduleNameMapper: {
    "^expo(?:/.*)?$": "<rootDir>/__mocks__/expoMock.js",
    "^react-native-reanimated$": "<rootDir>/__mocks__/reanimatedMock.js",
    "^@react-native-async-storage/async-storage$": "@react-native-async-storage/async-storage/jest/async-storage-mock",
  },
};
`;
require("fs").writeFileSync("jest.config.js", cfg.trim() + "\n");
console.log("✔ jest.config.js rewritten with moduleNameMapper");
