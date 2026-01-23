import { cloneDeep } from 'lodash-es';
import {
  type AnnotationDrawColors,
  type AnnotationId,
  type TextAnnotation,
  textAnnotationSchema,
} from '../../../model';
import type { InternalEventListener } from '../../../events/internal/internal.event.listener';
import type { Position, StartEnd } from '../types';
import { type AnnotationAdapter } from '../../../adapter';
import { DUMMY_UID } from '../../model/svg.types';

export abstract class AbstractAnnotationEventEdit {
  protected readonly annotation: TextAnnotation | null;
  protected dummyAnnotation: TextAnnotation;
  protected readonly originalStartEnd: StartEnd;

  constructor(
    protected readonly annotationAdapter: AnnotationAdapter<any>,
    protected readonly internalEventListener: InternalEventListener,
    props: Partial<{ annotation: TextAnnotation }> = {},
  ) {
    this.annotation = props.annotation ?? null;
    this.originalStartEnd = {
      start: this.annotation?.start,
      end: this.annotation?.end,
    } as StartEnd;
  }

  start(position: Position, target: 'start' | 'end', event: MouseEvent) {
    if (!this.annotationAdapter.edit) return;
    if (this.internalEventListener.isBlocking) return;
    this.internalEventListener.blockEvents('annotation-edit--start');

    this.onStart(position, target);

    this.sendExternalEvent('annotation-edit--start', this.dummyAnnotation?.id);

    this.internalEventListener.sendEvent('annotation--remove-tag', {
      annotationUuid: this.annotation!.id,
    });
  }

  protected abstract onStart(position: Position, target: 'start' | 'end'): void;

  move(position: Position, target: 'start' | 'end', event: MouseEvent) {
    if (!this.annotationAdapter.edit) return;

    const dragResult = this.onDrag(position, target);
    if (!dragResult) return;

    const { startEnd, prevPosition } = dragResult;

    const result = this.drawDummyAnnotation(startEnd, prevPosition);

    if (!result) return;

    this.dummyAnnotation = result;

    // Only send event if the annotation has changed
    this.sendExternalEvent('annotation-edit--move', this.dummyAnnotation?.id);
  }

  protected abstract onDrag(
    position: Position,
    target: 'start' | 'end',
  ): { startEnd: StartEnd; prevPosition?: StartEnd } | null;

  end(event: MouseEvent) {
    if (!this.dummyAnnotation) return;
    this.internalEventListener.unBlockEvents('ending annotation edit');
    this.internalEventListener.sendEvent('annotation--remove', {
      annotationUuid: this.dummyAnnotation?.id,
    });
    if (!this.dummyAnnotation) return;

    // this.dummyAnnotation._render.weight = this.annotation._render.weight;
    if (this.annotation) this.dummyAnnotation.id = this.annotation.id;

    this.internalEventListener.sendEvent('annotation--update', {
      annotation: this.dummyAnnotation,
    });

    this.sendExternalEvent('annotation-edit--end', this.dummyAnnotation?.id);
  }

  private drawDummyAnnotation(startEnd: StartEnd, prevPosition?: StartEnd) {
    const annotation = this.annotation!;
    // create dummy annotation
    const dummyAnnotation = textAnnotationSchema.parse({
      ...cloneDeep(annotation),
      ...startEnd,
      id: DUMMY_UID,
    });

    dummyAnnotation._render.weight = annotation._render.weight! + 1;

    let snapper = this.annotationAdapter.snapper.fixOffset(dummyAnnotation);

    if (snapper.end < snapper.start) {
      // Try snapping the other side if the end is before the start
      dummyAnnotation.start = snapper.start;
      snapper = this.annotationAdapter.snapper.fixOffset(dummyAnnotation);
    }

    if (snapper.end <= snapper.start) {
      // Still invalid, abort
      return;
    }

    if (
      prevPosition &&
      snapper.start === prevPosition.start &&
      snapper.end === prevPosition.end
    ) {
      // No change, nothing to do
      return;
    }

    const color = annotation._drawMetadata.color as AnnotationDrawColors;

    dummyAnnotation.start = snapper.start;
    dummyAnnotation.end = snapper.end;

    this.internalEventListener.sendEvent('annotation--draw-dummy', {
      dummyAnnotation: dummyAnnotation,
      color: color.edit,
    });

    return dummyAnnotation;
  }

  protected sendExternalEvent(
    event:
      | 'annotation-edit--move'
      | 'annotation-edit--start'
      | 'annotation-edit--end',
    moveId?: AnnotationId,
  ) {
    const annotation = this.annotation;

    if (!annotation) return;

    this.internalEventListener.sendEvent('send-event--annotation', {
      event,
      annotationUuid: annotation.id || '',
      additionalData: {
        annotation: {
          start: this.dummyAnnotation?.start ?? annotation.start,
          end: this.dummyAnnotation?.end ?? annotation.end,
        },
        annotationUuid: this.dummyAnnotation?.id,
        moveId,
      },
    });
  }
}
