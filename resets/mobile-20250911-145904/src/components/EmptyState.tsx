/* src/components/EmptyState.tsx */
import * as React from "react";
import { View, Text } from "react-native";
import Icon from "@/src/components/Icon";
import { c } from "@/src/design/theme";
import { useScheme } from "@/src/hooks/useScheme";

type Props = {
  icon?: string;
  title: string;
  message?: string;
  action?: React.ReactNode; // Button, Link, etc.
};

export default function EmptyState({ icon = "search", title, message, action }: Props) {
  const scheme = useScheme();
  const colors = c(scheme);
  return (
    <View style={{ alignItems: "center", padding: 24, gap: 8 }}>
      <View style={{ height: 56, width: 56, borderRadius: 28, alignItems: "center", justifyContent: "center",
        backgroundColor: colors.surface?.hex ?? colors.bg.hex, borderColor: colors.border?.hex ?? "rgba(0,0,0,0.1)", borderWidth: 1 }}>
        <Icon name={icon as any} size={24} color={colors.muted?.hex ?? colors.text.hex} />
      </View>
      <Text style={{ color: colors.text.hex, fontSize: 16, fontWeight: "700", textAlign: "center" }}>{title}</Text>
      {message ? <Text style={{ color: colors.muted?.hex ?? colors.text.hex, textAlign: "center" }}>{message}</Text> : null}
      {action}
    </View>
  );
}
