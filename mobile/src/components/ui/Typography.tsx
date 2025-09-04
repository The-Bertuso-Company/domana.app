import { Text, TextProps } from "react-native";
import { useTheme } from "../../providers/ThemeProvider";

export function H1(props: TextProps) {
  const t = useTheme();
  return <Text {...props} style={[{ fontSize: t.type.h1, color: t.colors.text, fontWeight: "700" }, props.style]} />;
}
export function H2(props: TextProps) {
  const t = useTheme();
  return <Text {...props} style={[{ fontSize: t.type.h2, color: t.colors.text, fontWeight: "700" }, props.style]} />;
}
export function Body(props: TextProps) {
  const t = useTheme();
  return <Text {...props} style={[{ fontSize: t.type.body, color: t.colors.text }, props.style]} />;
}
export function Muted(props: TextProps) {
  const t = useTheme();
  return <Text {...props} style={[{ fontSize: t.type.caption, color: t.colors.muted }, props.style]} />;
}
