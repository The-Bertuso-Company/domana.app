// components/EmptyState.tsx
import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { c } from '@/src/design/theme';

type Props = {
  title?: string;
  subtitle?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  actionLabel?: string;
  onPress?: () => void;
  tone?: 'light' | 'dark';
};

export default function EmptyState({
  title = 'Nothing here yet',
  subtitle = 'Check back later.',
  icon = 'chatbubbles-outline',
  actionLabel,
  onPress,
  tone = 'light',
}: Props) {
  const colors = c(tone);
  const onBrand = (colors as any).onBrand?.hex ?? '#ffffff';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12, backgroundColor: colors.bg.hex }}>
      <Ionicons name={icon} size={40} color={colors.muted?.hex ?? colors.text.hex} />
      <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text.hex }}>{title}</Text>
      <Text style={{ fontSize: 14, color: colors.muted?.hex ?? colors.text.hex, textAlign: 'center' }}>{subtitle}</Text>

      {actionLabel && onPress ? (
        <Pressable
          onPress={onPress}
          style={{
            marginTop: 8,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: colors.brand.hex
          }}
        >
          <Text style={{ color: onBrand, fontWeight: '600' }}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
