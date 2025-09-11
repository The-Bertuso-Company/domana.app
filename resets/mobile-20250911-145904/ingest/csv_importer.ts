/* Minimal CSV importer: maps columns to CanonicalListing and dumps a report.
   Requires: npm i csv-parse ajv @types/node (if you intend to run it). */
import { parse } from "csv-parse/sync";
import Ajv from "ajv";

type Listing = any; // shorten for stub
const ajv = new Ajv({ allErrors: true, strict: false });

export function importCsv(csv: string, map: (row: any)=>Listing) {
  const rows = parse(csv, { columns: true, skip_empty_lines: true });
  const out = []; const errors = [];
  for (const r of rows) {
    try {
      const listing = map(r);
      // TODO: compile & validate against listing.v1.json
      out.push(listing);
    } catch (e:any) { errors.push({ row: r, error: e.message }); }
  }
  return { ok: errors.length===0, count: out.length, errors, data: out };
}
