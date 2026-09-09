import type { RequestHandler } from "express";
import type { z } from "zod";

type RequestSchemas = {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
};

/**
 * Validates request data against optional Zod schemas before a controller runs.
 *
 * @param schemas Schemas for request body, route parameters, and query parameters.
 * @returns An Express middleware handler that returns a validation error or calls `next`.
 */
export function validateRequest(schemas: RequestSchemas): RequestHandler {
  return (request, response, next) => {
    // Parse each request location independently to return the relevant validation error.
    const results = [
      ["body", schemas.body?.safeParse(request.body)],
      ["params", schemas.params?.safeParse(request.params)],
      ["query", schemas.query?.safeParse(request.query)],
    ] as const;

    for (const [location, result] of results) {
      if (result && !result.success) {
        response.status(400).json({
          error: {
            message: `Validation failed for ${location}`,
            details: result.error.issues,
          },
        });
        return;
      }

      if (result?.success) {
        Object.assign(request[location as keyof typeof request], result.data);
      }
    }

    next();
  };
}
