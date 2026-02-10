import { pick } from 'lodash-es';
import { AbstractAnnotationEventEdit } from './abstract-annotation-event.edit';
import { type Position } from '../types';
import {
  type CharacterPositionResult,
  getCharacterStartEndPosition,
} from '../../position';
import { type TextAnnotation } from '../../../model';
import { type AnnotationModule } from '../../../di/annotation.module';

export class EditAnnotation extends AbstractAnnotationEventEdit {
  constructor(
    annotation: TextAnnotation,
    annotationModule: AnnotationModule,
    private readonly getCharacterFromTextNodesAtPoint: (
      position: Position,
    ) => CharacterPositionResult | null,
  ) {
    super(annotationModule, { annotation });
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
