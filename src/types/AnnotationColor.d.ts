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
export interface AnnotationColor {
  border: string;
  background: string;
  borderActive: string;
  backgroundActive: string;
  gutterColor: string;
  color: string;
}
