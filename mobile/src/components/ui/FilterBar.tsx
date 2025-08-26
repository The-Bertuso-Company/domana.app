import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Chip = ({ label }:{label:string}) => (
  <TouchableOpacity style={{ backgroundColor:"#eef2ff", paddingVertical:6, paddingHorizontal:10, borderRadius:16, marginRight:8 }}>
    <Text style={{ color:"#1e40af" }}>{label}</Text>
  </TouchableOpacity>
);

export default function FilterBar() {
  return (
    <View style={{ flexDirection:"row", marginBottom: 8 }}>
      <Chip label="Price" />
      <Chip label="Type" />
      <Chip label="Beds" />
      <Chip label="More" />
    </View>
  );
}
