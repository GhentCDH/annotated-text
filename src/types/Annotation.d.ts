import type { AnnotationColor } from "./AnnotationColor";

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
export type Annotation = {
  id: string;
  start: number;
  end: number;
  label?: string;
  target: AnnotationTarget;
  weight?: number;

  color?: AnnotationColor;
};

/**
 * Internal representation of an annotation. Enriched with the original annotation only supposed to used internally.
 */
export interface AnnotationInternal extends Annotation {
  class?: string;

  startsOnLine?: boolean;
  endsOnLine?: boolean;
}

export type AnnotationTarget = "gutter" | "text";
