import { Redirect } from "expo-router";

export const options = { title: "Saved" };

export default function SavedTabRedirect() {
  return <Redirect href="/saved/homes" />;
}
