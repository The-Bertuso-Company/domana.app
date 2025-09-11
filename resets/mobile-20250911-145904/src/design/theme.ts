// src/design/theme.ts
// Loads your exported tokens.json and gives you tiny helpers.
// Works with Expo SDK 53 / React Native 0.79.

import tokens from './tokens.json';

export type Scheme = 'light' | 'dark';

// If you want stricter typing later, we can generate a Tokens type.
// For now, keep it simple and inferred.
export const theme = tokens as {
  color: Record<Scheme, Record<string, { hex: string; rgba: string; alpha: number }>>;
  type: Record<string, any>;
  spacing: number[];
  effect: Record<string, any>;
  motion: {
    duration: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>;
    easing: Record<'in' | 'out' | 'inOut' | 'emphasized', string>;
  };
};

// Quick helpers
export const c = (scheme: Scheme) => theme.color[scheme];     // colors by scheme
export const s = (i: number) => theme.spacing[i] ?? 0;        // spacing by index
export const isDark = (scheme: Scheme) => scheme === 'dark';
