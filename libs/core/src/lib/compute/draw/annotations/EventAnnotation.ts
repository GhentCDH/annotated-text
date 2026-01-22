import { BaseAnnotationDi } from '../../../di/BaseAnnotationDi';
import type {
  AnnotationDrawColors,
  BaseAnnotation,
  TextAnnotation,
} from '../../../model';
import { type AnnotationSvg } from '../../model/svg.types';
import { Tag } from '../tag/tag';
import { AnnotationColors } from '../../model/annotation.colors';
import { type AnnotationEventType } from '../../../events';
import type { InternalEvent } from '../../../events/internal/internal.events';
import { type AnnotationModule } from '../../../di/annotation.module';
import { ExternalEventSender } from '../../../events/send-event';

export class EventAnnotations extends BaseAnnotationDi {
  addToAnnotation(annotation: TextAnnotation, rect: AnnotationSvg) {
    return new EventAnnotation(this.annotationModule, annotation, rect);
  }
}

class EventAnnotation<
  ANNOTATION extends BaseAnnotation,
> extends BaseAnnotationDi {
  private readonly externalEventSender = this.inject(ExternalEventSender);
  private readonly tag = this.inject(Tag);
  private readonly annotationColors = this.inject(AnnotationColors);

  constructor(
    mod: AnnotationModule,
    private readonly annotation: TextAnnotation,
    rect: AnnotationSvg,
  ) {
    super(mod);
    rect
      ?.on('mouseover', this.hover())
      .on('mouseleave', this.leave())
      // TODO check double click also fires click event
      .on('dblclick', this.doubleClick())
      .on('click', this.click());
  }

  private sendEvent(
    event: AnnotationEventType<ANNOTATION>,
    mouseEvent: MouseEvent,
  ) {
    return this.externalEventSender.sendEvent({
      event: event,
      mouseEvent,
      annotationUuid: this.annotation?.id || '',
    });
  }
  private sendEventIntern(event: InternalEvent) {
    return this.internalEventListener.sendEvent(event, {
      annotationUuid: this.annotation.id,
    });
  }

  private hover() {
    return (mouseEvent: MouseEvent) => {
      if (this.internalEventListener.isBlocking) return;
      const fullAnnotation = this.sendEvent('mouse-enter', mouseEvent);

      if (this.annotationAdapter.hover(fullAnnotation)) {
        const color = this.annotation._drawMetadata
          .color as AnnotationDrawColors;

        this.annotationColors.colorAnnotation(this.annotation.id, color.hover);
      }
      if (this.annotationAdapter.tagConfig.enabledOnHover) {
        this.tag.drawTag(fullAnnotation);
      }
    };
  }

  private leave() {
    return (mouseEvent: MouseEvent) => {
      if (this.internalEventListener.isBlocking) return;

      this.sendEvent('mouse-leave', mouseEvent);
      this.annotationColors.resetAnnotationColor(this.annotation.id);

      if (this.annotationAdapter.tagConfig.enabledOnHover)
        this.sendEventIntern('annotation--remove-tag');
    };
  }

  private click() {
    return (mouseEvent: MouseEvent) => {
      if (this.internalEventListener.isBlocking) return;
      this.sendEvent('click', mouseEvent);
    };
  }

  private doubleClick() {
    return (mouseEvent: MouseEvent) => {
      if (this.internalEventListener.isBlocking) return;

      mouseEvent.preventDefault();

      this.sendEvent('double-click', mouseEvent);
    };
  }
}
