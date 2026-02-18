import { merge } from 'lodash-es';
import { type AnnotationStyleParams, DefaultAnnotationStyleParams } from './annotation.style';
import { type CustomAnnotationStyle } from './annotation.style.default';
import { BaseAnnotationDi } from '../../../di/BaseAnnotationDi';
import type { AnnotationModule } from '../../../di/annotation.module';

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
export class StyleInstances<ANNOTATION> extends BaseAnnotationDi {
  private styleParams = DefaultAnnotationStyleParams;
  protected readonly origStyleMap = new Map<string, CustomAnnotationStyle>();

  constructor(annotationModule: AnnotationModule) {
    super(annotationModule);
  }

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
  registerStyle(name: string, style: CustomAnnotationStyle) {
    // this.styleMap.set(name, getAnnotationStyle(this.defaultStyle, style));
    this.origStyleMap.set(name, style);
    this.annotationModule.getAllRenderInstances().forEach((render) => {
      render.annotationRenderStyle.registerStyle(name, style);
    });

    // TODO fix if we register a new renderer after registering styles, the new renderer should also have the styles registered
  }

  updateAllStyles() {
    this.annotationModule.getAllRenderInstances().forEach((render) => {
      render.annotationRenderStyle.setDefaultStyleName(
        this.styleParams.defaultStyle,
      );
      render.annotationRenderStyle.setStyleFn(this.styleParams.styleFn);
      for (const [name, style] of this.origStyleMap.entries()) {
        // TODO add the default style as well
        render.annotationRenderStyle.registerStyle(name, style);
      }
    });
  }

  setParams(params: Partial<AnnotationStyleParams<ANNOTATION>>) {
    this.styleParams = merge(this.styleParams, params);

    this.updateAllStyles();
  }
}
