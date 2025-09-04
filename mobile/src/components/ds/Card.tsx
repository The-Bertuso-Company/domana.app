/* src/components/ds/Card.tsx */
import * as React from 'react';
import { View, ViewStyle } from 'react-native';
import { c } from '@/src/design/theme';
import { useScheme } from '@/src/hooks/useScheme';

export type CardProps = {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  elevated?: boolean;
  tone?: 'light'|'dark';
  padding?: number;
  radius?: number;
};

export default function Card({ children, style, elevated = false, tone, padding = 16, radius = 12 }: CardProps){
  const scheme = tone ?? useScheme();
  const colors = c(scheme);
  const bg = (colors.surface?.hex ?? colors.bg.hex);

  const shadow = elevated ? (scheme==='dark'
    ? { shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 }
    : { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3 }
  ) : {};

  return (
    <View style={[{ backgroundColor: bg, borderRadius: radius, padding, borderWidth: elevated?0:1, borderColor: colors.border?.hex ?? '#E5E7EB' }, shadow as any, style]}>
      {children}
    </View>
  );
}
