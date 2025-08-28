// components/EmptyState.tsx
import { View, Text, Pressable } from 'react-native';

export default function EmptyState({
  title,
  description,
  ctaLabel,
  onPress,
}: {
  title: string;
  description?: string;
  ctaLabel?: string;
  onPress?: () => void;
}) {
  return (
    <View className="items-center justify-center flex-1 px-12">
      <Text className="text-lg font-semibold mb-2">{title}</Text>
      {description ? <Text className="text-center text-neutral-600 mb-4">{description}</Text> : null}
      {ctaLabel && onPress ? (
        <Pressable onPress={onPress} className="bg-black px-5 py-3 rounded-2xl mt-2">
          <Text className="text-white font-semibold">{ctaLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
