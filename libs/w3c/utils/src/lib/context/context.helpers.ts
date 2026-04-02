/**
 * Wrap parsed data as a W3C annotation body with `type` and optional `purpose`.
 *
 * @param parsed - The validated data object
 * @param id - The type identifier (falls back to `"unknown"` when undefined)
 * @param purpose - Optional annotation purpose (e.g. `"oa:tagging"`)
 * @returns A W3C annotation body object
 */
export const toAnnotationBody = (
  parsed: Record<string, unknown>,
  id: string | undefined,
  purpose?: string,
): Record<string, unknown> => ({
  type: id ?? 'unknown',
  ...(purpose ? { purpose } : {}),
  ...parsed,
});