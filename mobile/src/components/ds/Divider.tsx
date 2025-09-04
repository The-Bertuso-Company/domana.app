/* src/components/ds/Divider.tsx */
import * as React from 'react';
import { View } from 'react-native';
import { c } from '@/src/design/theme';
import { useScheme } from '@/src/hooks/useScheme';

export default function Divider({ tone }: { tone?: 'light'|'dark' }) {
  const scheme = tone ?? useScheme();
  const colors = c(scheme);
  return <View style={{ height: 1, backgroundColor: colors.border?.hex ?? '#E5E7EB', opacity: 0.9 }} />;
}
