import { z } from 'zod/v4';

export const annotationDrawPath = z.object({
  border: z.string().optional(),
  fill: z.string().optional(),
});

export const dimensionsSchema = z.object({
  height: z.number(),
  x: z.number(),
  y: z.number(),
});

export const annotationDimensionSchema = z.object({
  x: z.number(),
  y1: z.number(),
  y2: z.number(),
});

export const annotationDrawSchema = z.object({
  uuid: z.string(),
  annotationUuid: z.union([z.string(), z.number()]),
  lineNumber: z.number(),
  path: annotationDrawPath,
  draggable: z.object({
    start: dimensionsSchema.optional(),
    end: dimensionsSchema.optional(),
  }),
  height: dimensionsSchema,
  weight: z.number(),
});

export const annotationDrawColorSchema = z.object({
  fill: z.string().optional(),
  border: z.string().optional(),
  borderWidth: z.number().default(1),
});

export const tagColorSchema = z.object({
  text: z.string().optional(),
  fill: z.string().optional(),
  border: z.string().optional(),
  borderWidth: z.number().default(1),
});

export const annotationDrawColorsSchema = z.object({
  default: annotationDrawColorSchema,
  tag: tagColorSchema,
  active: annotationDrawColorSchema,
  hover: annotationDrawColorSchema,
  edit: annotationDrawColorSchema,
});

export const annotationDrawMetadataSchema = z.object({
  draws: z.array(annotationDrawSchema).default([]),
  dimensions: annotationDimensionSchema.optional(),
  color: annotationDrawColorsSchema.optional(),
});

export const tagDrawMetadataSchema = z.object({
  label: z.string(),
  padding: z.number(),
  fontSize: z.number(),
});

export type TagDrawMetadata = z.infer<typeof tagDrawMetadataSchema>;
export type AnnotationDraw = z.infer<typeof annotationDrawSchema>;
export type AnnotationDrawColor = z.infer<typeof annotationDrawColorSchema>;
export type AnnotationDrawColors = z.infer<typeof annotationDrawColorsSchema>;
export type AnnotationDrawPath = z.infer<typeof annotationDrawPath>;
export type AnnotationDrawMetadata = z.infer<
  typeof annotationDrawMetadataSchema
>;
export type AnnotationDimension = z.infer<typeof annotationDimensionSchema>;
export type Dimensions = z.infer<typeof dimensionsSchema>;
