import { Text, View, ViewProps } from "react-native";
import { useTheme } from "../../providers/ThemeProvider";

export function Chip({ children, style, ...rest }: ViewProps & { children: string }) {
  const t = useTheme();
  return (
    <View
      {...rest}
      style={[
        { paddingVertical: 6, paddingHorizontal: 10, borderRadius: t.radius.xl ?? t.radius.lg, backgroundColor: t.colors.surface, borderWidth: 1, borderColor: t.colors.border },
        style
      ]}
    >
      <Text style={{ color: t.colors.muted, fontWeight: "600" }}>{children}</Text>
    </View>
  );
}
