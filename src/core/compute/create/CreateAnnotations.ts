import { AnnotatedText } from "./CreateAnnotations.model";
import { TextAnnotationModel } from "../annotation.model";
import { EventListener, EventListenerType } from "../../events/event.listener";
import {
  TEXT_CONFIG_KEYS,
  TEXT_CONFIG_VALUES,
  TextAdapter,
} from "../../adapter/text";
import {
  ANNOTATION_CONFIG_KEYS,
  ANNOTATION_CONFIG_VALUES,
  AnnotationAdapter,
} from "../../adapter/annotation";
import { createAnnotationModel } from "../1_create_annotation_model";
import { SvgModel } from "../model/svg.types";
import { IdCollection } from "../model/id.collection";
import { Debugger } from "../../utils/debugger";
import { computeLinePositions, computePositions } from "../4_compute_positions";
import { styles } from "../styles.const";
import { computeAnnotationsOnLines } from "../3_compute_annotations_on_line";
import { assignAnnotationsToLines } from "../2_assign_annotation_to_line";
import { ErrorEventCallback, EventCallback } from "../../events";
import { drawText } from "../draw/text";
import { recreateAnnotation } from "../draw/annotations/draw";
import { AnnotationId } from "../../model";

const document = globalThis.document || null;
export type BaseAnnotation = { id: AnnotationId };

