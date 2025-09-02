import React from "react";
import { View, Text } from "react-native";
import BottomSheet from "../system/BottomSheet";

type Props = { visible: boolean; onClose: () => void; };
export default function GallerySheet({ visible, onClose }: Props) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>Gallery (preview)</Text>
      <View style={{ height: 160, backgroundColor: "#eee", borderRadius: 12 }} />
    </BottomSheet>
  );
}
