import express from "express";

const app = express();
const port = process.env.PORT ?? 3000;

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/version", (_req, res) => {
  res.json({ version: "0.1.0" });
});

app.listen(port, () => {
  console.log(`Sample app listening on port ${port}`);
});
