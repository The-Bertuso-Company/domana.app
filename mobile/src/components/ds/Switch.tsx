/* src/components/ds/Switch.tsx */
import * as React from 'react';
import { Switch as RNSwitch, View, Text } from 'react-native';
import { c } from '@/src/design/theme';
import { useScheme } from '@/src/hooks/useScheme';

export type SwitchProps = {
  value: boolean;
  onValueChange: (v: boolean) => void;
  label?: string;
  tone?: 'light'|'dark';
  disabled?: boolean;
};

export default function Switch({ value, onValueChange, label, tone, disabled }: SwitchProps) {
  const scheme = tone ?? useScheme();
  const colors = c(scheme);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        thumbColor={value ? (colors.onBrand?.hex ?? '#fff') : '#fff'}
        trackColor={{ false: colors.border?.hex ?? '#CBD5E1', true: colors.brand.hex }}
        ios_backgroundColor={colors.border?.hex ?? '#CBD5E1'}
      />
      {label ? <Text style={{ color: colors.text.hex, fontSize: 14 }}>{label}</Text> : null}
    </View>
  );
}
