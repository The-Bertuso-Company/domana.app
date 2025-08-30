/* app/(tabs)/me/index.tsx */
import * as React from "react";
import Screen from "@/src/components/Screen";
import { Button, Typography, Divider } from "@/src/components/ds";
import { router } from "expo-router";

export default function Me() {
  return (
    <Screen>
      <Typography.H1>Me</Typography.H1>
      <Divider />
      <Button title="Theme & Appearance" leftIcon="settings" onPress={() => router.push("/settings/theme")} />
      <Button title="Design System Showcase" leftIcon="sparkles" variant="secondary" onPress={() => router.push("/ds")} />
      <Button title="Sign out" variant="ghost" onPress={() => {}} />
    </Screen>
  );
}
