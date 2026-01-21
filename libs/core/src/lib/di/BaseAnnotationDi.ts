import { type Token } from './container';
import { type AnnotationModule } from './annotation.module';
import { InternalEventListener } from '../events/internal/internal.event.listener';
import { EventListener } from '../events/event.listener';
import { type TextAdapter, TextAdapterToken } from '../adapter/text';
import {
  type AnnotationAdapter,
  AnnotationAdapterToken,
} from '../adapter/annotation';
import { type Annotation } from '../model';

export abstract class BaseAnnotationDi {
  readonly eventListener = this.inject(EventListener);
  readonly internalEventListener = this.inject(InternalEventListener);
  readonly annotationAdapter = this.inject(
    AnnotationAdapterToken,
  ) as AnnotationAdapter<Annotation>;
  readonly textAdapter = this.inject(TextAdapterToken) as TextAdapter;

  constructor(protected readonly annotationModule: AnnotationModule) {}

  inject<T>(token: Token<T>) {
    return this.annotationModule.inject(token);
  }
}
