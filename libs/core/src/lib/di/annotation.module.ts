import { type Container, type Token } from './container';
import { InternalEventListener } from '../events/internal/internal.event.listener';
import { EventListener } from '../events/event.listener';

import { Tag } from '../compute/draw/tag/tag';
import { SvgModel } from '../compute/model/svg.types';
import { type TextAdapter, TextAdapterToken } from '../adapter/text';
import { type AnnotationAdapter, AnnotationAdapterToken } from '../adapter/annotation';
import { AnnotationColors } from '../compute/model/annotation.colors';
import { Draw } from '../compute/draw/Draw';
import { DrawAnnotation } from '../compute/draw/annotations/DrawAnnotation';
import { EventAnnotations } from '../compute/draw/annotations/EventAnnotation';
import { ExternalEventSender } from '../events/send-event';
import { DrawText } from '../compute/draw/text/DrawText';

/**
 * Configuration required to create an AnnotationModule.
 */
export type AnnotationModuleConfig = {
  /** Adapter for accessing and manipulating text content */
  textAdapter: TextAdapter;
  /** Adapter for managing annotation data */
  annotationAdapter: AnnotationAdapter<any>;
};

/**
 * Scoped dependency injection module for annotation-related services.
 *
 * This module creates a scoped container that holds all services needed for
 * rendering and interacting with annotations. Each annotation component instance
 * should have its own AnnotationModule to ensure proper isolation.
 *
 * Services are registered with lazy instantiation - they're only created when
 * first requested via inject().
 *
 * @example
 * ```ts
 * const module = new AnnotationModule(rootContainer, {
 *   textAdapter: myTextAdapter,
 *   annotationAdapter: myAnnotationAdapter,
 * });
 *
 * const svgModel = module.inject(SvgModel);
 * ```
 */
export class AnnotationModule {
  /** Scoped container for this module's services */
  protected readonly container: Container;

  /**
   * Creates a new AnnotationModule with its own scoped container.
   *
   * @param parentContainer - Parent container (usually rootContainer) for hierarchical lookup
   * @param config - Configuration with required adapters
   */
  constructor(parentContainer: Container, config: AnnotationModuleConfig) {
    this.container = parentContainer.createScope();
    this.configure(config);
  }

  /**
   * Registers all annotation-related services with the container.
   * Order matters: SvgModel must be registered last as it depends on other services.
   */
  configure(config: AnnotationModuleConfig): void {
    // Register event listeners (no dependencies)
    this.container.register(InternalEventListener).register(EventListener);

    // Register adapters provided by the configuration
    this.container
      .register(TextAdapterToken, () => config.textAdapter)
      .register(AnnotationAdapterToken, () => config.annotationAdapter);

    // Register services that extend BaseAnnotationDi (need reference to this module)
    this.container
      .register(Tag, () => new Tag(this))
      .register(ExternalEventSender, () => new ExternalEventSender(this))
      .register(EventAnnotations, () => new EventAnnotations(this))
      .register(AnnotationColors, () => new AnnotationColors(this))
      .register(Draw, () => new Draw(this))
      .register(DrawAnnotation, () => new DrawAnnotation(this))
      .register(DrawText, () => new DrawText(this));

    // SvgModel must be registered last as it may depend on other services
    this.container.register(SvgModel, () => new SvgModel(this));
  }

  /**
   * Retrieve a service from this module's container.
   *
   * @param token - The token identifying the service (class, string, or symbol)
   * @returns The service instance
   */
  inject<T>(token: Token<T>): T {
    return this.container.get<T>(token);
  }

  /**
   * Destroy this module and clean up all service instances.
   * Should be called when the annotation component is unmounted.
   */
  destroy(): void {
    this.container.destroy();
  }

  /**
   * Register additional services with this module's container.
   * Allows extending the module with custom services.
   */
  register<T>(classRef: new (...args: any[]) => T, factory?: () => T): this;
  register<T>(token: string | symbol, factory: () => T): this;
  register<T>(tokenOrClass: any, factory?: () => T): this {
    this.container.register(tokenOrClass, factory);

    return this;
  }
}
