import { type Selection } from 'd3-selection';
import { select } from 'd3';
import type RBush from 'rbush';
import { AnnotationColors } from './annotation.colors';
import { type AnnotationId, type BaseAnnotation } from '../../model';
import { styles } from '../styles.const';
import { type TextRasterItem } from '../draw/text/text-raster';
import { getUnscaledRect } from '../position/unscaled';
import { BaseAnnotationDi } from '../../di/BaseAnnotationDi';
import { type AnnotationModule } from '../../di/annotation.module';
import { Draw } from '../draw/Draw';

export type AnnotationSvg = Selection<SVGElement, unknown, null, undefined>;

export const DUMMY_UID = 'dummy-uid';

export const SVG_ID = {
  ANNOTATION_UID: 'data-annotation-uid',
  ANNOTATION_ROLE: 'data-annotation-role',
  LINE_UID: 'data-line-uid',
};

export const SVG_ROLE = {
  BORDER: 'border',
  FILL: 'fill',
  HANDLE: 'handle',
  ANNOTATIONS: 'annotations',
  TAG: 'tag',
};

/**
 * this contains some helper function for the svg drawing, here there should not be any dependency on edit them
 */
export class SvgModel<
  ANNOTATION extends BaseAnnotation,
> extends BaseAnnotationDi {
  annotations: AnnotationSvg;
  handles: AnnotationSvg;
  svg: AnnotationSvg;
  tagSvg: AnnotationSvg;
  textTree: RBush<TextRasterItem>;

  textElement: HTMLElement;

  constructor(annotationModule: AnnotationModule) {
    super(annotationModule);
  }

  get annotationColors() {
    return this.annotationModule.inject(AnnotationColors);
  }

  createModel(textElement: HTMLElement) {
    this.textElement = textElement;
    const textElementDimensions = getUnscaledRect(textElement);

    this.svg = select('body')
      .append('svg')
      .attr('class', styles.svg)
      .attr('width', textElementDimensions.original.width)
      .attr('height', textElementDimensions.original.height) as any;
    // .style("font-family", textAdapter.style.fontFamily)
    // .style("font-size", textAdapter.style.fontSize) as any;
    this.annotations = this.svg
      .append('g')
      .attr(
        SVG_ID.ANNOTATION_ROLE,
        SVG_ROLE.ANNOTATIONS,
      ) as unknown as AnnotationSvg;
    this.tagSvg = this.svg
      .append('g')
      .attr(SVG_ID.ANNOTATION_ROLE, SVG_ROLE.TAG) as unknown as AnnotationSvg;
    this.handles = this.svg
      .append('g')
      .attr(
        SVG_ID.ANNOTATION_ROLE,
        SVG_ROLE.HANDLE,
      ) as unknown as AnnotationSvg;

    const draw = this.annotationModule.inject(Draw);
    draw.initialDraw(textElement);

    this.textTree = draw.textTree;

    return this;
  }

  findTags(annotationUuid: AnnotationId) {
    return this.findRelatedAnnotations(
      annotationUuid,
      `[${SVG_ID.ANNOTATION_ROLE}="${SVG_ROLE.TAG}"]`,
    );
  }

  findRelatedAnnotations(annotationUuid: AnnotationId, selector = '') {
    const annotations = this.svg.selectAll(
      `[data-annotation-uid="${annotationUuid}"]${selector}`,
    );

    if (annotations.empty()) {
      return null;
    }

    return annotations;
  }

  findFills(annotationUuid: AnnotationId) {
    return this.findRelatedAnnotations(
      annotationUuid,
      `[${SVG_ID.ANNOTATION_ROLE}="${SVG_ROLE.FILL}"]`,
    );
  }

  findBorders(annotationUuid: AnnotationId) {
    return this.findRelatedAnnotations(
      annotationUuid,
      `[${SVG_ID.ANNOTATION_ROLE}="${SVG_ROLE.BORDER}"]`,
    );
  }

  setClass(annotationUuid: AnnotationId, cssClass: string) {
    this.findFills(annotationUuid)?.attr('class', cssClass);
    this.findBorders(annotationUuid)?.attr('class', cssClass);
  }

  node() {
    return this.svg.node();
  }
}
