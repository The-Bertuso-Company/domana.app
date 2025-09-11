/* src/components/ds/Avatar.tsx */
import * as React from 'react';
import { View, Image, Text } from 'react-native';
import { c } from '@/src/design/theme';
import { useScheme } from '@/src/hooks/useScheme';

export type AvatarProps = {
  size?: number;
  name?: string;        // used for initials fallback
  uri?: string;         // image url (optional)
  tone?: 'light'|'dark';
};

export default function Avatar({ size=40, name='?', uri, tone }: AvatarProps) {
  const scheme = tone ?? useScheme();
  const colors = c(scheme);
  const initials = name.trim().split(/\s+/).slice(0,2).map(s=>s[0]?.toUpperCase()).join('') || '?';
  const bg = colors.surface?.hex ?? colors.bg.hex;

  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size/2 }} />;
  }
  return (
    <View style={{ width: size, height: size, borderRadius: size/2, alignItems:'center', justifyContent:'center', backgroundColor: bg, borderWidth: 1, borderColor: colors.border?.hex ?? '#E5E7EB' }}>
      <Text style={{ color: colors.text.hex, fontWeight:'700' }}>{initials}</Text>
    </View>
  );
}
