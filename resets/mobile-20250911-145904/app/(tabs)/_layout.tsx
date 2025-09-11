import { Tabs } from "expo-router";
export default function TabsLayout(){
  return (
    <Tabs initialRouteName="explore" screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
    </Tabs>
  );
}
