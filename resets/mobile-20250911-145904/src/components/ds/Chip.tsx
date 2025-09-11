/* src/components/ds/Chip.tsx */
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from '../Icon';
import { c } from '@/src/design/theme';
import { useScheme } from '@/src/hooks/useScheme';

type Kind = 'filled' | 'outline';
export type ChipProps = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  kind?: Kind;
  tone?: 'light'|'dark';
};

export default function Chip({
  label, selected, disabled, onPress, onClose, kind = 'outline', tone
}: ChipProps){
  const scheme = tone ?? useScheme();
  const colors = c(scheme);
  const border = colors.border?.hex ?? '#E5E7EB';
  const fg = selected ? (colors.onBrand?.hex ?? '#ffffff') : (kind==='outline' ? colors.text.hex : colors.text.hex);
  const bg = selected ? colors.brand.hex : (kind==='outline' ? 'transparent' : (colors.surface?.hex ?? colors.bg.hex));
  const bcol = selected ? colors.brand.hex : border;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({pressed})=>[
        { flexDirection:'row', alignItems:'center', gap:8, paddingHorizontal:12, height:36, borderRadius:999 },
        { backgroundColor: bg, borderWidth:1, borderColor: bcol, opacity:(disabled?0.5:1)*(pressed?0.92:1) }
      ]}
    >
      <Text style={{ color: fg, fontSize: 14 }}>{label}</Text>
      {onClose ? (
        <Pressable onPress={onClose} hitSlop={8}>
          <Icon name="close" size={16} color={fg} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}
