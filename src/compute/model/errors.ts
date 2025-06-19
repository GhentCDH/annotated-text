export const Errors = {
  INVALID_ANNOTATION: "Invalid annotation ",
  INVALID_LINE: "Invalid line ",
} as const;

export type ErrorCode = keyof typeof Errors;
