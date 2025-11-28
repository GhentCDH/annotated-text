import { merge } from "lodash-es";
import { type AnnotationStyle, type AnnotationStyleParams, DefaultAnnotationStyleParams } from "./annotation.style";
import { Debugger } from "../../../utils/debugger";


/**
 * Manages annotation styles through a combination of a style function and a named style registry.
 *
 * This class provides a flexible system for resolving annotation styles:
 * 1. A `styleFn` determines the style for each annotation
 * 2. Named styles can be registered and referenced by string keys
 * 3. A default style serves as the ultimate fallback
 *
 * @typeParam ANNOTATION - The type of annotation objects this instance handles
 *
 * @example
 * ```ts
 * interface MyAnnotation {
 *   id: string;
 *   type: 'highlight' | 'comment' | 'correction';
 * }
 *
 * const styles = new StyleInstances<MyAnnotation>({
 *   styleFn: (annotation) => annotation.type,
 *   defaultStyle: { color: createAnnotationColor('#ccc') }
 * });
 *
 * // Register named styles matching annotation types
 * styles.registerStyle('highlight', { color: createAnnotationColor('#ffeb3b') });
 * styles.registerStyle('comment', { color: createAnnotationColor('#2196f3') });
 * styles.registerStyle('correction', { color: createAnnotationColor('#f44336') });
 *
 * // Resolve style for an annotation
 * const style = styles.getStyle({ id: '1', type: 'highlight' });
 * // Returns the 'highlight' style with yellow color
 * ```
 *
 * @example
 * ```ts
 * // Using direct style objects instead of named styles
 * const styles = new StyleInstances<MyAnnotation>({
 *   styleFn: (annotation) => {
 *     if (annotation.type === 'highlight') {
 *       return { color: createAnnotationColor('#ffeb3b') };
 *     }
 *     return null; // Use default style
 *   }
 * });
 * ```
 */
export class StyleInstances<ANNOTATION> {
  private readonly styleParams: AnnotationStyleParams<ANNOTATION>;
  protected readonly styleMap = new Map<string, AnnotationStyle>();

  /**
   * Registers a named style that can be referenced by the style function.
   *
   * When `styleFn` returns a string matching a registered name,
   * the corresponding style will be used for the annotation.
   *
   * @param name - The unique identifier for this style
   * @param style - The style configuration to associate with this name
   *
   * @example
   * ```ts
   * const styles = new StyleInstances<MyAnnotation>();
   *
   * styles.registerStyle('error', {
   *   color: createAnnotationColor('#f44336')
   * });
   *
   * styles.registerStyle('warning', {
   *   color: createAnnotationColor('#ff9800')
   * });
   * ```
   */
  registerStyle(name: string, style: AnnotationStyle) {
    this.styleMap.set(name, style);
  }

  constructor(
    public readonly params?: Partial<AnnotationStyleParams<ANNOTATION>>,
  ) {
    this.styleParams = merge(DefaultAnnotationStyleParams, params ?? {});
  }

  /**
   * Resolves the appropriate style for a given annotation.
   *
   * The resolution follows this priority:
   * 1. Call `styleFn` with the annotation
   * 2. If `styleFn` returns `null`, use the default style
   * 3. If `styleFn` returns a string, look up the named style in the registry
   *    - If found, return the registered style
   *    - If not found, log a warning and return the default style
   * 4. If `styleFn` returns an `AnnotationStyle` object, use it directly
   *
   * @param annotation - The annotation to resolve a style for
   * @returns The resolved {@link AnnotationStyle} for the annotation
   *
   * @example
   * ```ts
   * const styles = new StyleInstances<{ type: string }>({
   *   styleFn: (ann) => ann.type
   * });
   *
   * styles.registerStyle('important', {
   *   color: createAnnotationColor('#f44336')
   * });
   *
   * // Returns the 'important' registered style
   * styles.getStyle({ type: 'important' });
   *
   * // Returns default style (type not registered)
   * styles.getStyle({ type: 'unknown' });
   * ```
   */
  getStyle(annotation: ANNOTATION) {
    const style = this.styleParams.styleFn(annotation);
    if (style === null) {
      Debugger.verbose(
        "No style specified for annotation, returning default style.",
      );

      return this.styleParams.defaultStyle;
    }

    if (typeof style === "string") {
      const namedStyle = this.styleMap.get(style);
      if (!namedStyle) {
        Debugger.warn(
          "Style not found: " + style + ". Returning default style.",
        );
        return this.styleParams.defaultStyle;
      }
      return namedStyle;
    }

    return style;
  }
}
