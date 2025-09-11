import { z } from "zod";

// Accepts real UUIDs or any non-empty string for early dev.
export const ListingId = z.string().uuid().or(z.string().min(1));

export const ListingSummary = z.object({
  id: ListingId,
  title: z.string().min(1),
  price: z.number().nonnegative(),
  bedrooms: z.number().int().nonnegative(),
  baths: z.number().nonnegative(),
});
