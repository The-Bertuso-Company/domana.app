module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks", "prettier"],
  extends: [
    "expo",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended"
  ],
  rules: {
    "prettier/prettier": ["error"]
  },
  env: {
    "react-native/react-native": true,
    es2021: true
  }
};

