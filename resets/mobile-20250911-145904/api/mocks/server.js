/* Tiny mock server for quick contract testing (no DB). */
const express = require("express");
const app = express();
app.use(express.json());

app.get("/v1/listings", (req, res) => {
  res.set("X-Domana-Schema-Listing", "1.0.0");
  res.json({
    data: [
      { id: "LSEED0001", intent: "sale", status: "active", property_type: "condo" },
      { id: "LSEED0002", intent: "rent", status: "active", property_type: "condo" }
    ],
    next_cursor: null
  });
});

app.get("/v1/listings/:id", (req, res) => {
  res.json({ id: req.params.id, status: "active", intent: "sale" });
});

app.post("/v1/threads", (req, res) => res.status(201).json({ id: "THRD_MOCK", ...req.body }));
app.post("/v1/tours",   (req, res) => res.status(201).json({ id: "TOUR_MOCK", ...req.body }));

const port = process.env.PORT || 4300;
app.listen(port, () => console.log(`Mock API listening on :${port}`));
