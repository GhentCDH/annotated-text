import { Selection } from "d3-selection";
import { select } from "d3";
import { AnnotationEventData, AnnotationEventType } from "../../events";
import { Debugger } from "../../utils/debugger";
import { AnnotationDrawColor, TextAnnotationModel } from "../annotation.model";
import { styles } from "../styles.const";
import { drawAnnotation } from "../draw/annotations";
import { createNewBlock } from "../draw/annotations/create";
import { EventListener } from "../../events/event.listener";
import { AnnotationAdapter } from "../../adapter/annotation";
import { TextAdapter } from "../../adapter/text";
import { type AnnotationId } from "../../model";

export type AnnotationSvg = Selection<SVGElement, unknown, null, undefined>;

export type AnnotationRect = any;

export const DUMMY_UID = "dummy-uid";

export const SVG_ID = {
  ANNOTATION_UID: "data-annotation-uid",
  ANNOTATION_ROLE: "data-annotation-role",
};

export const SVG_ROLE = {
  BORDER: "border",
  FILL: "fill",
  HANDLE: "handle",
  ANNOTATIONS: "annotations",
};

export class SvgModel {
  readonly annotations: AnnotationSvg;
  readonly handles: AnnotationSvg;
  readonly svg: AnnotationSvg;

  constructor(
    public readonly textElement: HTMLElement,
    public readonly model: TextAnnotationModel,
    private readonly eventListener: EventListener,
    public readonly annotationAdapter: AnnotationAdapter<any>,
    public readonly textAdapter: TextAdapter,
  ) {
    const width = textElement.getBoundingClientRect().width;
    const height = textElement.getBoundingClientRect().height;
    this.svg = select("body")
      .append("svg")
      .attr("class", styles.svg)
      .attr("width", width)
      .attr("height", height)
      .style("font-family", "sans-serif")
      .style("font-size", "16px") as any;

    this.annotations = this.svg
      .append("g")
      .attr(SVG_ID.ANNOTATION_ROLE, SVG_ROLE.ANNOTATIONS);
    this.handles = this.svg
      .append("g")
      .attr(SVG_ID.ANNOTATION_ROLE, SVG_ROLE.HANDLE);

    createNewBlock(this);
  }

  removeAnnotations(annotationUuid: AnnotationId, selector = "") {
    this.findRelatedAnnotations(annotationUuid, selector)?.remove();
    return this;
  }

  findRelatedAnnotations(annotationUuid: AnnotationId, selector = "") {
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

  colorAnnotation(annotationUuid: AnnotationId, color: AnnotationDrawColor) {
    if (!color) {
      Debugger.warn("No color provided for annotation", annotationUuid);
      return;
    }
    this.findFills(annotationUuid)
      ?.attr("fill", color.fill)
      .attr("stroke", "none");
    this.findBorders(annotationUuid)
      ?.attr("fill", "none")
      .attr("stroke", color.border);
  }

  node() {
    return this.svg.node();
  }

  drawAnnotations() {
    const now = Date.now();

    this.model.drawAnnotations
      .sort((a1, a2) => (a1.weight > a2.weight ? -1 : 1))
      .forEach((annotation) => drawAnnotation(this, annotation));
    Debugger.time(now, "--- drawComputedAnnotations ");
  }

  sendEvent(
    {
      event,
      mouseEvent,
      isNew,
      annotationUuid,
    }: {
      event: AnnotationEventType;
      mouseEvent?: MouseEvent;
      isNew?: boolean;
      annotationUuid: AnnotationId;
    },
    additionalData = {},
  ) {
    const fullAnnotation = this.model.getAnnotation(annotationUuid);
    const annotationData = {
      annotation: fullAnnotation,
      ...additionalData,
    };

    annotationData.annotation = this.annotationAdapter.format(
      annotationData.annotation,
      "",
      isNew,
    );

    this.eventListener.sendEvent(
      event,
      mouseEvent,
      annotationData as AnnotationEventData,
    );

    return fullAnnotation;
  }
}
