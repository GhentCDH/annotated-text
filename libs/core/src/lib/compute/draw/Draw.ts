import { Tag } from './tag/tag';
import { createNewBlock } from './annotations/create';
import { DrawAnnotation } from './annotations/DrawAnnotation';
import { DrawText } from './text/DrawText';
import { getLineHeight } from './utils/line-height';
import { Debugger } from '../../utils/debugger';
import { BaseAnnotationDi } from '../../di/BaseAnnotationDi';
import type { BaseAnnotation, TextAnnotation } from '../../model';
import { type AnnotationModule } from '../../di/annotation.module';
import { isIntersection } from '../utils/intersect';
import { getLinesForAnnotation } from '../utils/line.utils';
import { validateAnnotation } from '../utils/assign_annotation_to_line';
import { CacheDraw } from './CacheDraw';

/**
 * This is a dispatcher class for all actions made on visual drawing of the annotations
 */
export class Draw<
  ANNOTATION extends BaseAnnotation,
> extends BaseAnnotationDi<ANNOTATION> {
  readonly annotation = this.inject(DrawAnnotation);
  readonly text = this.inject(DrawText);
  readonly tag = this.inject(Tag);

  private readonly textCache = new CacheDraw();

  constructor(mod: AnnotationModule) {
    super(mod);
  }

  initialDraw() {
    // TODO think about making async to speed up drawing speed
    // https://github.com/GhentCDH/annotated-text/issues/184
    this.text.createTree();
    createNewBlock(this.annotationModule);
    this.tag.drawAll();

    this.annotation.drawAll();
    return this;
  }

  setText(text: string) {
    const startOffset = this.annotationAdapter.startOffset;
    const textAdapter = this.textAdapter;
    const annotationAdapter = this.annotationAdapter;
    const snapper = this.getSnapper();

    if (this.textCache.hasChanged({ textAdapter, text, startOffset })) {
      const lines = this.textAdapter.parse(text, startOffset);
      textAdapter.setLines(lines);
    }

    if (this.textCache.hasChanged({ annotationAdapter, text })) {
      annotationAdapter.setText(text);
    }
    if (this.textCache.hasChanged({ snapper, text, startOffset })) {
      snapper.setText(text, startOffset);
    }

    if (this.textCache.hasChanged({ textAdapter, startOffset })) {
      textAdapter.setLineHeight(
        getLineHeight(text, textAdapter.style.lineOffset),
      );
    }

    this.textCache.updateCache({
      textAdapter,
      startOffset,
      annotationAdapter,
      snapper,
      text,
    });

    return this;
  }

  setAnnotations(annotations: ANNOTATION[]) {
    const textAdapter = this.textAdapter;
    const annotationAdapter = this.annotationAdapter;
    const lines = this.textAdapter.lines;
    const limit = textAdapter.getLimit();

    textAdapter.clear();
    annotationAdapter.clear();

    annotations?.forEach((annotation) => {
      const clonedAnnotation = annotationAdapter.parse(annotation);
      if (!clonedAnnotation) return;

      if (limit && !isIntersection(clonedAnnotation, limit)) {
        return;
      }

      this.setAnnotation(clonedAnnotation);
    });

    annotationAdapter.calculateWeights(lines);

    return this;
  }

  setAnnotation(annotation: TextAnnotation) {
    const textLength = this.textAdapter.textLength;

    validateAnnotation(annotation, textLength, this.eventListener);

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
