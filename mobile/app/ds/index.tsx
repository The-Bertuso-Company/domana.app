/* app/ds/index.tsx */
import * as React from "react";
import Screen from "@/src/components/Screen";
import { View } from "react-native";
import { Button, Chip, Card, Input, Badge, Switch, Divider, Avatar, ListItem, Typography } from "@/src/components/ds";
import Icon from "@/src/components/Icon";
import { useToast } from "@/src/components/Toast";

export default function DSShowcase() {
  const toast = useToast();
  const [q, setQ] = React.useState("");
  const [enabled, setEnabled] = React.useState(true);

  return (
    <Screen>
      <Typography.H1>Design System — Showcase</Typography.H1>

      <Typography.H2>Inputs</Typography.H2>
      <Input label="Search" placeholder="Find things..." value={q} onChangeText={setQ} />
      <Divider />

      <Typography.H2>Chips & Badges</Typography.H2>
      <View style={{ flexDirection:"row", gap:8, flexWrap:"wrap" }}>
        <Chip label="All" selected />
        <Chip label="Nearby" />
        <Chip label="Deals" kind="filled" />
        <Badge label="New" />
        <Badge label="Sale" color="warning" variant="outline" />
        <Badge label="Error" color="error" />
      </View>
      <Divider />

      <Typography.H2>Card & Buttons</Typography.H2>
      <Card elevated>
        <Typography.H3>Card (elevated)</Typography.H3>
        <Typography.Muted>Surface / border / shadow tokens</Typography.Muted>
      </Card>
      <View style={{ flexDirection:"row", gap:12 }}>
        <Button title="Primary" onPress={() => toast.show({ title: "Saved", message:"Listing saved", icon:"check", variant:"success" })} />
        <Button title="Secondary" variant="secondary" onPress={() => toast.show({ title:"Heads up", message:"Secondary tapped", icon:"information-circle", variant:"info" })} />
        <Button title="Ghost" variant="ghost" onPress={() => toast.show({ title:"Ghost", message:"Tap!", variant:"warning", icon:"alert-circle" })} />
      </View>
      <Button title="Full width + icon" leftIcon="search" fullWidth onPress={() => toast.show({ message:"Searching…", icon:"search" })} />
      <Divider />

      <Typography.H2>Switch & List</Typography.H2>
      <Switch value={enabled} onValueChange={setEnabled} label="Enable alerts" />
      <ListItem title="Condo in BGC" subtitle="2BR • 68 m²" leftIcon="home" />
      <ListItem title="Mae Santos" subtitle="Replied 2h ago" leftAvatarName="Mae Santos" />
      <Divider />

      <Typography.H2>Avatars</Typography.H2>
      <View style={{ flexDirection:'row', gap:12 }}>
        <Avatar name="Mae Santos" />
        <Avatar name="John Dela Cruz" />
        <Avatar name="Domana App" />
      </View>
    </Screen>
  );
}
