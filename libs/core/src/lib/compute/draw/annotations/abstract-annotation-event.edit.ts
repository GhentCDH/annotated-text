import { cloneDeep } from 'lodash-es';

import { BaseAnnotationDi } from '../../../di/BaseAnnotationDi';
import { type AnnotationModule } from '../../../di/annotation.module';
import {
  type AnnotationId,
  type TextAnnotation,
  textAnnotationSchema,
} from '../../../model';
import { DUMMY_UID } from '../../model/svg.types';
import { Draw } from '../Draw';
import type { Position, StartEnd } from '../types';

export abstract class AbstractAnnotationEventEdit extends BaseAnnotationDi {
  protected readonly annotation: TextAnnotation | null;
  protected dummyAnnotation: TextAnnotation | undefined;
  protected readonly originalStartEnd: StartEnd;
  protected readonly draw = this.inject(Draw);
  /** True between a start() that blocked the events and the matching end() or cancel() */
  private active = false;
  private readonly onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') this.cancel();
  };

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
    // Only listen while an edit is in flight: no listener to tear down on destroy
    document.addEventListener('keydown', this.onKeydown);

    try {
      this.onStart(position, target);
    } catch (error) {
      // Never leave the events blocked: that freezes the whole component
      this.release('annotation edit failed to start');
      throw error;
    }

    this.sendExternalEvent('annotation-edit--start');

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
    // Nothing changed (released without moving, or the snapper kept the same
    // range): that is a cancel
    if (!this.dummyAnnotation) return this.cancel();

    const dummyAnnotation = this.release('ending annotation edit')!;

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

  /**
   * Abandon the edit in flight: the annotation keeps its original range and
   * nothing is updated. Called on Escape and when an edit ends without a change.
   */
  cancel() {
    if (!this.active) return;
    const dummyAnnotation = this.release('cancelling annotation edit');

    if (dummyAnnotation) this.draw.annotation.removeDraw(dummyAnnotation.id);
    if (!this.annotation) return;

    // Undo what start() did
    this.draw.annotation.setClass(this.annotation.id, '');
    this.draw.tag.drawTag(this.annotation);

    this.sendExternalEvent(
      'annotation-edit--cancel',
      this.annotation.id,
      this.originalStartEnd,
    );
  }

  /** Always release the block, whatever else happens. Returns the dummy that was drawn. */
  private release(reason: string) {
    this.active = false;
    this.internalEventListener.unBlockEvents(reason);
    document.removeEventListener('keydown', this.onKeydown);

    const dummyAnnotation = this.dummyAnnotation;
    this.dummyAnnotation = undefined;
    return dummyAnnotation;
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
      | 'annotation-edit--end'
      | 'annotation-edit--cancel',
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
