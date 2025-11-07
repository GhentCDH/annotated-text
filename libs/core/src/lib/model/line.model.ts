import { z } from "zod/v4";
import { v4 as uuidv4 } from "uuid";

export const lineSchema = z.object({
  start: z.number(),
  end: z.number(),
  text: z.string(),
  gutter: z.string().optional(),
});

export type Line = z.infer<typeof lineSchema>;

export const textLineSchema = lineSchema.extend({
  lineNumber: z.number(),
  uuid: z.string().default(uuidv4),
  maxLineWeight: z.number().default(0),
  flatText: z.string(),
  html: z.string(),
  element: z.any().optional(),
});

export type TextLine = z.infer<typeof textLineSchema> & {
  element?: HTMLElement;
};
