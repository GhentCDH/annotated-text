import type { AnnotationId, TextAnnotation } from '../../../model';
import { BaseAnnotationDi } from '../../../di/BaseAnnotationDi';
import { drawAnnotation, drawAnnotationContent } from '../annotations';
import { DUMMY_UID, SvgModel } from '../../model/svg.types';
import { getLinesForAnnotation } from '../../utils/line.utils';
import { AnnotationColors } from '../../model/annotation.colors';
import { RenderInstances } from '../../../adapter/annotation/renderer/render-instances';

export class DrawAnnotation extends BaseAnnotationDi {
  private readonly annotationColors = this.inject(AnnotationColors);
  private readonly svgModel = this.annotationModule.inject(SvgModel);
  private readonly renderInstances =
    this.annotationModule.inject(RenderInstances);

  drawAll() {
    this.annotationAdapter.annotations
      .sortBy('weight')
      .forEach((annotation) => this.draw(annotation));

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

  dummy(dummyAnnotation: TextAnnotation) {
    const annotationUuid = DUMMY_UID;

    dummyAnnotation._render.lines = getLinesForAnnotation(
      this.textAdapter.lines,
      dummyAnnotation,
    );

    this.createDraws(dummyAnnotation, annotationUuid);
  }

  private createDraws(annotation: TextAnnotation, newUuid?: AnnotationId) {
    const annotationUuid = newUuid ?? annotation.id;

    this.internalEventListener.sendEvent('annotation--remove', {
      annotationUuid,
    });
    const renderInstance = this.renderInstances.highlightInstance;
    const style =
      annotation._style ??
      this.renderInstances
        .getDefaultRenderer()
        .annotationRenderStyle.getDefaultStyle();

    renderInstance.createDraws(annotation).draws.forEach((a) => {
      drawAnnotationContent(
        { ...a, annotationUuid },
        this.svgModel,
        style,
        'edit',
      );
    });

    this.annotationColors.colorAnnotation(annotationUuid, 'edit');
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
    );
  }
}
