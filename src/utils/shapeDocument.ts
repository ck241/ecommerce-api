type DatabaseDocument = {
  toObject(): Record<string, unknown>;
};

export function shapeDocument(
  document: DatabaseDocument,
  excludedFields: string[] = [],
): Record<string, unknown> {
  const { _id, __v, ...data } = document.toObject();

  for (const field of excludedFields) {
    delete data[field];
  }

  return { id: String(_id), ...data };
}
