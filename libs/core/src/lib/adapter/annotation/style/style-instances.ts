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
   *
   * @param name - The unique identifier for this style
   * @param style - The style configuration to associate with this name
   *
   * @example
   * ```ts
   * const styles = new StyleInstances<MyAnnotation>();
   *
   * styles.registerStyle('error', {
   *   default: { backgroundColor: '#f44336', borderColor: '#f44336' },
   *   hover: { borderWidth: 3 },
   * });
   *
   * styles.registerStyle('warning', {
   *   default: { backgroundColor: '#ff9800', borderColor: '#ff9800' },
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
