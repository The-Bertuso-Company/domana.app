import * as React from "react";
import { View } from "react-native";
import Screen from "@/src/components/Screen";
import { Chip, Divider, Typography } from "@/src/components/ds";
import { useScheme, useSchemeStore } from "@/src/hooks/useScheme";

export default function ThemeSettings() {
  useScheme(); // keeps SystemBars + colors in sync
  const { override, setOverride } = useSchemeStore();

  const Row: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>{children}</View>
  );

  return (
    <Screen>
      <Typography.H1>Theme</Typography.H1>
      <Divider />
      <Typography.Body>Choose how the app follows your device appearance.</Typography.Body>
      <Divider />
      <Row>
        <Chip label="System"  selected={override === "system"} onPress={() => setOverride("system")} />
        <Chip label="Light"   selected={override === "light"}  onPress={() => setOverride("light")} />
        <Chip label="Dark"    selected={override === "dark"}   onPress={() => setOverride("dark")} />
      </Row>
      <Divider />
      <Typography.Caption>
        Tip: Dev floating button cycles modes; long-press opens this screen.
      </Typography.Caption>
    </Screen>
  );
}
