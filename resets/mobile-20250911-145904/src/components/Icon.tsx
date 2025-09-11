// src/components/Icon.tsx
import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import { ICONS, IconName } from './icons.gen';

export type IconProps = Omit<SvgProps, 'width' | 'height' | 'color'> & {
  name: IconName;
  size?: number;
  color?: string;
};

export default function Icon({ name, size = 24, color, ...rest }: IconProps) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return <Cmp width={size} height={size} color={color} {...rest} />;
}
