import { z } from "zod/v4";
import { annotationColorSchema } from "./annotation.color";
import { textLineSchema } from "./line.model";
import { annotationDrawMetadataSchema } from "./draw.model";

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

export const renderStyleSchema = z.object({
  color: annotationColorSchema,
  renderStyle: z.any(),
});

export type RenderStyle = z.infer<typeof renderStyleSchema>;

export const renderSchema = z.object({
  weight: z.number().optional(),
  isGutter: z.boolean(),
  render: z.string(), // Name of the renderer
  style: renderStyleSchema,
  lines: z.array(textLineSchema).default([]),
});

export const textAnnotationSchema = annotationSchema.extend({
  _render: renderSchema,
  _drawMetadata: annotationDrawMetadataSchema,
});

export type TextAnnotation = z.infer<typeof textAnnotationSchema>;
