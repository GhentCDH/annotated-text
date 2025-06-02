import { isGutter } from "./utils/predicates";
import { AnnotationConfig } from "./model/annotation.config";
import {
  calculateAnnotationWeights,
  calculateGutterAnnotationWeightsAndEnrich,
} from "./utils/weights";
import { Annotation, type AnnotationColor, Line } from "../index";

export type Dimensions = {
  width: number;
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
  dimensions: Dimensions;
  weight: number;
  color: {
    default: AnnotationDrawColor;
    active: AnnotationDrawColor;
    hover: AnnotationDrawColor;
  };
};

export type AnnotatedGutter = TextAnnotation & {
  totalLines: number;
  firstLine: number;
};

export type TextLine = Line & {
  lineNumber: number;
  uuid: string;
  color: TextAnnotationColor;
  dimensions: Dimensions;
  element: HTMLElement;
};

export interface TextAnnotationModel {
  lines: TextLine[];

  gutterAnnotations: AnnotatedGutter[];
  drawAnnotations: AnnotationDraw[];

  annotations: TextAnnotation[];

  clearDrawAnnotation(): void;

  addDrawAnnotation(annotation: AnnotationDraw): void;

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
  getAnnotation(id: number): Annotation;

  getAnnotationDraw(annotationUuid: string): AnnotationDraw[];

  getAnnotations(line: number): Annotation[];

  getLinesForAnnotation(annotationId: string): TextLine[];

  // getMaxLineWeight(line: number): number;

  maxGutterWeight: number;
  maxLineWeight: number;

  calculateAllWeights(): void;

  config: AnnotationConfig;
}

export class TextAnnotationModelImpl implements TextAnnotationModel {
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
  drawAnnotations: AnnotationDraw[] = [];

  constructor(
    public config: AnnotationConfig,
    public lines: TextLine[],
    private lineAnnotationMap: Map<number, TextAnnotation[]>,
    private lineGutterMap: Map<number, TextAnnotation[]>,
  ) {}

  get gutterAnnotations() {
    return Array.from(this.gutterAnnotationIds).map(
      (id) => this.annotationsMap.get(id) as AnnotatedGutter,
    );
  }

  get annotations() {
    return Array.from(this.annotationsMap.values()) as TextAnnotation[];
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
      firstLine: lines[0].lineNumber,
    } as AnnotatedGutter);
  }

  removeAnnotation(annotation: TextAnnotation, calculateWeights = true): void {
    const originalLines = this.annotationLineMap.get(annotation.id);
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
      this.gutterAnnotations,
    );
  }

  calculateLinesWeights() {
    this.maxLineWeight = calculateAnnotationWeights(this.lineAnnotationMap);
  }

  calculateAllWeights() {
    this.calculateMaxGutterWeight();
    this.calculateLinesWeights();
  }
}
