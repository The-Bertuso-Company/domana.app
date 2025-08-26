import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "../../theme";

export default function Button({ label, onPress }:{label:string; onPress:()=>void;}) {
  const { colors, spacing, font } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.primary,
        paddingVertical: spacing(1.75),
        paddingHorizontal: spacing(2),
        borderRadius: 12
      }}
    >
      <Text style={{ color: "#fff", textAlign: "center", fontWeight: font.weight.bold, fontSize: font.size.md }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
