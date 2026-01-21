import { type Container, type Token } from './container';
import { InternalEventListener } from '../events/internal/internal.event.listener';
import { EventListener } from '../events/event.listener';

import { Tag } from '../compute/draw/tag/tag';
import { SvgModel } from '../compute/model/svg.types';
import { type TextAdapter, TextAdapterToken } from '../adapter/text';
import {
  type AnnotationAdapter,
  AnnotationAdapterToken,
} from '../adapter/annotation';
import { AnnotationColors } from '../compute/model/annotation.colors';
import { Draw } from '../compute/draw/Draw';
import { DrawAnnotation } from '../compute/draw/annotations/DrawAnnotation';
import { EventAnnotations } from '../compute/draw/annotations/EventAnnotation';
import { ExternalEventSender } from '../events/send-event';

export type AnnotationModuleConfig = {
  textAdapter: TextAdapter;
  annotationAdapter: AnnotationAdapter<any>;
};

export class AnnotationModule {
  protected readonly container: Container;

  // TODO remove afterwards unnecesary
  constructor(parentContainer: Container, config: AnnotationModuleConfig) {
    this.container = parentContainer.createScope();
    this.configure(config);
  }

  configure(config: AnnotationModuleConfig): void {
    this.container.register(InternalEventListener).register(EventListener);

    this.container
      .register(TextAdapterToken, () => config.textAdapter)
      .register(AnnotationAdapterToken, () => config.annotationAdapter);

    this.container
      .register(Tag, () => new Tag(this))
      .register(ExternalEventSender, () => new ExternalEventSender(this))
      .register(EventAnnotations, () => new EventAnnotations(this))
      .register(AnnotationColors, () => new AnnotationColors(this))
      .register(Draw, () => new Draw(this))
      .register(DrawAnnotation, () => new DrawAnnotation(this));

    // This should go as last!
    this.container.register(SvgModel, () => new SvgModel(this));
  }

  inject<T>(token: Token<T>): T {
    return this.container.get<T>(token);
  }

  destroy(): void {
    this.container.destroy();
  }

  register<T>(classRef: new (...args: any[]) => T, factory?: () => T): this;
  register<T>(token: string | symbol, factory: () => T): this;
  register<T>(tokenOrClass: any, factory?: () => T): this {
    this.container.register(tokenOrClass, factory);

    return this;
  }

  registerSvgModel(svgModel: SvgModel<any>) {
    this.register(SvgModel, () => svgModel);
  }
}
