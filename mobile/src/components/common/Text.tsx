import React from "react";
import { Text as RNText, TextProps } from "react-native";
import { useTheme } from "../../theme";

export default function Text({
  children, variant = "body", style, ...rest
}: TextProps & { variant?: "title" | "subtitle" | "body" }) {
  const { colors, font } = useTheme();
  const styles: any = {
    title: { fontSize: font.size.xl, fontWeight: font.weight.bold, color: colors.text },
    subtitle: { fontSize: font.size.md, color: colors.textMuted },
    body: { fontSize: font.size.md, color: colors.text }
  };
  return (
    <RNText {...rest} style={[styles[variant], style]}>
      {children}
    </RNText>
  );
}
