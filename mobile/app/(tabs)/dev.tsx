import { Redirect } from "expo-router";

export const options = { title: "Showcase" };

export default function DevTabRedirect() {
  return <Redirect href="/dev" />;
}
