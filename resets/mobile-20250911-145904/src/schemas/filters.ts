import { z } from "zod";

export const FiltersSchema = z.object({
  priceMin: z.number().int().positive().optional(),
  priceMax: z.number().int().positive().optional(),
  beds: z.number().int().min(0).max(10).optional(),   // 0 means Any
  baths: z.number().int().min(0).max(10).optional(),  // 0 means Any
  propertyType: z.array(z.enum(["condo", "house", "townhouse", "lot"])).optional(),
  hasPhotos: z.boolean().optional(),
});

export type FiltersInput = z.input<typeof FiltersSchema>;
export type Filters = z.infer<typeof FiltersSchema>;

// helpers
export function normalizeFilters(input: FiltersInput): Filters {
  const parsed = FiltersSchema.safeParse(input);
  if (!parsed.success) return {};
  const f = parsed.data;
  // remove inversions like priceMin > priceMax
  if (f.priceMin && f.priceMax && f.priceMin > f.priceMax) {
    const tmp = f.priceMin; f.priceMin = f.priceMax; f.priceMax = tmp;
  }
  return Object.fromEntries(Object.entries(f).filter(([,v]) => v !== undefined && v !== null)) as Filters;
}
