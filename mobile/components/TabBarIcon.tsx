// components/TabBarIcon.tsx
import { Ionicons } from "@expo/vector-icons";

type Props = {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
};

export default function TabBarIcon({ name, color }: Props) {
  return <Ionicons name={name} size={22} color={color} />;
}
