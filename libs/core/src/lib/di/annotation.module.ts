import { type Container, type Token } from './container';
import { Debugger } from '../utils/debugger';
import type { Annotation, BaseAnnotation } from '../model';
import {
  type AnnotationAdapter,
  DefaultAnnotationAdapter,
} from '../adapter/annotation';
import { type AnnotationRender } from '../adapter/annotation/renderer';
import { InternalEventListener } from '../events/internal/internal.event.listener';
import { EventListener } from '../events/event.listener';

import { Tag } from '../compute/draw/tag/tag';
import { SvgModel } from '../compute/model/svg.types';
import {
  DefaultSnapper,
  PlainTextAdapter,
  type Snapper,
  type TextAdapter,
} from '../adapter/text';
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

const AnnotationAdapterToken = 'ANNOTATION_ADAPTER';
const TextAdapterToken = 'TEXT_ADAPTER';
const SnapperToken = 'SNAPPER';

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
  constructor(
    parentContainer: Container,
    adapters: {
      annotationAdapter: AnnotationAdapter<any>;
      textAdapter: TextAdapter;
    },
  ) {
    this.container = parentContainer.createScope();
    this.configure(adapters);
  }

  /**
   * Registers all annotation-related services with the container.
   * Order matters: SvgModel must be registered last as it depends on other services.
   */
  configure(adapters: {
    annotationAdapter: AnnotationAdapter<any>;
    textAdapter: TextAdapter;
  }): void {
    // Register event listeners (no dependencies)
    this.container.register(InternalEventListener).register(EventListener);
    this.container.register(SvgModel, () => new SvgModel());

    // Register adapters provided by the configuration
    this.container
      .register(TextAdapterToken, () => adapters.textAdapter)
      .register(AnnotationAdapterToken, () => adapters.annotationAdapter);

    // Register services that extend BaseAnnotationDi (need reference to this module)
    this.container
      .register(Tag, () => new Tag(this))
      .register(ExternalEventSender, () => new ExternalEventSender(this))
      .register(EventAnnotations, () => new EventAnnotations(this))
      .register(AnnotationColors, () => new AnnotationColors(this))
      .register(Draw, () => new Draw(this))
      .register(DrawAnnotation, () => new DrawAnnotation(this))
      .register(DrawText, () => new DrawText(this))
      .register(StyleInstances, () => new StyleInstances(this))
      .register(RenderInstances, () => new RenderInstances(this))
      .register(TagRenderer, () => new TagRenderer(this))
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
   * @deprecated use createAnnotatedText(id, {textAdapter})
   * @param adapter
   */
  updateTextAdapter(adapter: TextAdapter): this {
    console.warn('Use  createAnnotatedText(id, {textAdapter})');
    if (this.hasTextAdapter())
      this.container.update(TextAdapterToken, () => adapter);
    else this.container.register(TextAdapterToken, () => adapter);
    this.getTextAdapter().setModule(this);
    return this;
  }

  /**
   * @deprecated use createAnnotatedText(id, {annotationAdapter})
   * @param adapter
   */
  updateAnnotationAdapter(adapter: AnnotationAdapter<any>): this {
    console.warn('Use  createAnnotatedText(id, {annotationAdapter})');
    if (this.hasAnnotationAdapter())
      this.container.update(AnnotationAdapterToken, () => adapter);
    else this.container.register(AnnotationAdapterToken, () => adapter);

    this.getAnnotationAdapter().setModule(this);
    return this;
  }

  private useDefaultAnnotationAdapter<ANNOTATION extends BaseAnnotation>() {
    Debugger.warn('use default annotation adapter');
    this.container.register(AnnotationAdapterToken, DefaultAnnotationAdapter);
    this.updateAnnotationAdapter(DefaultAnnotationAdapter());
    return this.inject<AnnotationAdapter<ANNOTATION>>(AnnotationAdapterToken);
  }
  private useDefaultTextAdapter() {
    Debugger.warn('use default text adapter');
    this.updateTextAdapter(PlainTextAdapter());
    this.container.register(TextAdapterToken, PlainTextAdapter);
    return this.inject<TextAdapter>(TextAdapterToken);
  }

  updateSnapper(snapper: Snapper): this {
    this.container.update(SnapperToken, () => snapper);
    return this;
  }

  getSnapper() {
    return this.inject<Snapper>(SnapperToken);
  }

  getTextAdapter(): TextAdapter {
    try {
      const adapter = this.inject<TextAdapter>(TextAdapterToken);
      if (adapter) return adapter;
    } catch (err) {
      //
    }

    return this.useDefaultTextAdapter();
  }

  private hasTextAdapter(): boolean {
    try {
      const adapter = this.inject(TextAdapterToken);
      if (adapter) return true;
    } catch (err) {
      //
    }
    return false;
  }
  private hasAnnotationAdapter(): boolean {
    try {
      const adapter = this.inject(AnnotationAdapterToken);
      if (adapter) return true;
    } catch (err) {
      //
    }
    return false;
  }

  getAnnotationAdapter<
    ANNOTATION extends BaseAnnotation = Annotation,
  >(): AnnotationAdapter<ANNOTATION> {
    if (this.hasAnnotationAdapter()) {
      return this.inject<AnnotationAdapter<ANNOTATION>>(AnnotationAdapterToken);
    }

    console.warn('use default annotation adapter');
    return this.useDefaultAnnotationAdapter<ANNOTATION>();
  }

  getAllRenderInstances() {
    const instances = this.container
      .getAllTokens()
      .filter((token) => String(token).startsWith('RENDER_INSTANCE_'));
    return this.container.getMany(instances) as AnnotationRender<any>[];
  }

  registerRender(token: string | symbol, factory: () => AnnotationRender<any>) {
    factory().setModule(this);
    this.container.register(`RENDER_INSTANCE_${token as any}`, factory);
    this.injectRender(token).setModule(this);
  }

  hasRender(token: string | symbol) {
    return this.container.has(`RENDER_INSTANCE_${token as any}`);
  }

  injectRender(token: string | symbol) {
    return this.inject<AnnotationRender<any>>(
      `RENDER_INSTANCE_${token as any}`,
    );
  }
}
