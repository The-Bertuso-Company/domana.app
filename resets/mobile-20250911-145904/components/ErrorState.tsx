// components/ErrorState.tsx
import { View, Text, Pressable } from 'react-native';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again.',
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <View className="items-center justify-center flex-1 px-12">
      <Text className="text-lg font-semibold mb-2">{title}</Text>
      <Text className="text-center text-neutral-600 mb-4">{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} className="bg-black px-5 py-3 rounded-2xl mt-2">
          <Text className="text-white font-semibold">Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
