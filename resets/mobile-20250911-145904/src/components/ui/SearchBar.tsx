import React from "react";
import { View, TextInput } from "react-native";

export default function SearchBar({ placeholder }:{ placeholder?: string }) {
  return (
    <View style={{ paddingVertical: 8 }}>
      <TextInput
        placeholder={placeholder || "Search"}
        style={{ backgroundColor: "#f1f3f5", padding: 12, borderRadius: 12 }}
      />
    </View>
  );
}
