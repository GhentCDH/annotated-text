import {
  ErrorEventCallback,
  EventCallback,
  LineAdapter,
} from "@ghentcdh/vue-component-annotated-text";
import { TextAnnotationModel } from "./annotation.model";
import { createAnnotationModel } from "./1_create_annotation_model";
import { assignAnnotationsToLines } from "./2_assign_annotation_to_line";
import { computeAnnotationsOnLines } from "./3_compute_annotations_on_line";
import { drawText } from "./draw/text";
import { computeLinePositions, computePositions } from "./4_compute_positions";
import { styles } from "./styles.const";
import { AnnotationConfig } from "./model/annotation.config";
import { IdCollection } from "./model/id.collection";
import { SvgModel } from "./model/svg.types";
import { Debugger } from "../utils/debugger";
import { AnnotationAdapter } from "../adapter/annotation";
import { EventListener, EventListenerType } from "../events/event.listener";

const document = globalThis.document || null;

export type CreateAnnotations<LINE, ANNOTATION> = {
  setLines: (
    lines: LINE,
    redraw?: boolean,
  ) => CreateAnnotations<LINE, ANNOTATION>;
  setAnnotations: <ANNOTATION = any>(
    annotations: ANNOTATION[],
    redraw?: boolean,
  ) => CreateAnnotations<LINE, ANNOTATION>;
  highlightAnnotations: (ids: string[]) => CreateAnnotations<LINE, ANNOTATION>;
  selectAnnotations: (ids: string[]) => CreateAnnotations<LINE, ANNOTATION>;
  changeConfig: (
    config: Partial<AnnotationConfig>,
  ) => CreateAnnotations<LINE, ANNOTATION>;
  on: (
    event: EventListenerType,
    callback: EventCallback,
  ) => CreateAnnotations<LINE, ANNOTATION>;
  onError: (
    callback: ErrorEventCallback,
  ) => CreateAnnotations<LINE, ANNOTATION>;
  destroy: () => CreateAnnotations<LINE, ANNOTATION>;
  lineAdapter: LineAdapter<LINE>;
  annotationAdapter: AnnotationAdapter<ANNOTATION>;
};

export class CreateAnnotationsImpl<LINE, ANNOTATION>
  implements CreateAnnotations<LINE, ANNOTATION>
{
  private textAnnotationModel: TextAnnotationModel;
  private annotations: ANNOTATION[];
  private element: HTMLElement;
  private textElement: HTMLElement;
  private svgModel: SvgModel;
  private svgNode: SVGElement;
  private resizeObserver: ResizeObserver;
  private lines: LINE;
  private config: Partial<AnnotationConfig>;
  private eventListener = new EventListener();

  constructor(
    private readonly id: string,
    public readonly lineAdapter: LineAdapter<LINE>,
    public readonly annotationAdapter: AnnotationAdapter<ANNOTATION>,
    config: Partial<AnnotationConfig> = {},
  ) {
    this.config = config;
    this.init();
    this.annotationAdapter.setConfigListener(this.configListener());
    this.lineAdapter.setConfigListener(this.configListener());
  }

  private configListener() {
    return () => {
      this.recreateAnnotationModel();
    };
  }

  private createAnnotationModel() {
    this.textAnnotationModel = createAnnotationModel(
      this.config,
      this.lines,
      this.lineAdapter,
      this.eventListener,
    );

    return this;
  }

  public setLines(lines: LINE, redraw = true) {
    this.lines = lines;
    this.createAnnotationModel().setAnnotations(this.annotations ?? [], redraw);
    return this;
  }

  public setAnnotations<ANNOTATION>(annotations: ANNOTATION[], redraw = true) {
    this.annotations = annotations;

    if (!this.textAnnotationModel) {
      Debugger.debug("Annotations set before lines, cannot set annotations");
      return this;
    }

    if (!this.lines) {
      Debugger.debug("------ no lines set, cannot set annotations");
      return this;
    }

    this.textAnnotationModel = assignAnnotationsToLines<ANNOTATION>(
      this.textAnnotationModel,
      this.annotationAdapter,
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
    this.textElement = drawText(this.textAnnotationModel);
  }

  private drawSvg() {
    this.svgModel.drawAnnotations();
    this.highlightedIds.colorIds(this.svgModel);
    this.activeIds.colorIds(this.svgModel);
  }

  private init() {
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
    );

    this.svgModel = new SvgModel(
      this.textElement,
      this.textAnnotationModel,
      this.eventListener,
      this.annotationAdapter,
    );

    this.svgNode = this.svgModel.node();
    this.element?.prepend(this.svgNode);
    this.drawSvg();
  }

  public destroy() {
    if (this.element) {
      this.resizeObserver?.unobserve(this.element);
      this.element.innerHTML = "";
    }
    this.resizeObserver?.disconnect();
    this.textElement = null;
    this.svgNode = null;
    this.textAnnotationModel = null;
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
    this.createAnnotationModel().setAnnotations(this.annotations);
    return this;
  }
}
