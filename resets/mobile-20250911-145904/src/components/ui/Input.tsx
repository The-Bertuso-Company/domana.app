import { TextInput, TextInputProps } from "react-native";
import { useTheme } from "../../providers/ThemeProvider";

export function Input(props: TextInputProps) {
  const t = useTheme();
  return (
    <TextInput
      {...props}
      placeholderTextColor={t.colors.muted}
      style={[
        {
          borderWidth: 1,
          borderColor: t.colors.border,
          borderRadius: t.radius.lg,
          paddingHorizontal: t.spacing.lg,
          paddingVertical: 12,
          color: t.colors.text,
          backgroundColor: t.colors.bg,
          minHeight: 44
        },
        props.style
      ]}
    />
  );
}
