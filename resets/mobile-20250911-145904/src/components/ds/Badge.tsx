/* src/components/ds/Badge.tsx */
import * as React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { c } from '@/src/design/theme';
import { useScheme } from '@/src/hooks/useScheme';

type Tone = 'neutral' | 'brand' | 'error' | 'warning' | 'success';
type Variant = 'solid' | 'outline';

export type BadgeProps = {
  label: string;
  tone?: 'light'|'dark';
  color?: Tone;
  variant?: Variant;
  style?: ViewStyle | ViewStyle[];
};

export default function Badge({ label, tone, color='brand', variant='solid', style }: BadgeProps) {
  const scheme = tone ?? useScheme();
  const colors = c(scheme);
  const palette: Record<Tone, { bg: string; fg: string; bd: string }> = {
    neutral: { bg: colors.surface?.hex ?? colors.bg.hex, fg: colors.text.hex, bd: colors.border?.hex ?? '#E5E7EB' },
    brand: { bg: colors.brand.hex, fg: (colors as any).onBrand?.hex ?? '#fff', bd: colors.brand.hex },
    error: { bg: colors.error?.hex ?? '#EF4444', fg: '#fff', bd: colors.error?.hex ?? '#EF4444' },
    warning: { bg: colors.warning?.hex ?? '#F59E0B', fg: '#111', bd: colors.warning?.hex ?? '#F59E0B' },
    success: { bg: colors.success?.hex ?? '#10B981', fg: '#fff', bd: colors.success?.hex ?? '#10B981' },
  };
  const sw = palette[color];
  const bg = variant === 'solid' ? sw.bg : 'transparent';
  const fg = variant === 'solid' ? sw.fg : sw.bd;

  return (
    <View style={[{ alignSelf:'flex-start', paddingHorizontal:10, height:24, borderRadius:999, borderWidth:1, borderColor: sw.bd, backgroundColor: bg, justifyContent:'center' }, style]}>
      <Text style={{ color: fg, fontSize:12, fontWeight:'600' }}>{label}</Text>
    </View>
  );
}
