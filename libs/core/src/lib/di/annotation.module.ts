import { type Container, type Token } from './container';
import { AnnotationAdapterToken, TextAdapterToken } from './tokens';
import { type AnnotationAdapter } from '../adapter/annotation';
import { type AnnotationRender, type AnnotationRenderStyle } from '../adapter/annotation/renderer';
import { InternalEventListener } from '../events/internal/internal.event.listener';
import { EventListener } from '../events/event.listener';

import { Tag } from '../compute/draw/tag/tag';
import { SvgModel } from '../compute/model/svg.types';
import { DefaultSnapper, PlainTextAdapter, SnapperToken, TextAdapter } from '../adapter/text';
import { AnnotationColors } from '../compute/model/annotation.colors';
import { Draw } from '../compute/draw/Draw';
import { DrawAnnotation } from '../compute/draw/annotations/DrawAnnotation';
import { EventAnnotations } from '../compute/draw/annotations/EventAnnotation';
import { ExternalEventSender } from '../events/send-event';
import { DrawText } from '../compute/draw/text/DrawText';
import { MainContainer } from '../compute/model/maincontainer';
import { RenderInstances } from '../adapter/annotation/renderer/render-instances';
import { TagRenderer } from '../tag/TagRenderer';
import { StyleInstances } from '../adapter/annotation/style/style-instances';

/**
 * Configuration required to create an AnnotationModule.
 */
export type AnnotationModuleConfig = {
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

    this.container.register(SvgModel, () => new SvgModel());

    // Register adapters provided by the configuration
    this.container
      .register(TextAdapterToken, PlainTextAdapter)
      .register(AnnotationAdapterToken, () => config.annotationAdapter);

    // Register services that extend BaseAnnotationDi (need reference to this module)
    this.container
      .register(Tag, () => new Tag(this))
      .register(ExternalEventSender, () => new ExternalEventSender(this))
      .register(EventAnnotations, () => new EventAnnotations(this))
      .register(AnnotationColors, () => new AnnotationColors(this))
      .register(Draw, () => new Draw(this))
      .register(DrawAnnotation, () => new DrawAnnotation(this))
      .register(DrawText, () => new DrawText(this))
      .register(RenderInstances, () => new RenderInstances(this))
      .register(TagRenderer, () => new TagRenderer(this))
      .register(StyleInstances, () => new StyleInstances())
      .register(SnapperToken, () => new DefaultSnapper());

    this.container.register(MainContainer, () => new MainContainer(this));
    this.inject<TextAdapter>(TextAdapterToken).setModule(this);
    this.inject<AnnotationAdapter<any>>(AnnotationAdapterToken).setModule(this);
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

  getAllRenderInstances() {
    const instances = this.container
      .getAllTokens()
      .filter((token) => String(token).startsWith('RENDER_INSTANCE_'));
    return this.container.getMany(instances as any);
  }

  registerRender(token: string | symbol, factory: () => AnnotationRender<any>) {
    factory().setModule(this);
    this.register(`RENDER_INSTANCE_${token as any}`, factory)
      .injectRender(token)
      .setModule(this);
  }

  hasRender(token: string | symbol) {
    return this.container.has(`RENDER_INSTANCE_${token as any}`);
  }

  injectRender<STYLE extends AnnotationRenderStyle>(token: string | symbol) {
    return this.inject<AnnotationRender<STYLE>>(
      `RENDER_INSTANCE_${token as any}`,
    );
  }
}
