import "dotenv/config";
import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { connectDatabase } from "./db/index.ts";
import {
  categoryRouter,
  orderRouter,
  productRouter,
  userRouter,
} from "./routes/index.ts";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/users", userRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);

const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof Error && "code" in error && error.code === 11000) {
    response.status(409).json({ error: { message: "Email already exists" } });
    return;
  }

  console.error(error);
  response.status(500).json({ error: { message: "Internal server error" } });
};

app.use(errorHandler);

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
