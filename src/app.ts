import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDatabase } from "./db/index.ts";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

async function startServer(): Promise<void> {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Unable to start server", error);
  process.exitCode = 1;
});
