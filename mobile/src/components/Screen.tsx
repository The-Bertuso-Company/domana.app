import { PropsWithChildren } from "react";
import { SafeAreaView, View, ViewProps } from "react-native";

type ScreenProps = PropsWithChildren<ViewProps> & { padded?: boolean };

/** Simple safe-area screen wrapper used across tabs */
export default function Screen({ children, style, padded = true, ...rest }: ScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View {...rest} style={[{ flex: 1, padding: padded ? 16 : 0 }, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}
