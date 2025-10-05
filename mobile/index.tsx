import { AppRegistry } from "react-native";
import { ExpoRoot } from "expo-router";
import { name as appName } from "./app.json";

function App() {
  return <ExpoRoot />;
}

// register both names so either native name works
AppRegistry.registerComponent("main", () => App);
AppRegistry.registerComponent(appName, () => App);
