/* src/components/ds/Typography.tsx */
import * as React from 'react';
import { Text, TextProps } from 'react-native';
import { c } from '@/src/design/theme';
import { useScheme } from '@/src/hooks/useScheme';

type P = TextProps & { tone?: 'light'|'dark' };

function Base({ tone, style, ...rest }: P & { size: number; weight?: '400'|'500'|'600'|'700'; muted?: boolean }) {
  const scheme = tone ?? useScheme();
  const colors = c(scheme);
  const color = rest['muted'] ? (colors.muted?.hex ?? colors.text.hex) : colors.text.hex;
  return <Text {...rest} style={[{ color, fontSize: rest['size'], fontWeight: rest['weight'] ?? '400' }, style]} />;
}

export const H1 = (p: P) => <Base {...p} size={24} weight='700' />;
export const H2 = (p: P) => <Base {...p} size={20} weight='700' />;
export const H3 = (p: P) => <Base {...p} size={18} weight='600' />;
export const Body = (p: P) => <Base {...p} size={16} />;
export const Caption = (p: P) => <Base {...p} size={12} muted />;
export const Muted = (p: P) => <Base {...p} size={14} muted />;
