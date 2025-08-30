/* app/(tabs)/inbox/index.tsx */
import * as React from "react";
import Screen from "@/src/components/Screen";
import EmptyState from "@/src/components/EmptyState";
import { Typography, Divider, Button } from "@/src/components/ds";
import { useToast } from "@/src/components/Toast";

export default function InboxScreen() {
  const toast = useToast();
  return (
    <Screen>
      <Typography.H1>Inbox</Typography.H1>
      <Divider />
      <EmptyState
        icon="chatbubbles"
        title="No messages yet"
        message="When you contact sellers, your conversations will show up here."
        action={<Button title="Browse listings" onPress={() => toast.show({ message: "Try Search tab", icon: "search" })} />}
      />
    </Screen>
  );
}
