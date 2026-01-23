import type {
  AnnotationDrawColor,
  AnnotationId,
  TextAnnotation,
} from '../../../model';
import { BaseAnnotationDi } from '../../../di/BaseAnnotationDi';
import { drawAnnotation, drawAnnotationContent } from '../annotations';
import { DUMMY_UID, SvgModel } from '../../model/svg.types';
import { getLinesForAnnotation } from '../../utils/line.utils';

import { Debugger } from '../../../utils/debugger';
import { AnnotationColors } from '../../model/annotation.colors';
import { RenderInstances } from '../../../adapter/annotation/renderer/render-instances';

export class DrawAnnotation extends BaseAnnotationDi {
  private readonly annotationColors = this.inject(AnnotationColors);
  private readonly svgModel = this.annotationModule.inject(SvgModel);
  private readonly renderInstances =
    this.annotationModule.inject(RenderInstances);

  drawAll() {
    const now = Date.now();

    this.annotationAdapter.annotations
      .sortBy('weight')
      .forEach((annotation) => this.draw(annotation));

    Debugger.time(now, '--- drawComputedAnnotations ');

    this.color();

    return this;
  }

  color() {
    this.annotationColors.color();
  }

  highlight(ids: AnnotationId[]) {
    this.annotationColors.highlightAnnotations(ids);
  }

  select(ids: AnnotationId[]) {
    this.annotationColors.selectAnnotations(ids);
  }

  draw(annotation: TextAnnotation) {
    drawAnnotation(this.annotationModule, annotation);
  }

  dummy(dummyAnnotation: TextAnnotation, color: AnnotationDrawColor) {
    const annotationUuid = DUMMY_UID;

    dummyAnnotation._render.lines = getLinesForAnnotation(
      this.textAdapter.lines,
      dummyAnnotation,
    );

    this.createDraws(dummyAnnotation, color, annotationUuid);
  }

  private createDraws(
    annotation: TextAnnotation,
    color: AnnotationDrawColor,
    newUuid?: AnnotationId,
  ) {
    const annotationUuid = newUuid ?? annotation.id;

    this.internalEventListener.sendEvent('annotation--remove', {
      annotationUuid,
    });
    const renderInstance = this.renderInstances.highlightInstance;

    renderInstance.createDraws(annotation).draws.forEach((a) => {
      drawAnnotationContent({ ...a, annotationUuid }, this.svgModel, color);
    });

    this.annotationColors.colorAnnotation(annotationUuid, color);
  }

  compute() {
    this.annotationAdapter.annotations().forEach((annotation) => {
      this.computeOne(annotation);
    });
  }

  private computeOne(annotation: TextAnnotation) {
    const rendered = this.renderInstances.createDraws(annotation);

    this.annotationAdapter.addDrawAnnotations(
      annotation.id,
      rendered.draws,
      rendered.dimensions,
      rendered.color,
    );
  }
}
