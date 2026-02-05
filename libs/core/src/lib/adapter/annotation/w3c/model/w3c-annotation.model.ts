import { z } from 'zod/v4';

export const AnnotationTypeBody = z.object({
  type: z.enum(['AnnotationType']).default('AnnotationType'),
  textType: z.string(),
});

export const TextualBodySchema = z.object({
  type: z.enum(['TextualBody']).default('TextualBody'),
  format: z.enum(['text']).default('text'),
  language: z.string().optional(),
  value: z.string(),
  source: z.string().optional(),
});
export type TextualBody = z.infer<typeof TextualBodySchema>;

export const TextualBodyClassifyingPurposeEnumSchema = z.enum(['tagging']);
export type TextualBodyClassifyingPurpose = z.infer<
  typeof TextualBodyClassifyingPurposeEnumSchema
>;

export const TextualBodyClassifyingSchema = z.object({
  type: z.enum(['TextualBody']).default('TextualBody'),
  purpose: TextualBodyClassifyingPurposeEnumSchema.default('tagging'),
  value: z.string().optional(),
});
export type TextualBodyClassifying = z.infer<
  typeof TextualBodyClassifyingSchema
>;

export const SpecificResourceSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['SpecificResource']).default('SpecificResource'),
  purpose: z.enum(['describing']).default('describing'),
  //TODO  Value is not part of the w3c spec, but we need it to store the data for now f.e. the example
  value: z.any(),
  source: z.string().optional(),
});
export type SpecificResource = z.infer<typeof SpecificResourceSchema>;

export const W3CAnnotationBodySchema = AnnotationTypeBody.or(TextualBodySchema)
  .or(TextualBodyClassifyingSchema)
  .or(SpecificResourceSchema);
export type W3CAnnotationBody = z.infer<typeof W3CAnnotationBodySchema>;
export type W3CAnnotationBodyType = W3CAnnotationBody['type'];

export const TextPositionSelectorSchema = z.object({
  type: z.enum(['TextPositionSelector']).default('TextPositionSelector'),
  start: z.number(),
  end: z.number(),
});

export type TextPositionSelector = z.infer<typeof TextPositionSelectorSchema>;

export const TargetSelectorSchema = TextPositionSelectorSchema;
export type TargetSelector = z.infer<typeof TargetSelectorSchema>;
export const TextTargetSchema = z.object({
  source: z.string().optional(),
  textDirection: z.enum(['ltr', 'rtl']).optional(),
  type: z.enum(['Text']).default('Text'),
  processingLanguage: z.string().optional(),
  selector: TargetSelectorSchema.or(z.array(TargetSelectorSchema)).optional(),
});

export const W3CAnnotationTargetSchema = TextTargetSchema;
export type W3CAnnotationTarget = z.infer<typeof W3CAnnotationTargetSchema>;
export type W3CAnnotationTargetType = W3CAnnotationTarget['type'];

export const AnnotationContext = z
  .enum(['http://www.w3.org/ns/anno.jsonld'])
  .default('http://www.w3.org/ns/anno.jsonld');

export const W3CAnnotationSchema = z.object({
  id: z.string(),
  '@context': z.string().default('http://www.w3.org/ns/anno.jsonld'),
  motivation: z.enum(['classifying', 'tagging']).default('classifying'),
  body: z.array(W3CAnnotationBodySchema).or(W3CAnnotationBodySchema),
  target: z.array(W3CAnnotationTargetSchema).or(W3CAnnotationTargetSchema),
});
export type W3CAnnotation = z.infer<typeof W3CAnnotationSchema>;
