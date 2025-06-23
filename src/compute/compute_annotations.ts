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
import { splitTextInLines } from "./utils/split-text-in-lines";
import { Line } from "../types/AnnotatedText";
import { Annotation } from "../types/Annotation";
import { Debugger } from "../utils/debugger";

const document = globalThis.document || null;

export class ComputeAnnotations {
  private textAnnotationModel: TextAnnotationModel;
  private annotations: Annotation[];
  private element: HTMLElement;
  private textElement: HTMLElement;
  private svgModel: SvgModel;
  private svgNode: SVGElement;
  private resizeObserver: ResizeObserver;
  private lines: Line[];
  private config: Partial<AnnotationConfig>;

  constructor(config: Partial<AnnotationConfig> = {}) {
    this.lines = [];
    this.config = config;
  }

  get completeConfig() {
    return this.textAnnotationModel.config;
  }

  public setText(text: string, redraw = true): void {
    this.setLines(splitTextInLines(text), redraw);
  }

  public setLines(lines: Line[], redraw = true): void {
    this.lines = lines;
    this.textAnnotationModel = createAnnotationModel(this.config, lines);
    this.setAnnotations(this.annotations ?? [], redraw);
  }

  public setAnnotations(annotations: Annotation[], redraw = true): void {
    this.annotations = annotations;

    if (!this.textAnnotationModel) {
      Debugger.debug("Annotations set before lines, cannot set annotations");
      return;
    }

    if (!this.lines?.length) {
      Debugger.debug("------ no lines set, cannot set annotations");
      return;
    }

    this.textAnnotationModel = assignAnnotationsToLines(
      this.textAnnotationModel,
      annotations,
    );
    this.textAnnotationModel = computeAnnotationsOnLines(
      this.textAnnotationModel,
    );

    if (redraw) this.redrawSvg();
  }

  private drawText() {
    this.textElement = drawText(this.textAnnotationModel);
  }

  private drawSvg() {
    this.svgModel.drawAnnotations();
    this.highlightedIds.colorIds(this.svgModel);
    this.activeIds.colorIds(this.svgModel);
  }

  public init(id: string) {
    if (this.textElement) {
      console.warn("element already initialized, clear and reainitialize");
    }

    this.element = document?.getElementById(id);
    if (!this.element) {
      console.error("element not found", id);
      return;
    }

    this.element.innerHTML = "";

    if (!this.textAnnotationModel) {
      return;
    }
    this.redrawSvg();
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
    this.element.append(this.textElement);
    this.textAnnotationModel = computeLinePositions(
      this.textAnnotationModel,
      this.textElement,
    );

    this.textAnnotationModel = computePositions(
      this.textAnnotationModel,
      this.textElement,
    );

    this.svgModel = new SvgModel(this.textElement, this.textAnnotationModel);

    this.svgNode = this.svgModel.node();
    this.element.prepend(this.svgNode);
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

  public highlightAnnotations(ids: string[]): void {
    this.highlightedIds.changeIds(
      this.svgModel,
      ids?.map((i) => this.textAnnotationModel.getAnnotationDraw(i)[0]) ?? [],
      [],
      // this.activeIds.getIds(),
    );
    // TODO decide which one has more priority?
    this.activeIds.colorIds(this.svgModel);
  }

  private activeIds = new IdCollection("active");

  public selectAnnotations(ids: string[]): void {
    this.highlightedIds.removeId(ids);
    this.activeIds.changeIds(
      this.svgModel,
      ids?.map((i) => this.textAnnotationModel.getAnnotationDraw(i)[0]) ?? [],
      [],
    );
    // TODO decide which one has more priority?
  }

  public changeConfig(config: Partial<AnnotationConfig>) {
    // TODO only regenerate what is needed
    // For now the annotations render quite fast so to be evaluated
    const id = this.element.id;
    this.destroy();
    this.config = config;
    this.textAnnotationModel = createAnnotationModel(config, this.lines);
    this.setLines(this.lines);
    this.setAnnotations(this.annotations);
    this.init(id);
  }
}
