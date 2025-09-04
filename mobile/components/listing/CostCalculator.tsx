import React, { useEffect, useMemo, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { Listing } from "../../types/listing";
import { formatMoney } from "../../lib/format";
import { computePITI, estimateDefaults } from "../../lib/mortgage";
import { useMortgagePrefs } from "../../hooks/useMortgagePrefs";
import { track } from "../../lib/analytics";

function num(v: string) { const n = parseFloat(v.replace(/[, ]+/g, "")); return isFinite(n) ? n : 0; }
function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }

export function CostCalculator({ listing, openOnMount = false }: { listing: Listing; openOnMount?: boolean }) {
  const { prefs, save, loading } = useMortgagePrefs();
  const [open, setOpen] = useState(false);

  const currency = process.env.EXPO_PUBLIC_CURRENCY || "USD";
  const defaults = useMemo(() => estimateDefaults(listing.price, currency), [listing.price, currency]);

  // Inputs bound to UI
  const [dpPct, setDpPct] = useState(prefs.dpPct);
  const [rate, setRate] = useState(prefs.rate);
  const [termYears, setTermYears] = useState(prefs.termYears);
  const [taxAnnual, setTaxAnnual] = useState(listing.property_tax_annual ?? Math.round(defaults.taxAnnual));
  const [insAnnual, setInsAnnual] = useState(Math.round(defaults.insAnnual));
  const [hoaMonthly, setHoaMonthly] = useState(listing.hoa_dues ?? 0);
  const [pmiEnabled, setPmiEnabled] = useState(prefs.pmiEnabled);
  const [pmiRateAnnual, setPmiRateAnnual] = useState(prefs.pmiRateAnnual);
  const [extraPrincipal, setExtraPrincipal] = useState(0);

  // Open if deeplink flag is set
  useEffect(() => { if (openOnMount) { setOpen(true); track("open_calc", { listingId: listing.id, deeplink: true }); } }, [openOnMount]);

  // Calculated output
  const out = useMemo(() => computePITI({
    price: listing.price,
    dpPct: clamp(dpPct, 0, 100),
    rate: clamp(rate, 0, 40),
    termYears: clamp(termYears, 1, 40),
    taxAnnual: Math.max(0, taxAnnual),
    insAnnual: Math.max(0, insAnnual),
    hoaMonthly: Math.max(0, hoaMonthly),
    pmiEnabled, pmiRateAnnual,
    extraPrincipal: Math.max(0, extraPrincipal)
  }), [listing.price, dpPct, rate, termYears, taxAnnual, insAnnual, hoaMonthly, pmiEnabled, pmiRateAnnual, extraPrincipal]);

  function openSheet() {
    setOpen(true);
    track("open_calc", { listingId: listing.id });
  }

  async function saveAsDefault() {
    const next = {
      dpPct: clamp(dpPct, 0, 100),
      rate: clamp(rate, 0, 40),
      termYears: clamp(termYears, 1, 40),
      taxAnnualPct: taxAnnual / Math.max(listing.price, 1),
      insAnnualPct: insAnnual / Math.max(listing.price, 1),
      pmiRateAnnual: clamp(pmiRateAnnual, 0, 0.1),
      pmiEnabled
    };
    await save(next);
    track("save_calc_defaults", next as any);
    Alert.alert("Saved", "Defaults will prefill on future listings.");
  }

  // PITI segments for bar
  const segs = [
    { key: "PI", val: out.monthlyPI },
    { key: "Tax", val: out.monthlyTax },
    { key: "Ins", val: out.monthlyIns },
    { key: "HOA", val: out.monthlyHOA },
    { key: "PMI", val: out.monthlyPMI },
    { key: "Extra", val: extraPrincipal }
  ].filter(s => s.val > 0.01);

  const totalForFlex = segs.reduce((a, b) => a + b.val, 0) || 1;

  // === Telemetry polish: emit debounced input-change events ===
  useEffect(() => {
    const t = setTimeout(() => {
      track("update_calc_input", {
        listingId: listing.id,
        dpPct: clamp(dpPct, 0, 100),
        rate: clamp(rate, 0, 40),
        termYears: clamp(termYears, 1, 40),
        taxAnnual: Math.max(0, taxAnnual),
        insAnnual: Math.max(0, insAnnual),
        hoaMonthly: Math.max(0, hoaMonthly),
        pmiEnabled,
        pmiRateAnnual,
        extraPrincipal: Math.max(0, extraPrincipal)
      } as any);
    }, 600);
    return () => clearTimeout(t);
  }, [listing.id, dpPct, rate, termYears, taxAnnual, insAnnual, hoaMonthly, pmiEnabled, pmiRateAnnual, extraPrincipal]);
  // === end telemetry polish ===

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Estimate monthly</Text>

      <View style={styles.card}>
        <Text style={styles.total}>{formatMoney(out.monthlyTotal)}</Text>
        <Text style={styles.sub}>
          {["P&I", "Tax", "Ins", "HOA", "PMI"].filter(k => segs.find(s => s.key.startsWith(k.split("&")[0]))).join(" + ")}
        </Text>

        {/* bar */}
        <View style={styles.bar}>
          {segs.map((s, i) => (
            <View key={i} style={[styles.seg, { flex: s.val / totalForFlex }]} />
          ))}
        </View>

        <View style={styles.row}>
          <Pressable onPress={() => setRate(prev => clamp(+(+prev - 0.5).toFixed(2), 0, 40))} style={styles.chip}><Text style={styles.chipTxt}>-0.5% rate</Text></Pressable>
          <Pressable onPress={() => setRate(prev => clamp(+(+prev + 0.5).toFixed(2), 0, 40))} style={styles.chip}><Text style={styles.chipTxt}>+0.5% rate</Text></Pressable>
          <Pressable onPress={() => setDpPct(prev => clamp(prev + 5, 0, 100))} style={styles.chip}><Text style={styles.chipTxt}>+5% down</Text></Pressable>
        </View>

        <Pressable onPress={openSheet} style={styles.btn} accessibilityRole="button">
          <Text style={styles.btnTxt}>Open calculator</Text>
        </Pressable>
      </View>

      {/* Sheet */}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Monthly cost calculator</Text>

            <Field label="Price" value={formatMoney(listing.price)} editable={false} />
            <Field label="Down payment (%)" value={String(dpPct)} onChange={v => setDpPct(clamp(num(v), 0, 100))} kb="decimal-pad" />
            <Field label="Interest rate (%)" value={String(rate)} onChange={v => setRate(clamp(num(v), 0, 40))} kb="decimal-pad" />
            <RowOptions label="Term (years)" value={termYears} options={[30, 20, 15]} onChange={setTermYears} />

            <Field label="Property tax (year)" value={String(Math.round(taxAnnual))} onChange={v => setTaxAnnual(Math.max(0, Math.round(num(v))))} kb="number-pad" money />
            <Field label="Home insurance (year)" value={String(Math.round(insAnnual))} onChange={v => setInsAnnual(Math.max(0, Math.round(num(v))))} kb="number-pad" money />
            <Field label="HOA (month)" value={String(Math.round(hoaMonthly))} onChange={v => setHoaMonthly(Math.max(0, Math.round(num(v))))} kb="number-pad" money />

            <Toggle label="Include PMI" value={pmiEnabled} onChange={() => setPmiEnabled(!pmiEnabled)} />
            <Field label="PMI rate (annual, e.g. 0.005 = 0.5%)" value={String(pmiRateAnnual)} onChange={v => setPmiRateAnnual(clamp(num(v), 0, 0.1))} kb="decimal-pad" />

            <Field label="Extra principal (month)" value={String(Math.round(extraPrincipal))} onChange={v => setExtraPrincipal(Math.max(0, Math.round(num(v))))} kb="number-pad" money />

            <View style={styles.summary}>
              <Text style={styles.sumLine}>P&I: <Text style={styles.bold}>{formatMoney(out.monthlyPI)}</Text></Text>
              <Text style={styles.sumLine}>Tax: <Text style={styles.bold}>{formatMoney(out.monthlyTax)}</Text></Text>
              <Text style={styles.sumLine}>Ins: <Text style={styles.bold}>{formatMoney(out.monthlyIns)}</Text></Text>
              <Text style={styles.sumLine}>HOA: <Text style={styles.bold}>{formatMoney(out.monthlyHOA)}</Text></Text>
              {out.monthlyPMI > 0 ? <Text style={styles.sumLine}>PMI: <Text style={styles.bold}>{formatMoney(out.monthlyPMI)}</Text></Text> : null}
              <Text style={[styles.sumLine, { marginTop: 6 }]}>Total: <Text style={styles.bold}>{formatMoney(out.monthlyTotal)}</Text></Text>
              <Text style={styles.dim}>Cash to close (est.): {formatMoney(out.cashToClose)}</Text>
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
              <Pressable onPress={saveAsDefault} style={[styles.btnSmall, styles.btnPrimary]}><Text style={styles.btnPrimaryTxt}>Save as default</Text></Pressable>
              <Pressable onPress={() => setOpen(false)} style={[styles.btnSmall, styles.btnGhost]}><Text style={styles.btnGhostTxt}>Close</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Field({ label, value, onChange, kb = "default", money = false, editable = true }:
  { label: string; value: string; onChange?: (v: string) => void; kb?: any; money?: boolean; editable?: boolean }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        editable={editable}
        keyboardType={kb}
        value={value}
        onChangeText={(t) => onChange?.(t)}
        style={[styles.input, !editable && { backgroundColor: "#f5f5f5" }]}
      />
      {money ? <Text style={styles.dim}>Currency: {process.env.EXPO_PUBLIC_CURRENCY || "USD"}</Text> : null}
    </View>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: () => void }) {
  return (
    <Pressable onPress={onChange} style={styles.toggle}>
      <View style={[styles.switch, value ? styles.switchOn : styles.switchOff]} />
      <Text style={{ marginLeft: 10 }}>{label}: <Text style={{ fontWeight: "700" }}>{value ? "On" : "Off"}</Text></Text>
    </Pressable>
  );
}

