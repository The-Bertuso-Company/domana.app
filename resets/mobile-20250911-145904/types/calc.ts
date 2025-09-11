export interface CalcPrefs {
  downPct: number;          // % of price
  ratePct: number;          // annual interest rate %
  termYears: number;        // 30/20/15 etc.
  insAnnualPct: number;     // homeowners insurance as % of price per year
  pmiEnabled: boolean;      // allow PMI when LTV > 80%
  closingCostsPct: number;  // % of price
  currency?: string;        // e.g., "USD" | "PHP"
}

export interface CalcInputs {
  price: number;
  propertyTaxAnnual?: number; // from listing if available
  hoaMonthly?: number;        // from listing if available
  prefs: CalcPrefs;
}

export interface CalcOutputs {
  loanAmount: number;
  monthlyPI: number;
  monthlyTax: number;
  monthlyIns: number;
  monthlyHOA: number;
  monthlyPMI: number;
  monthlyTotal: number;
  cashToClose: number;
  ltv: number;
}