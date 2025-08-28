// app/(tabs)/search/index.tsx
import { Redirect } from "expo-router";

export default function SearchIndex() {
  return <Redirect href="/search/list" />;
}
