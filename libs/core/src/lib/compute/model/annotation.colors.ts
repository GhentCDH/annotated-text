import { SvgModel } from './svg.types';
import { Debugger } from '../../utils/debugger';
import {
  type AnnotationId,
  type AnnotationStyle,
  type TextAnnotation,
} from '../../model';
import { BaseAnnotationDi } from '../../di/BaseAnnotationDi';
import { RenderInstances } from '../../adapter/annotation/renderer/render-instances';
import { colorAnnotationContent } from '../draw/annotations';

export class AnnotationColors extends BaseAnnotationDi {
  private readonly svgModel = this.inject(SvgModel);
  private readonly activeIds = new Set<AnnotationId>();
  private readonly highlightedIds = new Set<AnnotationId>();
  private readonly renderInstances =
    this.annotationModule.inject(RenderInstances);

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

  public getAnnotationColor(annotation: TextAnnotation) {
    if (this.activeIds.has(annotation.id)) return 'active';
    if (this.highlightedIds.has(annotation.id)) return 'hover';

    return 'default';
  }

  resetAnnotationColor(annotationUuid: AnnotationId) {
    const annotation = this.annotationAdapter.getAnnotation(annotationUuid);
    if (!annotation) {
      Debugger.warn('No annotation found for uuid', annotationUuid);
      return;
    }

    const color = this.getAnnotationColor(annotation);

    if (!color) {
      Debugger.warn('No default color found for annotation', annotationUuid);
      return;
    }

    this.colorAnnotation(annotationUuid, color);
  }

  colorAnnotation(
    annotationUuid: AnnotationId,
    styleKey: keyof AnnotationStyle,
  ) {
    const style =
      this.annotationAdapter.getAnnotation(annotationUuid)?._style ??
      this.renderInstances
        .getDefaultRenderer()
        .annotationRenderStyle.getDefaultStyle();

    colorAnnotationContent(
      style,
      styleKey,
      this.svgModel.findBorders(annotationUuid),
      this.svgModel.findFills(annotationUuid),
    );
  }
}
