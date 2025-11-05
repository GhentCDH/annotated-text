import {
  AnnotationDimension,
  AnnotationDraw,
  AnnotationDrawColors,
  TextAnnotationModel,
} from "../../compute/annotation.model";
import { TextAnnotationRender } from "../../compute/compute/TextAnnotationRender";
import { GutterAnnotationRender } from "../../compute/compute/GutterAnnotationRender";
import { UnderLineAnnotationRender } from "../../compute/compute/UnderLineAnnotationRender";
import { TextAnnotation, TextLine } from "../../model";
import { TextAdapter } from "../text/TextAdapter";
import { AnnotationAdapter } from "../annotation";

export type DefaultRenders = "highlight" | "underline";

export type AnnotationRenderFn<ANNOTATION> = (
  annotation: ANNOTATION,
) => AnnotationRender;

export const DefaultAnnotationRender = <ANNOTATION>(
  annotation: ANNOTATION,
  isGutter: boolean,
  rendererName: DefaultRenders,
): AnnotationRender => {
  return isGutter
    ? GutterAnnotationRender
    : rendererName === "highlight"
      ? TextAnnotationRender
      : UnderLineAnnotationRender;
};

/**
 * Function type for rendering annotations in the annotated text viewer.
 *
 * This function is called to determine how an annotation should be visually rendered,
 * including its position, appearance, and whether it should be displayed in the gutter
 * or inline with the text.
 *
 * @param lines - Array of text lines that the annotation spans across
 * @param parentDimensions - The x and y coordinates of the parent container
 * @param model - The text annotation model containing annotation state and configuration
 * @param annotation - The specific annotation being rendered
 * @param textAdapter - Adapter for interacting with the underlying text content
 * @param annotationAdapter - Adapter for managing annotation-specific operations and data
 *
 * @returns An object containing:
 * - `draws`: Array of draw instructions that define how to visually render the annotation
 * - `isGutter`: Boolean indicating whether the annotation should be rendered in the gutter (margin) or inline
 * - `startPosition`: The dimensional information for where the annotation rendering begins
 * - `color`: The color scheme to use when drawing the annotation
 *
 * @example
 * ```typescript
 * const myCustomRender: AnnotationRender = (
 *   lines,
 *   parentDimensions,
 *   model,
 *   annotation,
 *   textAdapter,
 *   annotationAdapter
 * ) => {
 *   return {
 *     draws: [{ type: 'underline', coordinates: [...] }],
 *     isGutter: false,
 *     startPosition: { x: 0, y: 0, width: 100, height: 20 },
 *     color: { primary: '#ff0000', secondary: '#ffcccc' }
 *   };
 * };
 * ```
 */
export type AnnotationRender = (
  lines: TextLine[],
  parentDimensions: { x: number; y: number },
  model: TextAnnotationModel,
  annotation: TextAnnotation,
  textAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
) => {
  draws: AnnotationDraw[];
  isGutter: boolean;
  startPosition: AnnotationDimension;
  color: AnnotationDrawColors;
};
