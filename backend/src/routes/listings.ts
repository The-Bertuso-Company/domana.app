import { FastifyInstance } from "fastify";
import { prisma } from "../db.js";

export function registerListings(app: FastifyInstance) {
  app.get("/v1/listings/nearby", {
    schema: {
      querystring: {
        type: "object",
        properties: {
          lat: { type: "number" },
          lng: { type: "number" },
          radius: { type: "number", default: 2000 }
        },
        required: ["lat","lng"]
      }
    }
  }, async (req) => {
    const { lat, lng, radius } = (req as any).query as { lat:number; lng:number; radius:number };
    const rows = await prisma.$queryRawUnsafe(`
      SELECT id, title, price, lat, lng
      FROM "Listing"
      WHERE ST_DWithin(
        geom,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      )
      LIMIT 50;
    `, lng, lat, radius);
    return { count: rows.length, rows };
  });
}
