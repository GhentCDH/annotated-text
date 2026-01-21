import { SvgModel } from './svg.types';
import { Debugger } from '../../utils/debugger';
import {
  type AnnotationDrawColor,
  type AnnotationDrawColors,
  type AnnotationId,
  type TextAnnotation,
} from '../../model';
import { BaseAnnotationDi } from '../../di/BaseAnnotationDi';

export class AnnotationColors extends BaseAnnotationDi {
  private readonly svgModel = this.inject(SvgModel);
  private readonly activeIds = new Set<AnnotationId>();
  private readonly highlightedIds = new Set<AnnotationId>();

  public highlightAnnotations(ids: AnnotationId[]) {
    const oldIds = new Set(this.highlightedIds);
    this.highlightedIds.clear();
    ids.forEach((id) => this.highlightedIds.add(id));

    this.color();
    this.resetColors(oldIds);
    return this;
  }

  public selectAnnotations(ids: AnnotationId[]) {
    const oldIds = new Set(this.activeIds);
    this.activeIds.clear();
    ids.forEach((id) => this.highlightedIds.delete(id));
    ids.forEach((id) => this.activeIds.add(id));

    this.color();
    this.resetColors(oldIds);
    // TODO decide which one has more priority?
    return this;
  }

  public resetColors(ids: Set<AnnotationId> | AnnotationId[]) {
    ids.forEach((id) => this.resetAnnotationColor(id));
    return this;
  }

  public color() {
    this.resetColors(this.highlightedIds).resetColors(this.activeIds);
    return this;
  }

  public getAnnotationColor(
    annotation: TextAnnotation,
    color: AnnotationDrawColors,
  ) {
    if (this.activeIds.has(annotation.id)) return color.active;
    if (this.highlightedIds.has(annotation.id)) return color.hover;

    return color.default;
  }

  resetAnnotationColor(annotationUuid: AnnotationId) {
    const annotation = this.annotationAdapter.getAnnotation(annotationUuid);
    if (!annotation) {
      Debugger.warn('No annotation found for uuid', annotationUuid);
      return;
    }

    const color = this.getAnnotationColor(
      annotation,
      annotation._drawMetadata.color as AnnotationDrawColors,
    );

    if (!color) {
      Debugger.warn('No default color found for annotation', annotationUuid);
      return;
    }

    this.colorAnnotation(annotationUuid, color);
  }

  colorAnnotation(annotationUuid: AnnotationId, color: AnnotationDrawColor) {
    if (!color) {
      Debugger.warn('No color provided for annotation', annotationUuid);
      return;
    }
    this.svgModel
      .findFills(annotationUuid)
      ?.attr('fill', color.fill!)
      .attr('stroke', 'none');
    if (color.border)
      this.svgModel
        .findBorders(annotationUuid)
        ?.attr('fill', 'none')
        .attr('stroke', color.border);
  }
}
