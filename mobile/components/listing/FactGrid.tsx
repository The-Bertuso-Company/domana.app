import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Listing } from "../../types/listing";
import { formatMoney, formatNumber, metaRow } from "../../lib/format";

export function FactGrid({ listing }: { listing: Listing }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.price}>{formatMoney(listing.price)}</Text>
      <Text style={styles.address} numberOfLines={2}>
        {listing.address.line1}, {listing.address.city}{listing.address.state ? `, ${listing.address.state}` : ""} {listing.address.postalCode || ""}
      </Text>
      <Text style={styles.meta}>{metaRow(listing.beds, listing.baths, listing.sqft)}</Text>

      <View style={styles.grid}>
        <Row label="Lot size" value={listing.lot_sqft ? `${formatNumber(listing.lot_sqft)} sqft` : "—"} />
        <Row label="Type" value={listing.type || "—"} />
        <Row label="Year built" value={listing.year_built ? String(listing.year_built) : "—"} />
        <Row label="HOA (mo)" value={listing.hoa_dues != null ? formatMoney(listing.hoa_dues) : "—"} />
        <Row label="Property tax (yr)" value={listing.property_tax_annual != null ? formatMoney(listing.property_tax_annual) : "—"} />
        <Row label="Days on Domana" value={listing.days_on_domana != null ? String(listing.days_on_domana) : "—"} />
        <Row label="Status" value={listing.status || "—"} />
        <Row label="Source" value={listing.source || "—"} />
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  price: { fontSize: 28, fontWeight: "800" },
  address: { marginTop: 4, color: "#444", fontSize: 14 },
  meta: { marginTop: 6, color: "#666", fontSize: 14 },
  grid: { marginTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#e5e5e5" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#eee" },
  label: { color: "#666" },
  value: { fontWeight: "600" },
});
