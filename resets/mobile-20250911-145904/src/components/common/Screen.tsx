import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { useTheme } from "../../theme";

export default function Screen({
  children, scroll = false, align, justify
}: { children: React.ReactNode; scroll?: boolean; align?: any; justify?: any }) {
  const { colors, spacing } = useTheme();
  const content = (
    <View style={{ flex: 1, padding: spacing(2), alignItems: align, justifyContent: justify }}>
      {children}
    </View>
  );
  if (scroll)
    return <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}><ScrollView>{content}</ScrollView></SafeAreaView>;
  return <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>{content}</SafeAreaView>;
}