function RowOptions({ label, value, options, onChange }: { label: string; value: number; options: number[]; onChange: (n: number) => void }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {options.map((opt) => (
          <Pressable key={opt} onPress={() => onChange(opt)} style={[styles.opt, value === opt && styles.optSel]}>
            <Text style={[styles.optTxt, value === opt && styles.optSelTxt]}>{opt}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  card: { backgroundColor: "white", borderRadius: 12, padding: 12, gap: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: "#eee" },
  total: { fontSize: 22, fontWeight: "800" },
  sub: { color: "#666" },
  bar: { height: 10, borderRadius: 999, overflow: "hidden", backgroundColor: "#eee", marginTop: 4, flexDirection: "row" },
  seg: { height: 10 },

  row: { flexDirection: "row", gap: 8, marginTop: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#f5f5f5", borderRadius: 999 },
  chipTxt: { fontWeight: "700", color: "#111" },

  btn: { marginTop: 8, alignSelf: "flex-start", backgroundColor: "#111", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  btnTxt: { color: "white", fontWeight: "800" },

  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "white", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: "88%" },
  handle: { alignSelf: "center", width: 40, height: 5, backgroundColor: "#ddd", borderRadius: 999, marginBottom: 8 },
  sheetTitle: { fontSize: 16, fontWeight: "800", marginBottom: 8 },

  fieldLabel: { fontWeight: "700", marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, color: "#111" },

  toggle: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  switch: { width: 36, height: 20, borderRadius: 999 },
  switchOn: { backgroundColor: "#10b981" },
  switchOff: { backgroundColor: "#d1d5db" },

  opt: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "#e5e5e5" },
  optSel: { backgroundColor: "#111", borderColor: "#111" },
  optTxt: { color: "#111", fontWeight: "700" },
  optSelTxt: { color: "white" },

  summary: { marginTop: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#eee", paddingTop: 8, gap: 2 },
  sumLine: { color: "#333" },
  dim: { color: "#666" },

  btnSmall: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  btnPrimary: { backgroundColor: "#0ea5e9" },
  btnPrimaryTxt: { color: "white", fontWeight: "800" },
  btnGhost: { backgroundColor: "#f5f5f5" },
  btnGhostTxt: { color: "#111", fontWeight: "800" },
});