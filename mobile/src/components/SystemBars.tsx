/* src/components/SystemBars.tsx */
import * as React from "react";
import * as SystemUI from "expo-system-ui";
import { useScheme } from "@/src/hooks/useScheme";
import { c } from "@/src/design/theme";

export default function SystemBars() {
  const scheme = useScheme();
  const colors = c(scheme);
  React.useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.bg.hex).catch(() => {});
  }, [colors.bg.hex]);
  return null;
}
