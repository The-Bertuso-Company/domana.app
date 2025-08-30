import React from "react";
import { View, SafeAreaView, useWindowDimensions } from "react-native";
import MapWrapper from "../../../src/components/map/MapWrapper";
import SearchList from "../../../src/components/search/SearchList";

export default function SearchScreen() {
  const { height } = useWindowDimensions();
  const mapHeight = Math.round(height * 0.5);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ height: mapHeight }}>
        <MapWrapper />
      </View>
      <View style={{ flex: 1 }}>
        <SearchList />
      </View>
    </SafeAreaView>
  );
}
