import type { CalcInputs, CalcOutputs, CalcPrefs } from "../types/calc";

const ENV = {
  currency: process.env.EXPO_PUBLIC_CURRENCY || "USD",
  defaultPMIannualPct: Number(process.env.EXPO_PUBLIC_PMI_ANNUAL_PCT || 0.5),      // 0.5%/yr
  defaultInsAnnualPct: Number(process.env.EXPO_PUBLIC_INSURANCE_ANNUAL_PCT || 0.3), // 0.3%/yr
  defaultClosingPct:  Number(process.env.EXPO_PUBLIC_CLOSING_COSTS_PCT || 3),       // 3% of price
};

export const defaultPrefs: CalcPrefs = {
  downPct: 20,
  ratePct: 6.5,
  termYears: 30,
  insAnnualPct: ENV.defaultInsAnnualPct,
  pmiEnabled: true,
  closingCostsPct: ENV.defaultClosingPct,
  currency: ENV.currency,
};

export function monthlyPI(loan: number, annualRatePct: number, years: number) {
  const r = (annualRatePct / 100) / 12;
  const n = years * 12;
  if (loan <= 0 || n <= 0) return 0;
  if (r <= 0) return loan / n;
  const pow = Math.pow(1 + r, n);
  return loan * (r * pow) / (pow - 1);
}

export function pmiMonthly(loan: number, ltv: number, pmiAnnualPct: number, enabled: boolean) {
  if (!enabled) return 0;
  if (ltv <= 0.80) return 0;
  const annual = loan * (pmiAnnualPct / 100);
  return annual / 12;
}

export function propertyTaxMonthly(annualTax?: number) {
  if (!annualTax || annualTax <= 0) return 0;
  return annualTax / 12;
}

export function insuranceMonthly(price: number, insAnnualPct: number) {
  if (price <= 0 || insAnnualPct <= 0) return 0;
  return (price * (insAnnualPct / 100)) / 12;
}

export function hoaMonthly(hoa?: number) {
  return Math.max(0, Number(hoa || 0));
}

export function cashToClose(price: number, down: number, closingCostsPct: number) {
  return down + (price * (closingCostsPct / 100));
}

export function computePITI(input: CalcInputs): CalcOutputs {
  const { price, propertyTaxAnnual, hoaMonthly: hoaM, prefs } = input;
  const down = price * (prefs.downPct / 100);
  const loan = Math.max(0, price - down);
  const ltv = price > 0 ? (loan / price) : 0;

  const pi = monthlyPI(loan, prefs.ratePct, prefs.termYears);
  const tax = propertyTaxMonthly(propertyTaxAnnual);
  const ins = insuranceMonthly(price, prefs.insAnnualPct);
  const hoa = hoaMonthly(hoaM);
  const pmi = pmiMonthly(loan, ltv, (process.env.EXPO_PUBLIC_PMI_ANNUAL_PCT ? Number(process.env.EXPO_PUBLIC_PMI_ANNUAL_PCT) : 0.5), prefs.pmiEnabled);

  const total = pi + tax + ins + hoa + pmi;
  const ctc = cashToClose(price, down, prefs.closingCostsPct);

  return {
    loanAmount: loan,
    monthlyPI: pi,
    monthlyTax: tax,
    monthlyIns: ins,
    monthlyHOA: hoa,
    monthlyPMI: pmi,
    monthlyTotal: total,
    cashToClose: ctc,
    ltv,
  };
}