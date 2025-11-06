import { z } from "zod/v4";
import { annotationColorSchema } from "./annotation.color";

export const annotationTargetSchema = z.union([
  z.literal("gutter"),
  z.literal("text"),
]);
export type AnnotationTarget = z.infer<typeof annotationTargetSchema>;
export const annotationIdSchema = z.union([z.string(), z.number()]);
export const annotationSchema = z.object({
  id: annotationIdSchema,
  start: z.number(),
  end: z.number(),
  // TODO should be implemented in v2 if needed
  label: z.string().optional(),
  color: annotationColorSchema.nullish(),
  textSelection: z.string().optional(),
});
export type AnnotationId = z.infer<typeof annotationIdSchema>;

/**
 * Represents an annotation with various properties.
 * @property {string} id - The unique identifier for the annotation.
 * @property {number} start - The start position of the annotation.
 * @property {number} end - The end position of the annotation.
 * @property {string} [label] - An optional label for the annotation
 * @property {AnnotationColor} [color] - An optional color for the annotation.
 */
export type Annotation = z.infer<typeof annotationSchema>;

export const renderSchema = z.object({
  weight: z.number().optional(),
  isGutter: z.boolean(),
  render: z.string(), // Name of the renderer
  // TODO add more render options if needed
});

export const annotationDrawPath = z.object({
  border: z.string().optional(),
  fill: z.string().optional(),
});

export const dimensionsSchema = z.object({
  height: z.number(),
  x: z.number(),
  y: z.number(),
});

export const annotationDrawSchema = z.object({
  uuid: z.string(),
  annotationUuid: annotationIdSchema,
  lineNumber: z.number(),
  path: annotationDrawPath,
  draggable: z.object({
    start: dimensionsSchema.optional(),
    end: dimensionsSchema.optional(),
  }),
  height: dimensionsSchema,
  weight: z.number(),
});

export const textAnnotationSchema = annotationSchema.extend({
  _render: renderSchema,
  _annotationDraws: z.array(annotationDrawSchema).optional(),
});

export type TextAnnotation = z.infer<typeof textAnnotationSchema>;
