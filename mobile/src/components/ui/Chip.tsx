import React from "react";
import { Pressable, Text, ViewStyle } from "react-native";

export function Chip({
  label,
  onPress,
  active = false,
  style,
}: { label: string; onPress?: () => void; active?: boolean; style?: ViewStyle }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: active ? "#D32F2F" : "#ddd",
          backgroundColor: active ? "#FBE9E7" : "#fff",
          marginRight: 8,
        },
        style,
      ]}
    >
      <Text style={{ fontWeight: "600", color: active ? "#B71C1C" : "#222" }}>{label}</Text>
    </Pressable>
  );
}
