import { type Selection } from 'd3-selection';
import { select } from 'd3';
import { Debugger } from '../../utils/debugger';
import { type AnnotationId } from '../../model';
import { styles } from '../styles.const';
import { getUnscaledRect } from '../position/unscaled';

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
export class SvgModel {
  annotations: AnnotationSvg;
  handles: AnnotationSvg;
  svg: AnnotationSvg;
  tagSvg: AnnotationSvg;

  textElement: HTMLDivElement;

  createTextElement() {
    if (!document) {
      Debugger.debug('drawText', 'no document available, cannot draw text');

      return this;
    }
    this.textElement = document?.createElement('div');

    return this;
  }

  createModel() {
    const textElementDimensions = this.getTextElementDimensions();

    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg = select(svgEl)
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

    return this;
  }

  getTextElementDimensions() {
    // This should be calculated on the fly, or when the size changes or the scale or something else
    return getUnscaledRect(this.textElement);
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
