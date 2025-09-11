import { View, ViewProps } from "react-native";
import { useTheme } from "../../providers/ThemeProvider";

export function Card({ style, ...rest }: ViewProps) {
  const t = useTheme();
  return (
    <View
      {...rest}
      style={[
        { backgroundColor: t.colors.surface, borderRadius: t.radius.lg, padding: t.spacing.lg, borderWidth: 1, borderColor: t.colors.border },
        style
      ]}
    />
  );
}
