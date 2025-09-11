import { Tabs } from 'expo-router';
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Explore' }} />
      <Tabs.Screen name="sell/index" options={{ title: 'Sell' }} />
      <Tabs.Screen name="pro/index" options={{ title: 'Pro' }} />
    </Tabs>
  );
}
