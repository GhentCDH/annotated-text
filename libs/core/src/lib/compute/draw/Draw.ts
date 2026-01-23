import { Tag } from './tag/tag';
import { createNewBlock } from './annotations/create';
import { DrawAnnotation } from './annotations/DrawAnnotation';
import { DrawText } from './text/DrawText';
import { getLineHeight } from './utils/line-height';
import { BaseAnnotationDi } from '../../di/BaseAnnotationDi';
import type { BaseAnnotation } from '../../model';
import { type AnnotationModule } from '../../di/annotation.module';
import { assignAnnotationsToLines } from '../utils/assign_annotation_to_line';

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
    assignAnnotationsToLines(
      this.annotationAdapter as any,
      this.textAdapter,
      annotations,
      this.eventListener,
    );

    return this;
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
