import { merge } from 'lodash-es';
import {
  type AnnotationStyleParams,
  DefaultAnnotationStyleParams,
} from './annotation.style';
import { type CustomAnnotationStyle } from './annotation.style.default';
import { BaseAnnotationDi } from '../../../di/BaseAnnotationDi';
import type { AnnotationModule } from '../../../di/annotation.module';

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
   * The style is stored in `origStyleMap` and immediately propagated
   * to all current render instances.
   *
   * @param name - The unique identifier for this style
   * @param style - The style configuration to associate with this name
   *
   * @example
   * ```ts
   * styles.registerStyle('error', {
   *   default: { backgroundColor: '#f44336', borderColor: '#f44336' },
   *   hover: { borderColor: '#d32f2f' },
   * });
   *
   * styles.registerStyle('warning', {
   *   default: { backgroundColor: '#ff9800', borderColor: '#ff9800' },
   * });
   * ```
   */
  registerStyle(name: string, style: CustomAnnotationStyle) {
    this.origStyleMap.set(name, style);
    this.annotationModule.getAllRenderInstances().forEach((render) => {
      render.annotationRenderStyle.registerStyle(name, style);
    });
  }

  /**
   * Propagates the current defaultStyleName, styleFn, and all registered styles
   * to every render instance returned by `annotationModule.getAllRenderInstances()`.
   *
   * Call this after adding new render instances to ensure they receive
   * the full style configuration.
   */
  updateAllStyles() {
    this.annotationModule.getAllRenderInstances().forEach((render) => {
      render.annotationRenderStyle.setDefaultStyleName(
        this.styleParams.defaultStyle,
      );
      render.annotationRenderStyle.setStyleFn(this.styleParams.styleFn);
      for (const [name, style] of this.origStyleMap.entries()) {
        render.annotationRenderStyle.registerStyle(name, style);
      }
    });
  }

  /**
   * Merges the given params into the current style params and
   * propagates the updated configuration to all render instances.
   *
   * @param params - Partial style params to merge (styleFn, defaultStyle)
   */
  setParams(params: Partial<AnnotationStyleParams<ANNOTATION>>) {
    this.styleParams = merge(this.styleParams, params);

    this.updateAllStyles();
  }
}
