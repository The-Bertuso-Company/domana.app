import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../src/providers/toast';
try { require('../src/utils/monitoring'); } catch (e) {}

const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Slot />
        </ToastProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
