import { Tabs } from 'expo-router';
import { flags } from '../../src/config/flags';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Explore' }} />
      {flags.SELL_TAB_ENABLED && (
        <Tabs.Screen name="sell/index" options={{ title: 'Sell' }} />
      )}
      {flags.PRO_TAB_ENABLED && (
        <Tabs.Screen name="pro/index" options={{ title: 'Pro' }} />
      )}
    </Tabs>
  );
}
