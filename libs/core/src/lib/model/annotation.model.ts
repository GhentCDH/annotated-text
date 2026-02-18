import { z } from 'zod/v4';
import { textLineSchema } from './line.model';
import {
  annotationDrawMetadataSchema,
  tagDrawMetadataSchema,
} from './draw.model';

export const annotationTargetSchema = z.union([
  z.literal('gutter'),
  z.literal('text'),
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
  renderStyle: z.any(),
});

export const styleDetailSchema = z.object({
  backgroundColor: z.string(),
  borderColor: z.string(),
  borderRadius: z.number(),
  borderWidth: z.number(),
  // Gutter styles
  width: z.number(),
  gap: z.number(),
  // Tag styles
  tagTextColor: z.string(),
  tagBorderColor: z.string(),
  tagBackgroundColor: z.string(),
  tagBorderWidth: z.number(),
});

export const styleSchema = z.object({
  default: styleDetailSchema,
  edit: styleDetailSchema,
  active: styleDetailSchema,
  hover: styleDetailSchema,
});

export type AnnotationStyle = z.infer<typeof styleSchema>;

export const renderSchema = z.object({
  weight: z.number().optional().nullish(),
  isGutter: z.boolean(),
  render: z.string(), // Name of the renderer
  lines: z.array(textLineSchema).default([]),
});
export type TextRender = z.infer<typeof renderSchema>;

export const textAnnotationSchema = annotationSchema.extend({
  _render: renderSchema,
  _style: styleSchema,
  _drawMetadata: annotationDrawMetadataSchema,
  _tagMetadata: tagDrawMetadataSchema.nullish(),
});

export type TextAnnotation = z.infer<typeof textAnnotationSchema>;

export type BaseAnnotation = Pick<Annotation, 'id'>;
