import {
  calculateAnnotationWeights,
  calculateGutterAnnotationWeightsAndEnrich,
} from "./utils/weights";
import {
  type Annotation,
  type AnnotationId,
  type TextAnnotation,
  type TextLine,
} from "../model";

import { EventListener } from "../events/event.listener";
import { TextDirection } from "../adapter/text";

export type Dimensions = {
  height: number;
  x: number;
  y: number;
};

export type AnnotationDrawColor = {
  fill: string;
  border?: string;
};

export type AnnotationDraw = {
  uuid: string;
  annotationUuid: AnnotationId;
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

export interface TextAnnotationModel {
  // Configuration for the annotation model
  textDirection: TextDirection;

  // Event listener
  eventListener: EventListener;

  /**
   * If blockevents is true some events are blocked like editing or creating
   */
  blockEvents: boolean;
  lines: TextLine[];

  gutterAnnotations: TextAnnotation[];
  drawAnnotations: AnnotationDraw[];

  annotations: TextAnnotation[];

  textLength: number;

  clearDrawAnnotation(): void;

  addDrawAnnotation(annotation: AnnotationDraw): void;

  getDrawAnnotations(annotationUuid: AnnotationId): AnnotationDraw[];

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
  getAnnotation(id: AnnotationId): TextAnnotation;

  getAnnotationDraw(annotationUuid: AnnotationId): AnnotationDraw[];

  getAnnotations(line: number): Annotation[];

  getLinesForAnnotation(annotationId: AnnotationId): TextLine[];

  maxGutterWeight: number;
  maxLineWeight: number;

  calculateAllWeights(): void;

  getLine(lineUid: string): TextLine | undefined;
}

export class TextAnnotationModelImpl implements TextAnnotationModel {
  textDirection: TextDirection;
  blockEvents: boolean = false;

  readonly annotationLineMap = new Map<AnnotationId, TextLine[]>();
  readonly annotationsMap = new Map<AnnotationId, TextAnnotation>();
  maxGutterWeight: number = 0;
  maxLineWeight: number = 0;
  readonly gutterAnnotationIds = new Set<AnnotationId>();
  public textLength = 0;
  drawAnnotations: AnnotationDraw[] = [];
  private readonly lineAnnotationMap = new Map<number, TextAnnotation[]>();
  private readonly lineGutterMap = new Map<number, TextAnnotation[]>();

  constructor(
    public readonly lines: TextLine[],
    public readonly eventListener: EventListener,
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
    return Array.from(this.gutterAnnotationIds).map((id) =>
      this.annotationsMap.get(id),
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

    if (annotation.isGutter) {
      this.setGutterAnntoation(annotation, lines);
    } else {
      this.annotationsMap.set(annotation.id, annotation);
    }

    const lineMap = annotation.isGutter
      ? this.lineGutterMap
      : this.lineAnnotationMap;
    lines.forEach((line) => lineMap.get(line.lineNumber).push(annotation));

    if (calculateWeights) {
      if (annotation.isGutter) this.calculateMaxGutterWeight();
      else this.calculateLinesWeights();
    }
  }

  private setGutterAnntoation(annotation: TextAnnotation, lines: TextLine[]) {
    this.gutterAnnotationIds.add(annotation.id);
    this.annotationsMap.set(annotation.id, annotation);
  }

  removeAnnotation(annotation: TextAnnotation, calculateWeights = true): void {
    const originalLines = this.annotationLineMap.get(annotation.id) ?? [];
    this.annotationsMap.delete(annotation.id);
    if (annotation.isGutter) {
      this.gutterAnnotationIds.delete(annotation.id);
      this.removeAnnotationGutter(originalLines, annotation);
    } else {
      this.removeAnnotationFromLine(originalLines, annotation);
    }

    this.annotationLineMap.delete(annotation.id);

    if (calculateWeights) {
      if (annotation.isGutter) this.calculateMaxGutterWeight();
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
