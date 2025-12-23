import { pick } from 'lodash-es';
import { type InternalEventListener } from '../../../events/internal/internal.event.listener';
import { type Position } from '../types';
import {
  type CharacterPositionResult,
  getCharacterStartEndPosition,
} from '../../position';
import { type AnnotationAdapter } from '../../../adapter';
import { type TextAnnotation } from '../../../model';
import { AbstractAnnotationEventEdit } from './abstract-annotation-event.edit';

export class EditAnnotation extends AbstractAnnotationEventEdit {
  constructor(
    annotation: TextAnnotation,
    internalEventListener: InternalEventListener,
    annotationAdapter: AnnotationAdapter<any>,
    private readonly getCharacterFromTextNodesAtPoint: (
      position: Position,
    ) => CharacterPositionResult | null,
  ) {
    super(annotationAdapter, internalEventListener, { annotation });
  }

  protected override onStart(position: Position, target: 'start' | 'end') {
    return;
  }

  protected onDrag(position: Position, target: 'start' | 'end') {
    const result = this.getCharacterFromTextNodesAtPoint(position);
    if (!result) return null;

    const startEnd = getCharacterStartEndPosition(
      result,
      this.originalStartEnd,
      target,
    );
    const prevPosition =
      (this.dummyAnnotation && pick(this.dummyAnnotation, ['start', 'end'])) ??
      undefined;

    return { startEnd, prevPosition };
  }
}
