// components/TabBarIcon.tsx
import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color?: string;
  size?: number;
};

export default function TabBarIcon({ name, color, size = 24 }: Props) {
  return <Ionicons name={name} color={color} size={size} />;
}
