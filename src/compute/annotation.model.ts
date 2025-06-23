import { isGutter } from "./utils/predicates";
import { AnnotationConfig } from "./model/annotation.config";
import {
  calculateAnnotationWeights,
  calculateGutterAnnotationWeightsAndEnrich,
} from "./utils/weights";
import { Line } from "../types/AnnotatedText";
import { Annotation } from "../types/Annotation";
import { AnnotationColor } from "../types/AnnotationColor";
import { TextAnnotationParserConfig } from "../parser/annotation";

export type Dimensions = {
  height: number;
  x: number;
  y: number;
};

export type TextAnnotation = Annotation & {
  weight: number;
  isGutter: boolean;
};

export type TextAnnotationColor = AnnotationColor & {};

export type AnnotationDrawColor = {
  fill: string;
  border?: string;
};

export type AnnotationDraw = {
  uuid: string;
  annotationUuid: string;
  lineNumber: number;
  path: { border?: string; fill: string };
  draggable: {
    start?: Dimensions;
    end?: Dimensions;
  };
  weight: number;
  color: {
    default: AnnotationDrawColor;
    active: AnnotationDrawColor;
    hover: AnnotationDrawColor;
  };
};

export type AnnotatedGutter = TextAnnotation & {
  // totalLines: number;
  // firstLine: number;
};

export type TextLine = Line & {
  lineNumber: number;
  uuid: string;
  color: TextAnnotationColor;
  dimensions: Dimensions;
  element: HTMLElement;
  maxLineWeight: number;
};

export interface TextAnnotationModel {
  /**
   * If blockevents is true some events are blocked like editing or creating
   */
  blockEvents: boolean;
  lines: TextLine[];

  gutterAnnotations: AnnotatedGutter[];
  drawAnnotations: AnnotationDraw[];

  annotations: TextAnnotation[];

  textLength: number;

  clearDrawAnnotation(): void;

  addDrawAnnotation(annotation: AnnotationDraw): void;

  getDrawAnnotations(annotationUuid: string): AnnotationDraw[];

  resetAnnotations(): void;

  setAnnotation(
    annotation: TextAnnotation,
    lines: TextLine[],
    calculateWeights?: boolean,
  ): void;

  removeAnnotation(
    annotation: TextAnnotation,
    calculateWeights?: boolean,
  ): void;

  // getGutter(line: number): Annotation[];
  getAnnotation(id: string): Annotation;

  getAnnotationDraw(annotationUuid: string): AnnotationDraw[];

  getAnnotations(line: number): Annotation[];

  getLinesForAnnotation(annotationId: string): TextLine[];

  maxGutterWeight: number;
  maxLineWeight: number;

  calculateAllWeights(): void;

  config: AnnotationConfig;

  getLine(lineUid: string): TextLine | undefined;

  parser?: TextAnnotationParserConfig<any>;
}

export class TextAnnotationModelImpl implements TextAnnotationModel {
  blockEvents: boolean = false;
  readonly annotationLineMap: Map<string, TextLine[]> = new Map<
    string,
    TextLine[]
  >();
  readonly annotationsMap: Map<string, TextAnnotation> = new Map<
    string,
    TextAnnotation | AnnotatedGutter
  >();
  maxGutterWeight: number = 0;
  maxLineWeight: number = 0;
  readonly gutterAnnotationIds = new Set<string>();
  public textLength = 0;
  drawAnnotations: AnnotationDraw[] = [];
  private readonly lineAnnotationMap = new Map<number, TextAnnotation[]>();
  private readonly lineGutterMap = new Map<number, TextAnnotation[]>();
  public parser?: TextAnnotationParserConfig<any>;

  constructor(
    public readonly config: AnnotationConfig,
    public readonly lines: TextLine[],
  ) {
    this.resetAnnotations();
  }

  resetAnnotations() {
    this.annotationLineMap.clear();
    this.annotationsMap.clear();
    this.maxGutterWeight = 0;
    this.maxLineWeight = 0;
    this.gutterAnnotationIds.clear();
    this.drawAnnotations = [];
    this.textLength = 0;
    this.lines.forEach((line) => {
      this.lineAnnotationMap.set(line.lineNumber, []);
      this.lineGutterMap.set(line.lineNumber, []);
      if (this.textLength < line.end) {
        this.textLength = line.end;
      }
    });
  }

