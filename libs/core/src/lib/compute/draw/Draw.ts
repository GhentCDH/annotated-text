import { Tag } from './tag/tag';
import { createNewBlock } from './annotations/create';
import { DrawAnnotation } from './annotations/DrawAnnotation';
import { DrawText } from './text/DrawText';
import { getLineHeight } from './utils/line-height';
import { BaseAnnotationDi } from '../../di/BaseAnnotationDi';
import type { BaseAnnotation, TextAnnotation } from '../../model';
import { type AnnotationModule } from '../../di/annotation.module';
import { isIntersection } from '../utils/intersect';
import { getLinesForAnnotation } from '../utils/line.utils';
import { Debugger } from '@ghentcdh/annotated-text';
import { validateAnnotation } from '../utils/assign_annotation_to_line';

/**
 * This is a dispatcher class for all actions made on visual drawing of the annotations
 */
export class Draw<
  ANNOTATION extends BaseAnnotation,
> extends BaseAnnotationDi<ANNOTATION> {
  readonly annotation = this.inject(DrawAnnotation);
  readonly text = this.inject(DrawText);
  readonly tag = this.inject(Tag);

  constructor(mod: AnnotationModule) {
    super(mod);
  }

  initialDraw() {
    this.text.createTree();
    createNewBlock(this.annotationModule);
    this.tag.drawAll();

    this.annotation.drawAll();

    return this;
  }

  setText(text: string) {
    const lines = this.textAdapter.parse(text);
    this.textAdapter.setLines(lines);
    this.annotationAdapter.setText(text, this.textAdapter.textOffset);
    this.textAdapter.setLineHeight(
      getLineHeight(text, this.textAdapter.style.lineOffset),
    );

    return this;
  }

  setAnnotations(annotations: ANNOTATION[]) {
    this.textAdapter.clear();
    this.annotationAdapter.clear();

    const limit = this.textAdapter.getLimit();

    annotations?.forEach((annotation) => {
      const clonedAnnotation = this.annotationAdapter.parse(annotation);
      if (!clonedAnnotation) return;

      if (limit && !isIntersection(clonedAnnotation, limit)) {
        return;
      }

      this.setAnnotation(clonedAnnotation);
    });

    this.annotationAdapter.calculateWeights(this.textAdapter.lines);

    return this;
  }

  setAnnotation(annotation: TextAnnotation) {
    validateAnnotation(
      annotation,
      this.textAdapter.textLength,
      this.eventListener,
    );

    const lines = getLinesForAnnotation(this.textAdapter.lines, annotation);

    if (!lines?.length) {
      Debugger.warn(
        'Invalid annotation: no lines found for annotation',
        annotation,
      );
      return;
    }

    annotation._render.lines = lines;

    return;
  }

  initDraw(text: string, annotations: ANNOTATION[]) {
    this.setText(text);
    this.setAnnotations(annotations);

    return this;
  }

  compute() {
    this.text.compute();
    this.annotationAdapter.clearDraws();
    this.annotation.compute();

    return this;
  }
}
