/* app/(tabs)/pro/index.tsx */
import * as React from "react";
import { View } from "react-native";
import Screen from "@/src/components/Screen";
import { Card, Button, Typography, Divider } from "@/src/components/ds";

export default function ProHub() {
  return (
    <Screen>
      <Typography.H1>Pro</Typography.H1>
      <Divider />
      <Card elevated>
        <Typography.H3>Manage Listings</Typography.H3>
        <Typography.Muted>Publish, edit, and track performance.</Typography.Muted>
        <View style={{ height: 8 }} />
        <Button title="Open manager" onPress={() => {}} />
      </Card>
      <Card elevated>
        <Typography.H3>Leads & CRM</Typography.H3>
        <Typography.Muted>Conversations, tours, pipeline stages.</Typography.Muted>
        <View style={{ height: 8 }} />
        <Button title="Open leads" variant="secondary" onPress={() => {}} />
      </Card>
      <Card elevated>
        <Typography.H3>Analytics</Typography.H3>
        <Typography.Muted>Views, saves, CTR, campaign ROI.</Typography.Muted>
        <View style={{ height: 8 }} />
        <Button title="View reports" variant="ghost" onPress={() => {}} />
      </Card>
    </Screen>
  );
}
