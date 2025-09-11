import { Modal, View, Text, Pressable, Platform } from "react-native";
import type { SortBy } from "../../features/saved/uiState";

const options: { key: SortBy; label: string; subtitle?: string }[] = [
  { key: "added_desc", label: "Added (new → old)" },
  { key: "price_asc", label: "Price (low → high)" },
  { key: "price_desc", label: "Price (high → low)" },
  { key: "psf_asc", label: "$/sqft (low → high)" },
  { key: "beds_desc", label: "Beds (high → low)" },
  { key: "baths_desc", label: "Baths (high → low)" },
  { key: "sqft_desc", label: "Sqft (high → low)" },
  { key: "distance_asc", label: "Distance (near → far)" },
];

export function SortMenu({
  visible, onClose, value, onChange,
}: {
  visible: boolean;
  value: SortBy;
  onClose: () => void;
  onChange: (s: SortBy) => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "#0006", justifyContent: "center", padding: 24 }} onPress={onClose}>
        <View style={{ backgroundColor: "white", borderRadius: 16, padding: 12 }}>
          <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 8 }}>Sort by</Text>
          {options.map((opt) => (
            <Pressable key={opt.key} onPress={() => { onChange(opt.key); onClose(); }}>
              <View style={{ paddingVertical: 10 }}>
                <Text style={{ fontSize: 15 }}>
                  {value === opt.key ? (Platform.OS === "ios" ? "✓ " : "[x] ") : "    "}
                  {opt.label}
                </Text>
                {!!opt.subtitle && <Text style={{ color: "#666" }}>{opt.subtitle}</Text>}
              </View>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}
