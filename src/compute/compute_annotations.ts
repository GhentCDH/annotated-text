import { TextAnnotationModel, TextLine } from "./annotation.model";
import { createAnnotationModel } from "./1_create_annotation_model";
import {
  assignAnnotationsToLines,
  reAssignAnnotationToLine,
} from "./2_assign_annotation_to_line";
import { computeAnnotationsOnLines } from "./3_compute_annotations_on_line";
import { drawAnnotations, drawText } from "./draw";
import { computeLinePositions, computePositions } from "./4_compute_positions";
import { styles } from "./styles.const";
import { AnnotationConfig } from "./model/annotation.config";
import { IdCollection } from "./model/id.collection";
import { AnnotationSvg } from "./model/svg.types";
import { Annotation, Line } from "../index";

export class ComputeAnnotations {
  private textAnnotationModel: TextAnnotationModel;
  private annotations: Annotation[];
  private element: HTMLElement;
  private textElement: HTMLElement;
  private svgElement: AnnotationSvg;
  private svgNode: SVGElement;
  private resizeObserver: ResizeObserver;

  constructor(
    lines: Line[],
    private readonly config: Partial<AnnotationConfig> = {},
  ) {
    this.textAnnotationModel = createAnnotationModel(config, lines);
  }

  public setLines(lines: Line[]): void {
    this.textAnnotationModel = createAnnotationModel(this.config, lines);
    this.setAnnotations(this.annotations ?? []);
  }

  public setAnnotations(annotations: Annotation[]): void {
    this.annotations = annotations;
    this.textAnnotationModel = assignAnnotationsToLines(
      this.textAnnotationModel,
      annotations,
    );
    this.textAnnotationModel = computeAnnotationsOnLines(
      this.textAnnotationModel,
    );
  }

  public updateAnnotation(annotation: Annotation): void {
    this.textAnnotationModel = reAssignAnnotationToLine(
      this.textAnnotationModel,
      annotation,
    );
    this.textAnnotationModel = computePositions(
      this.textAnnotationModel,
      this.textElement,
    );
  }

  public getLines(): TextLine[] {
    return this.textAnnotationModel.lines;
  }

  private drawText() {
    this.textElement = drawText(this.textAnnotationModel);
  }

  private drawSvg() {
    this.svgElement = drawAnnotations(
      this.textElement,
      this.textAnnotationModel,
    );
    this.highlightedIds.colorIds(this.svgElement);
    this.activeIds.colorIds(this.svgElement);
  }

  public init(id: string) {
    if (this.textElement) {
      console.warn("element already initialized");
      return;
    }
    this.element = document.getElementById(id);
    this.element.innerHTML = "";

    this.drawText();
    this.element.append(this.textElement);

    this.redrawSvg();
    this.element.classList.add(styles.wrapper);

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        this.redrawSvg();
      }
    });

    if (this.element) {
      this.resizeObserver.observe(this.element);
    }
  }

  private redrawSvg() {
    if (this.svgNode) {
      this.element.removeChild(this.svgNode);
    }
    this.textAnnotationModel = computeLinePositions(
      this.textAnnotationModel,
      this.textElement,
    );

    this.textAnnotationModel = computePositions(
      this.textAnnotationModel,
      this.textElement,
    );

    this.drawSvg();
    this.svgNode = this.svgElement.node();
    this.element.append(this.svgNode);
  }

  public destroy() {
    this.resizeObserver.unobserve(this.element);
    this.resizeObserver.disconnect();
  }

  private highlightedIds = new IdCollection("hover");

  public highlightAnnotations(ids: string[]): void {
    return;
    this.highlightedIds.changeIds(
      this.svgElement,
      ids?.map((i) => this.textAnnotationModel.getAnnotationDraw(i)[0]) ?? [],
      [],
      // this.activeIds.getIds(),
    );
    // TODO decide which one has more priority?
    this.activeIds.colorIds(this.svgElement);
  }

  private activeIds = new IdCollection("active");

  public selectAnnotations(ids: string[]): void {
    this.highlightedIds.removeId(ids);
    this.activeIds.changeIds(
      this.svgElement,
      ids?.map((i) => this.textAnnotationModel.getAnnotationDraw(i)[0]) ?? [],
      [],
    );
    // TODO decide which one has more priority?
  }
}
