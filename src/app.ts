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

/**
 * Reports whether the HTTP service is reachable.
 *
 * @param _request The incoming Express request.
 * @param response The Express response used to return the service status.
 * @returns A JSON response with the service status.
 */
app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/users", userRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);

// Convert expected database conflicts and unexpected errors into consistent JSON responses.
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

/**
 * Connects the database before accepting HTTP requests.
 *
 * @returns A promise fulfilled after the HTTP server starts listening.
 * @throws When the database connection cannot be established.
 */
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
