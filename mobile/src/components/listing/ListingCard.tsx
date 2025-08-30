import * as React from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Listing } from "@/src/types";
import { c } from "@/src/design/theme";
import { useScheme } from "@/src/hooks/useScheme";
import { useFavs } from "@/src/state/favs";
import { Card, Chip, Typography } from "@/src/components/ds";
import { peso, sqm } from "@/src/utils/format";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = { listing: Listing };

export default function ListingCard({ listing }: Props) {
  const scheme = useScheme();
  const colors = c(scheme);
  const favs = useFavs();
  const [page, setPage] = React.useState(0);

  return (
    <Pressable
      onPress={() => router.push(`/listing/${listing.id}`)}
      style={{ borderRadius: 16, overflow: "hidden" }}
      android_ripple={{ color: scheme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
    >
      <Card elevated style={{ padding: 0 }}>
        {/* Media carousel */}
        <View style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: "hidden" }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={e => {
              const w = e.nativeEvent.layoutMeasurement.width;
              const x = e.nativeEvent.contentOffset.x;
              setPage(Math.round(x / w));
            }}
            scrollEventThrottle={16}
          >
            {listing.images.map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                style={{ width: "100%", height: 200 }}
                contentFit="cover"
                transition={300}
              />
            ))}
          </ScrollView>

          {/* dots */}
          <View style={{ position: "absolute", bottom: 8, alignSelf: "center", flexDirection: "row", gap: 6 }}>
            {listing.images.map((_, i) => (
              <View
                key={i}
                style={{
                  width: 6, height: 6, borderRadius: 3,
                  backgroundColor: i === page ? "white" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </View>

          {/* fav button (stop nav) */}
          <Pressable
            onPress={(e: any) => { e?.stopPropagation?.(); favs.toggle(listing.id); }}
            style={{
              position: "absolute", right: 10, top: 10,
              backgroundColor: "rgba(0,0,0,0.45)",
              height: 36, width: 36, borderRadius: 18,
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Ionicons
              name={favs.has(listing.id) ? "heart" : "heart-outline"}
              size={20}
              color="#fff"
            />
          </Pressable>
        </View>

        {/* body */}
        <View style={{ padding: 14, gap: 6 }}>
          <Typography.H3>{listing.title}</Typography.H3>
          <Typography.Body style={{ color: colors.muted?.hex }}>
            {listing.bedrooms} BR • {listing.baths} BA • {sqm(listing.area_sqm)}
          </Typography.Body>
          <Typography.H2>{peso(listing.price)}</Typography.H2>

          {listing.badges?.length ? (
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              {listing.badges.map((b, i) => (
                <Chip key={i} label={b} kind="outline" />
              ))}
            </View>
          ) : null}
        </View>
      </Card>
    </Pressable>
  );
}
