import { z } from "zod/v4";

export const annotationColorSchema = z.object({
  border: z.string().optional(),
  background: z.string().optional(),
  borderActive: z.string().optional(),
  backgroundActive: z.string().optional(),
  gutterColor: z.string().optional(),
  color: z.string().optional(),
  tagBackground: z.string().optional(),
  tagColor: z.string().optional(),
});

/**
 * Represents the color properties for an annotation.
 *
 * @interface AnnotationColor
 *
 * @property {string} text - The color of the text.
 * @property {string} border - The color of the border.
 * @property {string} background - The color of the background.
 * @property {string} borderActive - The color of the border when active.
 * @property {string} backgroundActive - The color of the background when active.
 */
export type AnnotationColor = z.infer<typeof annotationColorSchema>;
