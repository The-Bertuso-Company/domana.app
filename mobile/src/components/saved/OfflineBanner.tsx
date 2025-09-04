import { View, Text } from "react-native";
import { useOnline } from "../../lib/net";
export function OfflineBanner() {
  const isOnline = useOnline();
  if (isOnline) return null;
  return (
    <View style={{ backgroundColor: "#111", padding: 8 }}>
      <Text style={{ color: "white", textAlign: "center" }}>Offline: changes will be saved locally</Text>
    </View>
  );
}
