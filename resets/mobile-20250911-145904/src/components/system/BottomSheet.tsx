import React, { useEffect } from "react";
import { Modal, Pressable, View, Animated, Easing, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  snapHeight?: number; // px height; defaults to 60% of screen
  children: React.ReactNode;
};

export default function BottomSheet({ visible, onClose, snapHeight, children }: Props) {
  const insets = useSafeAreaInsets();
  const translateY = React.useRef(new Animated.Value(1000)).current;
  const height = snapHeight ?? 0; // 0 = auto

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 1000,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }} onPress={onClose} />
      <Animated.View
        style={{
          position: "absolute",
          left: 0, right: 0, bottom: 0,
          transform: [{ translateY }],
        }}>
        <View
          style={{
            maxHeight: "90%",
            padding: 16,
            paddingBottom: 16 + insets.bottom,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "white",
            ...(height ? { height } : {}),
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}>
          {children}
        </View>
      </Animated.View>
    </Modal>
  );
}
