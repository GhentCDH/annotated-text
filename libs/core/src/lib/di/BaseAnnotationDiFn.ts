import { type Token } from './container';
import { type AnnotationModule } from './annotation.module';
import { AnnotationAdapterToken, TextAdapterToken } from './tokens';
import { type TextAdapter } from '../adapter/text';
import { type AnnotationAdapter } from '../adapter/annotation';
import { SvgModel } from '../compute/model/svg.types';

import { type Annotation, type BaseAnnotation } from '../model';

/**
 * Base class for adapters and other services that need lazy module injection.
 *
 * Unlike BaseAnnotationDi, this class does not automatically inject services
 * in the constructor. Instead, the module is set later via setModule().
 * This avoids circular dependency issues when used by adapters.
 *
 * @example
 * ```ts
 * class MyAdapter extends BaseAnnotationDiFn {
 *   name = 'my-adapter';
 *
 *   doSomething() {
 *     const eventListener = this.inject(EventListener);
 *   }
 * }
 * ```
 */
export abstract class BaseAnnotationDiFn<
  ANNOTATION extends BaseAnnotation = Annotation,
> {
  protected annotationModule: AnnotationModule;
  svgModel: SvgModel;

  /**
   * Set the annotation module for dependency injection.
   * This must be called before using inject().
   */
  setModule(module: AnnotationModule) {
    this.annotationModule = module;
    this.svgModel = module.inject(SvgModel);
  }

  /**
   * Inject a dependency from the annotation module's container.
   *
   * @param token - The token identifying the service to inject
   * @returns The service instance
   */
  inject<T>(token: Token<T>): T {
    return this.annotationModule.inject(token);
  }

  protected get textAdapter() {
    return this.annotationModule.inject(TextAdapterToken) as TextAdapter;
  }
  protected get annotationAdapter() {
    return this.annotationModule.inject(
      AnnotationAdapterToken,
    ) as AnnotationAdapter<ANNOTATION>;
  }
}
