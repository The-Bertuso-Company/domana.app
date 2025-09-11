import * as React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { c } from "@/src/design/theme";
import Icon from "@/src/components/Icon";
import { useScheme, useSchemeStore } from "@/src/hooks/useScheme";

export default function ThemeToggleDev() {
  if (!__DEV__) return null;
  const scheme = useScheme();
  const colors = c(scheme);
  const { override, cycle } = useSchemeStore();
  const insets = useSafeAreaInsets();
  const icon = override === "system" ? "phone-portrait" : override === "light" ? "sunny" : "moon";

  return (
    <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
      <Pressable
        onPress={cycle}
        onLongPress={() => router.push("/settings/theme")}
        style={{
          position: "absolute",
          right: 16,
          bottom: insets.bottom + 84, // hover above tab bar
          height: 44, width: 44, borderRadius: 22,
          alignItems: "center", justifyContent: "center",
          backgroundColor: colors.surface?.hex ?? colors.bg.hex,
          borderWidth: 1, borderColor: colors.border?.hex ?? "rgba(0,0,0,0.1)",
          elevation: 3,
        }}
        android_ripple={{ color: scheme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
      >
        <Icon name={icon as any} size={20} color={colors.text.hex} />
      </Pressable>
    </View>
  );
}
