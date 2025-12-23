import { type Selection } from 'd3-selection';
import { select } from 'd3';
import type RBush from 'rbush';
import { merge } from 'lodash-es';
import { type AnnotationColors } from './annotation.colors';
import { type AnnotationEventType, CHANGED_EVENTS, type EventData, NEW_EVENTS } from '../../events';
import { Debugger } from '../../utils/debugger';
import { type AnnotationDrawColor, type AnnotationDrawColors, type AnnotationId } from '../../model';
import { type TextAnnotationModel } from '../annotation.model';
import { styles } from '../styles.const';
import { drawAnnotation } from '../draw/annotations';
import { createNewBlock } from '../draw/annotations/create';
import { type EventListener } from '../../events/event.listener';
import { type AnnotationAdapter } from '../../adapter/annotation';
import { type TextAdapter } from '../../adapter/text';
import { drawTextRaster, type TextRasterItem } from '../draw/text/text-raster';
import { drawAllTags } from '../draw/tag';
import { type InternalEventListener } from '../../events/internal/internal.event.listener';

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

export class SvgModel {
  readonly annotations: AnnotationSvg;
  readonly handles: AnnotationSvg;
  readonly svg: AnnotationSvg;
  readonly tagSvg: AnnotationSvg;
  readonly textTree: RBush<TextRasterItem>;

  constructor(
    public readonly textElement: HTMLElement,
    public readonly model: TextAnnotationModel,
    public readonly eventListener: EventListener,
    public readonly annotationAdapter: AnnotationAdapter<any>,
    public readonly textAdapter: TextAdapter,
    public readonly annotationColors: AnnotationColors,
    public readonly internalEventListener: InternalEventListener,
  ) {
    const width = textElement.getBoundingClientRect().width;
    const height = textElement.getBoundingClientRect().height;
    this.svg = select('body')
      .append('svg')
      .attr('class', styles.svg)
      .attr('width', width)
      .attr('height', height) as any;
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
    this.textTree = drawTextRaster(this);
    createNewBlock(this);
    drawAllTags(this);
  }

  removeTag(annotationUuid: AnnotationId) {
    this.findRelatedAnnotations(
      annotationUuid,
      `[${SVG_ID.ANNOTATION_ROLE}="${SVG_ROLE.TAG}"]`,
    )?.remove();
    return this;
  }

  removeAnnotations(annotationUuid: AnnotationId, selector = '') {
    this.findRelatedAnnotations(annotationUuid, selector)?.remove();
    return this;
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

  resetAnnotationColor(annotationUuid: AnnotationId) {
    const annotation = this.model.getAnnotation(annotationUuid);
    if (!annotation) {
      Debugger.warn('No annotation found for uuid', annotationUuid);
      return;
    }

    const color = this.annotationColors.getAnnotationColor(
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
    this.findFills(annotationUuid)
      ?.attr('fill', color.fill!)
      .attr('stroke', 'none');
    if (color.border)
      this.findBorders(annotationUuid)
        ?.attr('fill', 'none')
        .attr('stroke', color.border);
  }

  setClass(annotationUuid: AnnotationId, cssClass: string) {
    this.findFills(annotationUuid)?.attr('class', cssClass);
    this.findBorders(annotationUuid)?.attr('class', cssClass);
  }

  node() {
    return this.svg.node();
  }

  drawAnnotations() {
    const now = Date.now();

    this.model.annotations
      .sort((a1, a2) => (a1._render.weight! > a2._render.weight! ? -1 : 1))
      .forEach((annotation) => drawAnnotation(this, annotation));

    Debugger.time(now, '--- drawComputedAnnotations ');
  }

  sendEvent<EVENT extends AnnotationEventType>(
    {
      event,
      mouseEvent,
      annotationUuid,
    }: {
      event: EVENT;
      mouseEvent?: MouseEvent;
      annotationUuid: AnnotationId;
    },
    additionalData: Partial<EventData[EVENT]> = {},
  ) {
    const fullAnnotation = this.model.getAnnotation(annotationUuid);
    const annotationData = {
      ...merge({ annotation: fullAnnotation }, additionalData),
      annotationUuid,
    };

    const isNew = NEW_EVENTS.includes(event);
    const hasChanged = CHANGED_EVENTS.includes(event);

    annotationData.annotation = this.annotationAdapter.format(
      annotationData.annotation,
      isNew,
      hasChanged,
    );

    this.eventListener.sendEvent(
      event,
      annotationData as unknown as any,
      mouseEvent,
    );

    return fullAnnotation;
  }
}
