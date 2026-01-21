import type RBush from 'rbush';
import { drawTextRaster, type TextRasterItem } from './text/text-raster';
import { Tag } from './tag/tag';
import { createNewBlock } from './annotations/create';
import { drawAnnotation } from './annotations';
import { DrawAnnotation } from './annotations/DrawAnnotation';
import { BaseAnnotationDi } from '../../di/BaseAnnotationDi';
import { SvgModel } from '../model/svg.types';
import { Debugger } from '../../utils/debugger';
import { AnnotationColors } from '../model/annotation.colors';
import type { AnnotationId } from '../../model';
import { type AnnotationModule } from '../../di/annotation.module';

/**
 * This is a dispatcher class for all actions made on visual drawing of the annotations
 */
export class Draw extends BaseAnnotationDi {
  private readonly svgModel;
  private readonly annotationColors = this.inject(AnnotationColors);
  readonly annotation = this.inject(DrawAnnotation);

  textTree: RBush<TextRasterItem>;

  constructor(mod: AnnotationModule) {
    super(mod);
    this.svgModel = this.annotationModule.inject(SvgModel);
  }

  initialDraw(textElement: HTMLElement) {
    this.textTree = drawTextRaster(textElement, this.textAdapter);
    createNewBlock(this.annotationModule.inject(SvgModel));
    this.annotationModule.inject(Tag).drawAll();

    return this;
  }

  annotations() {
    const now = Date.now();

    this.annotationAdapter.annotations
      .sortBy('weight')
      .forEach((annotation) => drawAnnotation(this.svgModel, annotation));

    Debugger.time(now, '--- drawComputedAnnotations ');

    return this;
  }

  color() {
    this.annotationColors.color();
  }

  highlightAnnotations(ids: AnnotationId[]) {
    this.annotationColors.highlightAnnotations(ids);
  }

  selectAnnotations(ids: AnnotationId[]) {
    this.annotationColors.selectAnnotations(ids);
  }
}
