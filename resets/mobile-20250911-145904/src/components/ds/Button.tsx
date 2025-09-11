/* src/components/ds/Button.tsx */
import * as React from 'react';
import { Pressable, Text, ActivityIndicator, View, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import Icon from '../Icon';
import { c, s } from '@/src/design/theme';
import { useScheme } from '@/src/hooks/useScheme';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  size?: Size;
  leftIcon?: string; // IconName (from icons.gen.ts)
  rightIcon?: string;
  tone?: 'light'|'dark'; // override OS scheme
  fullWidth?: boolean;
};

const HEIGHT: Record<Size, number> = { sm: 36, md: 44, lg: 52 };
const PADDING_X: Record<Size, number> = { sm: 12, md: 16, lg: 18 };
const GAP: Record<Size, number> = { sm: 6, md: 8, lg: 10 };
const FONT: Record<Size, number> = { sm: 14, md: 16, lg: 17 };

export default function Button({
  title,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  tone,
  fullWidth,
}: ButtonProps) {
  const scheme = tone ?? useScheme();
  const colors = c(scheme);
  const onBrand = (colors as any).onBrand?.hex ?? '#ffffff';
  const border = colors.border?.hex ?? '#E5E7EB';
  const surface = colors.surface?.hex ?? colors.bg.hex;

  const baseStyle = {
    height: HEIGHT[size],
    paddingHorizontal: PADDING_X[size],
    borderRadius: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: GAP[size],
    borderWidth: variant === 'secondary' ? 1 : 0,
  };

  let bg = 'transparent';
  let fg = colors.text.hex;
  let bw = border;

  if (variant === 'primary') { bg = colors.brand.hex; fg = onBrand; }
  if (variant === 'secondary') { bg = surface; fg = colors.text.hex; bw = border; }
  if (variant === 'ghost') { bg = 'transparent'; fg = colors.brand.hex; }

  const handlePress = () => {
    if (disabled || loading) return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(()=>{});
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      android_ripple={{ color: scheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
      style={({ pressed }) => [
        { width: fullWidth ? '100%' : undefined },
        baseStyle,
        { backgroundColor: bg, borderColor: bw, opacity: (disabled ? 0.5 : 1) * (pressed ? 0.92 : 1) },
      ]}
    >
      {leftIcon ? <Icon name={leftIcon as any} size={FONT[size]+2} color={fg} /> : null}
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : (
        <Text style={{ color: fg, fontSize: FONT[size], fontWeight: '600' }}>{title}</Text>
      )}
      {rightIcon ? <Icon name={rightIcon as any} size={FONT[size]+2} color={fg} /> : null}
    </Pressable>
  );
}
