/** Wrap parsed data as a W3C annotation body with type and optional purpose */
export const toAnnotationBody = (
  parsed: Record<string, unknown>,
  id: string | undefined,
  purpose?: string,
): Record<string, unknown> => ({
  type: id ?? 'unknown',
  ...(purpose ? { purpose } : {}),
  ...parsed,
});
