/* app/(tabs)/updates/index.tsx */
import * as React from "react";
import Screen from "@/src/components/Screen";
import EmptyState from "@/src/components/EmptyState";
import { Button, Typography, Divider } from "@/src/components/ds";
import { useToast } from "@/src/components/Toast";

export default function UpdatesScreen() {
  const toast = useToast();
  return (
    <Screen>
      <Typography.H1>Updates</Typography.H1>
      <Divider />
      <EmptyState
        icon="notifications"
        title="You’re all caught up"
        message="We’ll let you know when there’s activity on your saved homes and messages."
        action={
          <Button
            title="Enable push alerts"
            onPress={() => toast.show({ title: "Enabled", message: "You’ll get updates here.", icon: "check", variant: "success" })}
          />
        }
      />
    </Screen>
  );
}
