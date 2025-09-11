/* src/components/ds/ListItem.tsx */
import * as React from 'react';
import { View, Text, Pressable, ViewStyle } from 'react-native';
import { c } from '@/src/design/theme';
import { useScheme } from '@/src/hooks/useScheme';
import Icon from '@/src/components/Icon';
import Avatar from './Avatar';

export type ListItemProps = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  leftIcon?: string;
  leftAvatarName?: string;
  rightChevron?: boolean;
  style?: ViewStyle | ViewStyle[];
  tone?: 'light'|'dark';
};

export default function ListItem({
  title, subtitle, onPress, leftIcon, leftAvatarName, rightChevron = true, style, tone
}: ListItemProps) {
  const scheme = tone ?? useScheme();
  const colors = c(scheme);

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: scheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
      style={({ pressed }) => [
        { flexDirection:'row', alignItems:'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12, backgroundColor: colors.surface?.hex ?? colors.bg.hex },
        { opacity: pressed ? 0.96 : 1 },
        style
      ]}
    >
      {leftIcon ? <Icon name={leftIcon as any} size={22} color={colors.brand.hex} /> : (leftAvatarName ? <Avatar name={leftAvatarName} size={36} /> : null)}
      <View style={{ flex:1 }}>
        <Text style={{ color: colors.text.hex, fontSize: 16, fontWeight: '600' }}>{title}</Text>
        {subtitle ? <Text style={{ color: colors.muted?.hex ?? colors.text.hex, fontSize: 13, marginTop: 2 }}>{subtitle}</Text> : null}
      </View>
      {rightChevron ? <Icon name="chevron-right" size={18} color={colors.muted?.hex ?? colors.text.hex} /> : null}
    </Pressable>
  );
}
