import React, { useMemo, useRef, useState } from "react";
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { track } from "../../lib/analytics";

const { width } = Dimensions.get("window");
const GALLERY_HEIGHT = Math.round(width * 0.66);

export function Gallery({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const smallRef = useRef<ScrollView>(null);
  const largeRef = useRef<ScrollView>(null);

  const safeImages = useMemo(() => images?.length ? images : [
    "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=1600&auto=format&fit=crop"
  ], [images]);

  function onMomentumEnd(e: any, setter: (n: number) => void) {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setter(i);
  }

  function openFull() {
    setOpen(true);
    track("tap_gallery", { i: index });
  }

  return (
    <>
      <Pressable onPress={openFull} accessibilityRole="imagebutton" accessibilityLabel="Open photo gallery">
        <ScrollView
          ref={smallRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => onMomentumEnd(e, setIndex)}
          style={{ width, height: GALLERY_HEIGHT, backgroundColor: "#111" }}
        >
          {safeImages.map((uri, i) => (
            <Image key={i} source={{ uri }} style={{ width, height: GALLERY_HEIGHT }} resizeMode="cover" />
          ))}
        </ScrollView>
        <View style={styles.counter}>
          <Text style={styles.counterText}>{index + 1}/{safeImages.length}</Text>
        </View>
      </Pressable>

      <Modal visible={open} onRequestClose={() => setOpen(false)} animationType="fade" transparent>
        <View style={styles.modalBg}>
          <ScrollView
            ref={largeRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => onMomentumEnd(e, setIndex)}
          >
            {safeImages.map((uri, i) => (
              <Image key={i} source={{ uri }} style={{ width, height: Math.round(width * 1.1) }} resizeMode="contain" />
            ))}
          </ScrollView>
          <View style={styles.modalTop}>
            <Text style={styles.modalCount}>{index + 1}/{safeImages.length}</Text>
            <Pressable style={styles.closeBtn} onPress={() => setOpen(false)} accessibilityRole="button" accessibilityLabel="Close gallery">
              <Text style={styles.closeTxt}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  counter: { position: "absolute", bottom: 8, right: 8, backgroundColor: "rgba(0,0,0,0.55)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  counterText: { color: "white", fontWeight: "600" },
  modalBg: { flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" },
  modalTop: { position: "absolute", top: 48, left: 16, right: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  modalCount: { color: "white", fontSize: 16, fontWeight: "600" },
  closeBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 999 },
  closeTxt: { color: "white", fontWeight: "600" },
});
