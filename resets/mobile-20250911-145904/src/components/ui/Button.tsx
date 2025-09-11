import { Pressable, Text, ViewStyle } from "react-native";
import { useTheme } from "../../providers/ThemeProvider";

type Props = {
  title: string;
  onPress: () => void;
  kind?: "primary" | "outline" | "ghost";
  style?: ViewStyle;
};

export function Button({ title, onPress, kind = "primary", style }: Props) {
  const t = useTheme();
  const base: ViewStyle = {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: t.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44
  };
  const variants: Record<string, ViewStyle> = {
    primary: { backgroundColor: t.colors.primary },
    outline: { borderWidth: 1, borderColor: t.colors.border, backgroundColor: "transparent" },
    ghost:   { backgroundColor: "transparent" }
  };
  const textColor = kind === "primary" ? "#fff" : t.colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[base, variants[kind], style]}
    >
      <Text style={{ color: textColor, fontWeight: "600" }}>{title}</Text>
    </Pressable>
  );
}
