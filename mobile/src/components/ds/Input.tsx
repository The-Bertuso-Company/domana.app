/* src/components/ds/Input.tsx */
import * as React from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';
import { c } from '@/src/design/theme';
import { useScheme } from '@/src/hooks/useScheme';
import Icon from '../Icon';

export type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (t: string) => void;
  helperText?: string;
  errorText?: string;
  secureTextEntry?: boolean;
  tone?: 'light'|'dark';
};

export default function Input({
  label, placeholder, value, onChangeText, helperText, errorText, secureTextEntry, tone
}: InputProps){
  const scheme = tone ?? useScheme();
  const colors = c(scheme);
  const [isSecure, setSecure] = React.useState(!!secureTextEntry);
  const border = errorText ? (colors.error?.hex ?? '#EF4444') : (colors.border?.hex ?? '#E5E7EB');
  const bg = colors.surface?.hex ?? colors.bg.hex;

  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={{ color: colors.muted?.hex ?? colors.text.hex, fontSize: 13 }}>{label}</Text> : null}
      <View style={{
        flexDirection:'row', alignItems:'center',
        borderWidth:1, borderColor:border, borderRadius:12, paddingHorizontal:12, backgroundColor:bg
      }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={(colors.muted?.hex ?? '#9CA3AF')}
          secureTextEntry={isSecure}
          style={{ flex:1, height:44, color: colors.text.hex, fontSize:16 }}
        />
        {secureTextEntry ? (
          <Pressable onPress={()=>setSecure(s=>!s)} hitSlop={8}>
            <Icon name={isSecure ? 'eye-off' as any : 'eye' as any} size={20} color={colors.muted?.hex ?? colors.text.hex} />
          </Pressable>
        ) : null}
      </View>
      {(errorText || helperText) ? (
        <Text style={{ color: errorText ? (colors.error?.hex ?? '#EF4444') : (colors.muted?.hex ?? colors.text.hex), fontSize: 12 }}>
          {errorText ?? helperText}
        </Text>
      ) : null}
    </View>
  );
}
