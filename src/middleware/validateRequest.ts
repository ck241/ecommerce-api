import type { RequestHandler } from "express";
import type { z } from "zod";

type RequestSchemas = {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
};

export function validateRequest(schemas: RequestSchemas): RequestHandler {
  return (request, response, next) => {
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