  get gutterAnnotations() {
    return Array.from(this.gutterAnnotationIds).map(
      (id) => this.annotationsMap.get(id) as AnnotatedGutter,
    );
  }

  get annotations() {
    return Array.from(this.annotationsMap.values()) as TextAnnotation[];
  }

  getDrawAnnotations(annotationUuid: string): AnnotationDraw[] {
    return this.drawAnnotations.filter(
      (d) => d.annotationUuid === annotationUuid,
    );
  }

  getAnnotation(id: string) {
    return this.annotationsMap.get(id);
  }

  getAnnotationDraw(id: string) {
    return this.drawAnnotations.filter((d) => d.annotationUuid === id);
  }

  clearDrawAnnotation() {
    this.drawAnnotations = [];
  }

  addDrawAnnotation(annotation: AnnotationDraw) {
    this.drawAnnotations.push(annotation);
  }

  getLine(lineUid: string) {
    return this.lines.find((line) => line.uuid === lineUid);
  }

  getAnnotations(line: number): Annotation[] {
    return this.lineAnnotationMap.get(line) || [];
  }

  getLinesForAnnotation(annotationId: string): TextLine[] {
    return this.annotationLineMap.get(annotationId) ?? [];
  }

  setAnnotation(
    annotation: TextAnnotation,
    lines: TextLine[],
    calculateWeights = true,
  ): void {
    this.annotationLineMap.set(annotation.id, lines);
    annotation.isGutter = isGutter(annotation.target);

    if (isGutter(annotation.target)) {
      this.setGutterAnntoation(annotation, lines);
    } else {
      this.annotationsMap.set(annotation.id, annotation);
    }

    const lineMap = isGutter(annotation.target)
      ? this.lineGutterMap
      : this.lineAnnotationMap;
    lines.forEach((line) => lineMap.get(line.lineNumber).push(annotation));

    if (calculateWeights) {
      if (isGutter(annotation.target)) this.calculateMaxGutterWeight();
      else this.calculateLinesWeights();
    }
  }

  private setGutterAnntoation(annotation: TextAnnotation, lines: TextLine[]) {
    this.gutterAnnotationIds.add(annotation.id);
    this.annotationsMap.set(annotation.id, {
      ...annotation,
      totalLines: lines.length,
      // lines are sorted!
      // firstLine: lines[0].lineNumber,
    } as AnnotatedGutter);
  }

  removeAnnotation(annotation: TextAnnotation, calculateWeights = true): void {
    const originalLines = this.annotationLineMap.get(annotation.id) ?? [];
    this.annotationsMap.delete(annotation.id);
    if (isGutter(annotation.target)) {
      this.gutterAnnotationIds.delete(annotation.id);
      this.removeAnnotationGutter(originalLines, annotation);
    } else {
      this.removeAnnotationFromLine(originalLines, annotation);
    }

    this.annotationLineMap.delete(annotation.id);

    if (calculateWeights) {
      if (isGutter(annotation.target)) this.calculateMaxGutterWeight();
      else this.calculateLinesWeights();
    }

    this.drawAnnotations = this.drawAnnotations.filter(
      (a) => a.annotationUuid !== annotation.id,
    );
  }

  private removeAnnotationFromLine(
    originalLines: TextLine[],
    annotation: TextAnnotation,
  ): void {
    originalLines.forEach((line) => {
      const lineAnnotationMap = this.lineAnnotationMap
        .get(line.lineNumber)
        .filter((a) => a.id !== annotation.id);
      this.lineAnnotationMap.set(line.lineNumber, lineAnnotationMap);
    });
  }

  private removeAnnotationGutter(
    originalLines: TextLine[],
    annotation: TextAnnotation,
  ): void {
    originalLines.forEach((line) => {
      const lineGutterMap = this.lineGutterMap
        .get(line.lineNumber)
        .filter((a) => a.id !== annotation.id);
      this.lineGutterMap.set(line.lineNumber, lineGutterMap);
    });
  }

  calculateMaxGutterWeight() {
    this.maxGutterWeight = calculateGutterAnnotationWeightsAndEnrich(
      this,
      this.gutterAnnotations,
    );
  }

  calculateLinesWeights() {
    this.maxLineWeight = calculateAnnotationWeights(
      this.lines,
      this.lineAnnotationMap,
    );
  }

  calculateAllWeights() {
    this.calculateMaxGutterWeight();
    this.calculateLinesWeights();
  }
}
