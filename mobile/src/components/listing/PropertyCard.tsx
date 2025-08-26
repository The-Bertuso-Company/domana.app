import React from "react";
import { View, Image, Text } from "react-native";

export default function PropertyCard() {
  return (
    <View style={{ backgroundColor:"#fff", borderRadius:12, marginBottom:12, overflow:"hidden", elevation:2 }}>
      <Image source={require("../../assets/images/placeholder.png")} style={{ width:"100%", height:160 }} />
      <View style={{ padding:12 }}>
        <Text style={{ fontWeight:"700", fontSize:16 }}>₱5,000,000 • 3BR • 2BA • 120sqm</Text>
        <Text style={{ opacity:0.7, marginTop:4 }}>Mandaluyong, Metro Manila</Text>
      </View>
    </View>
  );
}
