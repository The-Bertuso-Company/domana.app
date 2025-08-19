import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import DomanaMap from "../src/components/DomanaMap";

export default function MapScreen() {
  // sample markers (Manila, Cebu, Davao)
  const markers = [
    { id: 1, longitude: 120.9842, latitude: 14.5995, label: "₱5M" },
    { id: 2, longitude: 123.8854, latitude: 10.3157, label: "₱3M" },
    { id: 3, longitude: 125.6114, latitude: 7.1907, label: "₱2.5M" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <DomanaMap markers={markers} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