export class CreateAnnotationsImpl<ANNOTATION extends BaseAnnotation>
  implements AnnotatedText<ANNOTATION>
{
  private textAnnotationModel: TextAnnotationModel;
  private annotationsMap = new Map<AnnotationId, ANNOTATION>();
  private element: HTMLElement;
  private textElement: HTMLElement;
  private svgModel: SvgModel;
  private svgNode: SVGElement;
  private resizeObserver: ResizeObserver;
  private text: string;
  private eventListener = new EventListener();

  constructor(
    private readonly id: string,
    private readonly textAdapter: TextAdapter,
    private readonly annotationAdapter: AnnotationAdapter<ANNOTATION>,
  ) {
    this.init();
    this.annotationAdapter.setConfigListener(this.configListener());
    this.textAdapter.setConfigListener(this.configListener());
  }

  private configListener() {
    return () => {
      this.recreateAnnotationModel();
    };
  }

  private createAnnotationModel() {
    this.textAnnotationModel = createAnnotationModel(
      this.text,
      this.textAdapter,
      this.eventListener,
    );
    this.annotationAdapter.setText(this.text);

    return this;
  }

  private annotations() {
    return Array.from(this.annotationsMap.values());
  }

  public setText(text: string, redraw = true) {
    this.text = text || "";
    this.createAnnotationModel();
    this.setAnnotations(this.annotations(), redraw);

    return this;
  }

  public setAnnotations(annotations: ANNOTATION[], redraw = true) {
    this.annotationsMap.clear();
    annotations.forEach((annotation) => {
      this.annotationsMap.set(annotation.id, annotation);
    });

    if (!this.textAnnotationModel) {
      Debugger.debug("Annotations set before lines, cannot set annotations");
      return this;
    }

    if (!this.text) {
      Debugger.debug("------ no lines set, cannot set annotations");
      return this;
    }

    this.textAnnotationModel = assignAnnotationsToLines(
      this.textAnnotationModel,
      this.annotationAdapter,
      this.textAdapter,
      annotations,
    );
    this.textAnnotationModel = computeAnnotationsOnLines(
      this.textAnnotationModel,
    );

    if (redraw) this.redrawSvg();

    return this;
  }

  public on(event: EventListenerType, callback: EventCallback) {
    this.eventListener.register(event, callback);
    return this;
  }

  public onError(callback: ErrorEventCallback) {
    this.eventListener.registerError(callback);
    return this;
  }

  private drawText() {
    this.textElement = drawText(
      this.textAnnotationModel,
      this.textAdapter,
      this.annotationAdapter,
    );
  }

  private drawSvg() {
    this.svgModel.drawAnnotations();
    this.highlightedIds.colorIds(this.svgModel);
    this.activeIds.colorIds(this.svgModel);
  }

  private init() {
    if (!document) return;
    const id = this.id;
    if (this.textElement) {
      console.warn("element already initialized, clear and reainitialize");
    }

    this.element = document?.getElementById(id);
    if (!this.element) {
      console.error("element not found", id);
      return;
    }

    this.element.innerHTML = "";

    this.element.classList.add(styles.wrapper);

    let initialized = false;
    this.resizeObserver = new ResizeObserver((entries) => {
      Debugger.debug("resize detected", initialized);
      if (initialized) this.redrawSvg();
      initialized = true;
    });
    if (this.element) {
      this.resizeObserver.observe(this.element);
    }

    if (!this.textAnnotationModel) {
      return;
    }
    this.redrawSvg();
  }

  private redrawSvg() {
    if (!document) return;
    // if (!this.textElement) {
    //   console.warn("text element not initialized, cannot redraw svg");
    //   return;
    // }
    if (this.svgNode) {
      this.element?.removeChild(this.svgNode);
    }
    if (this.textElement) {
      this.element?.removeChild(this.textElement);
    }
    this.drawText();
    this.element?.append(this.textElement);
    this.textAnnotationModel = computeLinePositions(
      this.textAnnotationModel,
      this.textElement,
    );

    this.textAnnotationModel = computePositions(
      this.textAnnotationModel,
      this.textElement,
      this.annotationAdapter,
      this.textAdapter,
    );

    this.svgModel = new SvgModel(
      this.textElement,
      this.textAnnotationModel,
      this.eventListener,
      this.annotationAdapter,
      this.textAdapter,
    );

    this.svgNode = this.svgModel.node();
    this.element?.prepend(this.svgNode);
    this.drawSvg();
  }

  public destroy() {
    this.eventListener.sendEvent("destroy", null, null);
    if (this.element) {
      this.resizeObserver?.unobserve(this.element);
      this.element.innerHTML = "";
    }
    this.resizeObserver?.disconnect();
    this.textElement = null;
    this.svgNode = null;
    this.textAnnotationModel = null;

    return this;
  }

  private highlightedIds = new IdCollection("hover");

  public highlightAnnotations(ids: string[]) {
    this.highlightedIds.changeIds(
      this.svgModel,
      ids?.map((i) => this.textAnnotationModel.getAnnotationDraw(i)[0]) ?? [],
      [],
      // this.activeIds.getIds(),
    );
    // TODO decide which one has more priority?
    this.activeIds.colorIds(this.svgModel);
    return this;
  }

  private activeIds = new IdCollection("active");

  public selectAnnotations(ids: string[]) {
    this.highlightedIds.removeId(ids);
    this.activeIds.changeIds(
      this.svgModel,
      ids?.map((i) => this.textAnnotationModel.getAnnotationDraw(i)[0]) ?? [],
      [],
    );
    // TODO decide which one has more priority?
    return this;
  }

  private recreateAnnotationModel() {
    this.destroy();
    this.createAnnotationModel();
    this.annotationsMap.clear();
    this.annotations().forEach((annotation) => {
      this.annotationsMap.set(annotation.id, annotation);
    });
    this.redrawSvg();
    return this;
  }

  changeAnnotationAdapterConfig<KEY extends ANNOTATION_CONFIG_KEYS>(
    key: KEY,
    value: ANNOTATION_CONFIG_VALUES<KEY>,
  ) {
    this.annotationAdapter.setConfig(key, value);
    return this;
  }

  changeTextAdapterConfig<KEY extends TEXT_CONFIG_KEYS>(
    key: KEY,
    value: TEXT_CONFIG_VALUES<KEY>,
  ) {
    this.textAdapter.setConfig(key, value);
    return this;
  }

  scrollToAnnotation(id: string) {
    const lines = this.textAnnotationModel.getLinesForAnnotation(id);
    if (!lines) {
      console.warn("No lines found for annotation", id);
      return this;
    }

    const lineElement = lines[0].element;
    if (!lineElement) {
      console.warn("No line element found for annotation", id);
      return this;
    }
    lineElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
    return this;
  }

  addAnnotation(annotation: ANNOTATION): CreateAnnotationsImpl<ANNOTATION> {
    // TODO not sure if we should check
    if (this.annotationsMap.has(annotation.id)) {
      return this.updateAnnotation(annotation.id, annotation);
    }
    recreateAnnotation(this.svgModel, this.annotationAdapter.parse(annotation));
    return this;
  }

  updateAnnotation(
    id: AnnotationId,
    annotation: ANNOTATION,
  ): CreateAnnotationsImpl<ANNOTATION> {
    // TODO not sure if we should check
    if (!this.annotationsMap.has(annotation.id)) {
      return this.addAnnotation(annotation);
    }
    recreateAnnotation(this.svgModel, this.annotationAdapter.parse(annotation));
    return this;
  }

  deleteAnnotation(id: string): CreateAnnotationsImpl<ANNOTATION> {
    const annotation = this.textAnnotationModel.getAnnotation(id);
    this.textAnnotationModel.removeAnnotation(annotation, true);
    this.svgModel.removeAnnotations(annotation.id);
    this.annotationsMap.delete(annotation.id);

    return this;
  }
}
