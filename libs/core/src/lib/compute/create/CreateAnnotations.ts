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
import { Debugger } from "../../utils/debugger";
import { computeLinePositions, computePositions } from "../4_compute_positions";
import { styles } from "../styles.const";
import { computeAnnotationsOnLines } from "../3_compute_annotations_on_line";
import { assignAnnotationsToLines } from "../2_assign_annotation_to_line";
import { ErrorEventCallback, EventCallback } from "../../events";
import { drawText } from "../draw/text/text";
import { recreateAnnotation } from "../draw/annotations/draw";
import { Annotation, AnnotationId } from "../../model";
import { AnnotationColors } from "../model/annotation.colors";
import {
  AnnotationRender,
  AnnotationStyle,
} from "../../adapter/annotation/renderer/annotation-render";

const document = globalThis.document || null;
export type BaseAnnotation = Pick<Annotation, "id">;

export class CreateAnnotationsImpl<ANNOTATION extends BaseAnnotation>
  implements AnnotatedText<ANNOTATION>
{
  private textAnnotationModel: TextAnnotationModel | null = null;
  private annotationsMap = new Map<AnnotationId, ANNOTATION>();
  private element: HTMLElement;
  private textElement: HTMLDivElement | null | undefined = null;
  private svgModel: SvgModel;
  private svgNode: SVGElement | null = null;
  private resizeObserver: ResizeObserver;
  private text: string;
  private readonly eventListener = new EventListener();
  private readonly annotationColors = new AnnotationColors();

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
      this.annotationAdapter,
    );

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
      this.eventListener,
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
      this.textAnnotationModel!,
      this.textAdapter,
      this.annotationAdapter,
    );

    return this;
  }

  private drawSvg() {
    this.svgModel.drawAnnotations();
    this.annotationColors.color(this.svgModel);
  }

  private init() {
    if (!document) return;
    const id = this.id;
    if (this.textElement) {
      console.warn("element already initialized, clear and reinitialize");
    }

    this.element = document?.getElementById(id) as HTMLDivElement;
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

    const textElement = this.textElement!;
    this.element?.append(textElement);
    this.textAnnotationModel = computeLinePositions(
      this.textAnnotationModel!,
      textElement,
    );

    this.textAnnotationModel = computePositions(
      this.textAnnotationModel,
      textElement,
      this.annotationAdapter,
      this.textAdapter,
    );

    this.svgModel = new SvgModel(
      textElement,
      this.textAnnotationModel,
      this.eventListener,
      this.annotationAdapter,
      this.textAdapter,
      this.annotationColors,
    );

    this.svgNode = this.svgModel.node();
    this.element?.prepend(this.svgNode!);
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

  public highlightAnnotations(ids: AnnotationId[]) {
    this.annotationColors.highlightAnnotations(ids, this.svgModel);
    return this;
  }

  public selectAnnotations(ids: AnnotationId[]) {
    this.annotationColors.selectAnnotations(ids, this.svgModel);
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
  ): this {
    this.annotationAdapter.setConfig(key, value);
    return this;
  }

  changeTextAdapterConfig<KEY extends TEXT_CONFIG_KEYS>(
    key: KEY,
    value: TEXT_CONFIG_VALUES<KEY>,
  ): this {
    this.textAdapter.setConfig(key, value);
    return this;
  }

  scrollToAnnotation(id: AnnotationId): this {
    const lines = this.textAnnotationModel?.getLinesForAnnotation(id);
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

  addAnnotation(annotation: ANNOTATION): this {
    // TODO not sure if we should check
    if (this.annotationsMap.has(annotation.id)) {
      return this.updateAnnotation(annotation.id, annotation);
    }
    recreateAnnotation(
      this.svgModel,
      this.annotationAdapter.parse(annotation) as any,
    );
    return this;
  }

  updateAnnotation(id: AnnotationId, annotation: ANNOTATION): this {
    // TODO not sure if we should check
    if (!this.annotationsMap.has(annotation.id)) {
      return this.addAnnotation(annotation);
    }
    recreateAnnotation(
      this.svgModel,
      this.annotationAdapter.parse(annotation) as any,
    );

    return this;
  }

  deleteAnnotation(id: AnnotationId): this {
    if (!this.textAnnotationModel) return this;
    const annotation = this.textAnnotationModel.getAnnotation(id);
    this.textAnnotationModel.removeAnnotation(annotation, true);
    this.svgModel.removeAnnotations(annotation.id);
    this.annotationsMap.delete(annotation.id);

    return this;
  }

  registerRender<STYLE extends AnnotationStyle>(
    render: AnnotationRender<STYLE>,
  ) {
    this.annotationAdapter.renderInstance.registerRender(render);
    return this;
  }

  updateRenderStyle<STYLE extends AnnotationStyle>(
    name: string,
    style: Partial<STYLE>,
  ) {
    this.annotationAdapter.renderInstance.updateRenderStyle(name, style);
    return this;
  }
}
