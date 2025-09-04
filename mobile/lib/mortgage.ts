export interface CalcInput {
  price: number;
  dpPct: number;               // down payment % (0-100)
  rate: number;                // annual % interest, e.g., 6.75
  termYears: number;           // 30, 20, 15...
  taxAnnual?: number;          // annual property tax in currency units
  insAnnual?: number;          // annual homeowner insurance in currency units
  hoaMonthly?: number;         // monthly HOA fee
  pmiEnabled: boolean;         // include PMI if LTV > 80%
  pmiRateAnnual?: number;      // default 0.5% of loan / year
  extraPrincipal?: number;     // optional extra monthly principal
}

export interface CalcOutput {
  loanAmount: number;
  downPayment: number;
  monthlyPI: number;
  monthlyTax: number;
  monthlyIns: number;
  monthlyHOA: number;
  monthlyPMI: number;
  monthlyTotal: number;
  cashToClose: number;         // down + rough closing estimate (1.5% of price)
}

export function estimateDefaults(price: number, currency = process.env.EXPO_PUBLIC_CURRENCY || "USD") {
  // Very light heuristics for defaults by currency
  const c = currency.toUpperCase();
  if (c === "PHP") {
    return {
      taxAnnual: price * 0.006,      // ~0.6%
      insAnnual: price * 0.0015,     // ~0.15%
      pmiRateAnnual: 0.004           // 0.4%
    };
  }
  // USD-ish baseline
  return {
    taxAnnual: price * 0.010,        // ~1.0%
    insAnnual: price * 0.0035,       // ~0.35%
    pmiRateAnnual: 0.005             // 0.5%
  };
}

export function monthlyPI(principal: number, annualRatePct: number, termYears: number) {
  if (principal <= 0) return 0;
  const r = (annualRatePct / 100) / 12;
  const n = termYears * 12;
  if (r === 0) return principal / n;
  const m = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return m;
}

export function computePITI(input: CalcInput): CalcOutput {
  const clean = (n: number) => (isFinite(n) && n > 0 ? n : 0);
  const price = clean(input.price);
  const dpPct = Math.max(0, Math.min(100, input.dpPct));
  const rate = Math.max(0, Math.min(40, input.rate));
  const termYears = Math.max(1, Math.min(40, input.termYears|0));

  const downPayment = price * (dpPct / 100);
  const loanAmount = Math.max(0, price - downPayment);

  const pi = monthlyPI(loanAmount, rate, termYears);

  const taxAnnual = clean(input.taxAnnual ?? 0);
  const insAnnual = clean(input.insAnnual ?? 0);
  const hoaMonthly = clean(input.hoaMonthly ?? 0);

  const monthlyTax = taxAnnual / 12;
  const monthlyIns = insAnnual / 12;

  const pmiRateAnnual = clean(input.pmiRateAnnual ?? 0.005);
  const ltv = loanAmount / Math.max(price, 1);
  const shouldPMI = !!input.pmiEnabled && ltv > 0.80;
  const monthlyPMI = shouldPMI ? (loanAmount * pmiRateAnnual) / 12 : 0;

  const extraPrincipal = clean(input.extraPrincipal ?? 0);

  const monthlyTotal = pi + monthlyTax + monthlyIns + hoaMonthly + monthlyPMI + extraPrincipal;
  const cashToClose = downPayment + (price * 0.015); // crude 1.5% estimate

  return {
    loanAmount, downPayment,
    monthlyPI: pi,
    monthlyTax, monthlyIns, monthlyHOA: hoaMonthly, monthlyPMI,
    monthlyTotal, cashToClose
  };
}