import { type Token } from './container';
import { type AnnotationModule } from './annotation.module';
import { AnnotationAdapterToken, TextAdapterToken } from './tokens';
import { InternalEventListener } from '../events/internal/internal.event.listener';
import { EventListener } from '../events/event.listener';
import { type TextAdapter } from '../adapter/text';
import { type AnnotationAdapter } from '../adapter/annotation';
import { type Annotation, type BaseAnnotation } from '../model';

/**
 * Abstract base class for services that participate in the annotation DI system.
 *
 * Provides convenient access to commonly used services (adapters, event listeners)
 * and a method to inject additional dependencies from the module's container.
 *
 * Classes extending BaseAnnotationDi automatically get:
 * - eventListener: For emitting events to external consumers
 * - internalEventListener: For internal event communication between services
 * - annotationAdapter: For accessing and modifying annotation data
 * - textAdapter: For accessing text content and styling information
 *
 * @example
 * ```ts
 * class MyAnnotationService extends BaseAnnotationDi {
 *   private readonly svgModel = this.inject(SvgModel);
 *
 *   doSomething() {
 *     const annotation = this.annotationAdapter.getAnnotation(id);
 *     this.eventListener.sendEvent('click', { annotation });
 *   }
 * }
 * ```
 */
export abstract class BaseAnnotationDi<
  ANNOTATION extends BaseAnnotation = Annotation,
> {
  /** Event listener for emitting events to external consumers (Vue component) */
  readonly eventListener = this.inject(EventListener);

  /** Internal event listener for communication between services */
  readonly internalEventListener = this.inject(InternalEventListener);

  /**
   * @param annotationModule - The module providing dependency injection for this service
   */
  constructor(protected readonly annotationModule: AnnotationModule) {}

  /**
   * Inject a dependency from the annotation module's container.
   * Use this to access other services registered with the module.
   *
   * @param token - The token identifying the service to inject
   * @returns The service instance
   */
  inject<T>(token: Token<T>) {
    return this.annotationModule.inject(token);
  }

  /** Adapter for accessing text content and styling */
  protected get textAdapter() {
    // don't move it out of the getter, as this can be changed on the fly when the module is configured, and we want to always get the latest version
    return this.inject(TextAdapterToken) as TextAdapter;
  }

  /** Adapter for accessing and modifying annotation data */
  protected get annotationAdapter() {
    // don't move it out of the getter, as this can be changed on the fly when the module is configured, and we want to always get the latest version
    return this.inject(AnnotationAdapterToken) as AnnotationAdapter<ANNOTATION>;
  }
}
