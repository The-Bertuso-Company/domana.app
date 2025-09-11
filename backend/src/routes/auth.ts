import { FastifyInstance } from "fastify";

export function registerAuth(app: FastifyInstance) {
  // Decorate helper for protected routes
  // @ts-ignore
  app.decorate("authenticate", async (req: any, reply: any) => {
    try { await req.jwtVerify(); } catch { return reply.code(401).send({ error: "Unauthorized" }); }
  });

  app.post("/v1/auth/login", {
    schema: {
      summary: "Demo login",
      body: {
        type: "object",
        properties: { email: { type: "string" }, password: { type: "string" } },
        required: ["email","password"]
      }
    }
  }, async (request, _reply) => {
    const body = (request as any).body || {};
    const userId = "demo-user";
    const token = app.jwt.sign({ sub: userId, email: body.email }, { expiresIn: "1h" });
    return { access_token: token, token_type: "Bearer", expires_in: 3600 };
  });

  app.get("/v1/auth/me", 
    // @ts-ignore
    { preHandler: (app as any).authenticate }, 
    async (request: any) => {
      return { user: request.user };
    }
  );
}
