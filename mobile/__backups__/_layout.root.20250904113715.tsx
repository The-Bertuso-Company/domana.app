import '../src/utils/monitoring';
import { Stack } from 'expo-router';
import React from 'react';
import { ToastProvider, Toaster } from '../components/ui/toast';

export default function RootLayout() {
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toaster />
    </ToastProvider>
  );
}

