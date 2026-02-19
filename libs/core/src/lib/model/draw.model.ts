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

export const annotationDrawMetadataSchema = z.object({
  draws: z.array(annotationDrawSchema).default([]),
  dimensions: annotationDimensionSchema.optional(),
});

export const tagDrawMetadataSchema = z.object({
  label: z.string(),
  padding: z.number(),
  fontSize: z.number(),
});

export type TagDrawMetadata = z.infer<typeof tagDrawMetadataSchema>;
export type AnnotationDraw = z.infer<typeof annotationDrawSchema>;
export type AnnotationDrawPath = z.infer<typeof annotationDrawPath>;
export type AnnotationDrawMetadata = z.infer<
  typeof annotationDrawMetadataSchema
>;
export type AnnotationDimension = z.infer<typeof annotationDimensionSchema>;
export type Dimensions = z.infer<typeof dimensionsSchema>;
