import { z } from "zod/v4";
import { annotationColorSchema } from "./annotation.color";

export const annotationTargetSchema = z.union([
  z.literal("gutter"),
  z.literal("text"),
]);
export type AnnotationTarget = z.infer<typeof annotationTargetSchema>;

export const annotationSchema = z.object({
  id: z.string(),
  start: z.number(),
  end: z.number(),
  // TODO should be implemented in v2 if needed
  label: z.string().optional(),
  // @Deprecated
  weight: z.number().optional(),
  target: annotationTargetSchema.optional(),
  color: annotationColorSchema.nullish(),
});

/**
 * Represents an annotation with various properties.
 * @property {string} id - The unique identifier for the annotation.
 * @property {number} start - The start position of the annotation.
 * @property {number} end - The end position of the annotation.
 * @property {string} [label] - An optional label for the annotation.
 * @property {AnnotationTarget} target - The target of the annotation.
 * @property {number} [weight] - An optional weight for the annotation.
 * @property {AnnotationColor} [color] - An optional color for the annotation.
 */
export type Annotation = z.infer<typeof annotationSchema>;

export const textAnnotationSchema = annotationSchema.extend({
  weight: z.number().optional(),
  isGutter: z.boolean().default(false),
});

export type TextAnnotation = z.infer<typeof textAnnotationSchema>;
