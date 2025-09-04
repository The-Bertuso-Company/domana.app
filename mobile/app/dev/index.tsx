import { Link } from "expo-router";
import { ScrollView, View, Text, Pressable } from "react-native";

function Row({ title, subtitle, href }: { title: string; subtitle?: string; href: string }) {
  return (
    <Link href={href} asChild>
      <Pressable style={{ paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderColor: "#eee" }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>{title}</Text>
          {!!subtitle && <Text style={{ color: "#666", marginTop: 3 }}>{subtitle}</Text>}
        </View>
      </Pressable>
    </Link>
  );
}

export const options = { title: "Showcase" };

export default function DevShowcase() {
  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 12, color: "#666" }}>
          Quick links to major surfaces. Use "Seed demo data" first so Saved isn’t empty.
        </Text>
      </View>

      <Row title="Seed demo data" subtitle="Add a few Saved homes with snapshots" href="/dev/seed" />

      <View style={{ height: 12 }} />

      <Row title="Saved → Homes" subtitle="/saved/homes" href="/saved/homes" />
      <Row title="Saved → Searches" subtitle="/saved/searches" href="/saved/searches" />

      <View style={{ height: 12 }} />

      <Row title="Explore (Search/List/Map)" subtitle="Root Explore tab" href="/" />

      {/* add more as we land them: listing detail, compare, etc. */}
    </ScrollView>
  );
}
