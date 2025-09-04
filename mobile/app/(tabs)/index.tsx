import { useColorScheme, View, Text, FlatList, Pressable, Alert } from "react-native";

/* --- inline DS theme (auto) --- */
const __TH_LIGHT = { bg:"#FFFFFF", surface:"#F7F7FA", card:"#FFFFFF", border:"#E6E6EB", text:"#0B0B0F", muted:"#6B6B76", primary:"#E53935" };
const __TH_DARK  = { bg:"#0B0B0F", surface:"#111217", card:"#151821", border:"#2A2D35", text:"#F2F3F7", muted:"#A3A6AF", primary:"#FF4D4D" };
function __getTheme(scheme: "light" | "dark" | null | undefined){ return scheme === "dark" ? __TH_DARK : __TH_LIGHT; }

const DEMO = [
  { id: "1", price: 525000, beds: 3, baths: 2, sqft: 1420, addr: "101 Oak St", verified: 1 },
  { id: "2", price: 749000, beds: 4, baths: 3, sqft: 1980, addr: "202 Pine Ave", verified: 1 },
  { id: "3", price: 399000, beds: 2, baths: 2, sqft: 980,  addr: "303 Maple Ct", verified: 0 },
  { id: "4", price: 899000, beds: 5, baths: 4, sqft: 2850, addr: "404 Cedar Dr", verified: 1 },
  { id: "5", price: 615000, beds: 3, baths: 2, sqft: 1600, addr: "505 Birch Ln", verified: 0 },
  { id: "6", price: 458000, beds: 3, baths: 2, sqft: 1280, addr: "606 Spruce Rd", verified: 0 },
];

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const Empty = ({ th }: any) => (
  <View style={{ paddingHorizontal: 24, paddingTop: 48, alignItems: "center" }}>
    <Text style={{ color: th.text, fontSize: 18, fontWeight: "700" }}>No results yet</Text>
    <Text style={{ color: th.muted, marginTop: 6, textAlign: "center" }}>
      Try adjusting filters or pan the map.
    </Text>
  </View>
);

const Card = ({ th, item }: any) => {
  const label =
    `View ${item.beds} bed ${item.baths} bath ` +
    `${item.sqft.toLocaleString()} square feet at ${item.addr}, priced ${currency(item.price)}.`;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      focusable
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={() => Alert.alert("Listing", `${item.addr}\n${currency(item.price)}`)}
      style={({ pressed }) => [
        {
          backgroundColor: th.card,
          borderColor: th.border,
          borderWidth: 1,
          borderRadius: 12,
          padding: 12,
          marginHorizontal: 16,
          marginVertical: 8,
          minHeight: 56
        },
        pressed ? { opacity: 0.96 } : null,
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: th.text }}>
          {currency(item.price)}
        </Text>
        {!!item.verified && <Text style={{ color: "#0a7", fontWeight: "600" }}>Verified {item.verified}</Text>}
      </View>
      <Text style={{ color: th.muted, marginTop: 4 }}>
        {item.beds} bd • {item.baths} ba • {item.sqft.toLocaleString()} sqft
      </Text>
      <Text style={{ color: th.text, marginTop: 4 }}>{item.addr}</Text>
    </Pressable>
  );
};

export default function ExploreTabScreen() {
  const scheme = useColorScheme();
  const th = __getTheme(scheme);

  return (
    <View style={{ flex: 1, backgroundColor: th.bg }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 }}>
        <Text style={{ color: th.text, fontSize: 22, fontWeight: "700" }}>Explore</Text>
        <Text style={{ color: th.muted, marginTop: 4 }}>Demo listings (visual baseline)</Text>
      </View>

      <FlatList
        data={DEMO}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => <Card th={th} item={item} />}
        ListEmptyComponent={<Empty th={th} />}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}
