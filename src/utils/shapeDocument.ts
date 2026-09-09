type DatabaseDocument = {
  toObject(): Record<string, unknown>;
};

/**
 * Converts a Mongoose document into the public API response representation.
 *
 * @param document The Mongoose document to convert.
 * @param excludedFields Field names to remove from the response.
 * @returns A plain object with `id` instead of `_id` and no version key.
 */
export function shapeDocument(
  document: DatabaseDocument,
  excludedFields: string[] = [],
): Record<string, unknown> {
  const { _id, __v, ...data } = document.toObject();

  // Remove sensitive fields requested by the caller before returning the document.
  for (const field of excludedFields) {
    delete data[field];
  }

  return { id: String(_id), ...data };
}
