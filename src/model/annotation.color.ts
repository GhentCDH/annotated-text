import { z } from "zod/v4";

export const annotationColorSchema = z.object({
  border: z.string(),
  background: z.string(),
  borderActive: z.string(),
  backgroundActive: z.string(),
  gutterColor: z.string(),
  color: z.string(),
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
