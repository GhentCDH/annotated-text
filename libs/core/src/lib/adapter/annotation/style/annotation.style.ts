import { createAnnotationColor } from '../../../utils/createAnnotationColor';

export const DefaultAnnotationStyle = {
  color: createAnnotationColor('#ff3b3b'),
};

/**
 * Represents the visual styling properties for an annotation.
 *
 * This type is derived from {@link DefaultAnnotationStyle} and defines
 * the structure of style objects used throughout the annotation system.
 *
 * @property color - The color configuration for the annotation, created via `createAnnotationColor`
 */
export type AnnotationStyle = typeof DefaultAnnotationStyle;

export const DefaultAnnotationStyleParams = {
  styleFn: (annotation: any): string | AnnotationStyle | null => null,
  defaultStyle: DefaultAnnotationStyle,
};

/**
 * Configuration parameters for the {@link StyleInstances} class.
 *
 * @typeParam ANNOTATION - The type of annotation objects this configuration handles
 *
 * @property styleFn - A function that determines the style for a given annotation.
 *   Can return:
 *   - `string` - A named style key to look up in the style registry
 *   - `AnnotationStyle` - A direct style object to use
 *   - `null` - Use the default style
 * @property defaultStyle - The fallback style used when `styleFn` returns `null`
 *   or when a named style is not found in the registry
 */
export type AnnotationStyleParams<ANNOTATION> =
  typeof DefaultAnnotationStyleParams & {
    styleFn: (annotation: ANNOTATION) => string | AnnotationStyle | null;
  };
