import { cloneDeep } from 'lodash-es';
import {
  type AnnotationId,
  type TextAnnotation,
  textAnnotationSchema,
} from '../../../model';
import type { Position, StartEnd } from '../types';
import { DUMMY_UID } from '../../model/svg.types';
import { BaseAnnotationDi } from '../../../di/BaseAnnotationDi';
import { type AnnotationModule } from '../../../di/annotation.module';
import { Draw } from '../Draw';

export abstract class AbstractAnnotationEventEdit extends BaseAnnotationDi {
  protected readonly annotation: TextAnnotation | null;
  protected dummyAnnotation: TextAnnotation | undefined;
  protected readonly originalStartEnd: StartEnd;
  protected readonly draw = this.inject(Draw);
  /** True between a start() that blocked the events and the matching end() */
  private active = false;

  constructor(
    annotationModule: AnnotationModule,
    props: Partial<{ annotation: TextAnnotation }> = {},
  ) {
    super(annotationModule);
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
    this.active = true;
    this.dummyAnnotation = undefined;

    try {
      this.onStart(position, target);
    } catch (error) {
      // Never leave the events blocked: that freezes the whole component
      this.end(event);
      throw error;
    }

    this.sendExternalEvent('annotation-edit--start', this.dummyAnnotation?.id);

    this.draw.tag.removeTag(this.annotation!.id);
  }

  protected abstract onStart(position: Position, target: 'start' | 'end'): void;

  move(position: Position, target: 'start' | 'end', event: MouseEvent) {
    if (!this.active || !this.annotationAdapter.edit) return;

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
    if (!this.active) return;
    // Always release the block, whatever else happens
    this.active = false;
    this.internalEventListener.unBlockEvents('ending annotation edit');

    const dummyAnnotation = this.dummyAnnotation;
    this.dummyAnnotation = undefined;

    if (!dummyAnnotation) {
      // Nothing changed (released without moving, or the snapper kept the
      // same range): undo what start() did, nothing to emit
      if (this.annotation) {
        this.draw.annotation.setClass(this.annotation.id, '');
        this.draw.tag.drawTag(this.annotation);
      }
      return;
    }

    this.draw.annotation.removeDraw(dummyAnnotation.id);
    if (this.annotation) dummyAnnotation.id = this.annotation.id;

    this.internalEventListener.sendEvent('annotation--update', {
      annotation: dummyAnnotation,
    });

    // dummyAnnotation is cleared above, so pass the edited range explicitly
    this.sendExternalEvent('annotation-edit--end', dummyAnnotation.id, {
      start: dummyAnnotation.start,
      end: dummyAnnotation.end,
    });
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

    const snapper = this.annotationModule.getSnapper();

    let fixed = snapper.fixOffset(dummyAnnotation);

    if (fixed.end < fixed.start) {
      // Try snapping the other side if the end is before the start
      dummyAnnotation.start = fixed.start;
      fixed = snapper.fixOffset(dummyAnnotation);
    }

    if (fixed.end <= fixed.start) {
      // Still invalid, abort
      return;
    }

    if (
      prevPosition &&
      fixed.start === prevPosition.start &&
      fixed.end === prevPosition.end
    ) {
      // No change, nothing to do
      return;
    }

    dummyAnnotation.start = fixed.start;
    dummyAnnotation.end = fixed.end;

    this.draw.annotation.dummy(dummyAnnotation);

    return dummyAnnotation;
  }

  protected sendExternalEvent(
    event:
      | 'annotation-edit--move'
      | 'annotation-edit--start'
      | 'annotation-edit--end',
    moveId?: AnnotationId,
    range: StartEnd | undefined = this.dummyAnnotation,
  ) {
    const annotation = this.annotation;

    if (!annotation) return;

    this.internalEventListener.sendEvent('send-event--annotation', {
      event,
      annotationUuid: annotation.id || '',
      additionalData: {
        annotation: {
          start: range?.start ?? annotation.start,
          end: range?.end ?? annotation.end,
        },
        annotationUuid: moveId,
        moveId,
      },
    });
  }
}
