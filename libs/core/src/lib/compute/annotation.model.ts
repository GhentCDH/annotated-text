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
import { TextDirection } from "../adapter/text";

export type Dimensions = {
  height: number;
  x: number;
  y: number;
};

export type AnnotationDrawColor = {
  fill: string | undefined;
  border?: string | undefined;
};

export type AnnotationDrawColors = {
  default: AnnotationDrawColor;
  tag: { text: string; fill: string; border: string };
  active: AnnotationDrawColor;
  hover: AnnotationDrawColor;
  edit: AnnotationDrawColor;
};

export type AnnotationDrawPath = { border?: string; fill?: string };

export type AnnotationDraw = {
  uuid: string;
  annotationUuid: AnnotationId;
  lineNumber: number;
  path: AnnotationDrawPath;
  draggable: {
    start?: Dimensions;
    end?: Dimensions;
  };
  height: Dimensions;
  weight: number;
  // color: AnnotationDrawColors;
};

export type AnnotationDimension = {
  x: number;
  y1: number;
  y2: number;
};

export interface TextAnnotationModel {
  // Configuration for the annotation model
  textDirection: TextDirection;

  /**
   * If blockevents is true some events are blocked like editing or creating
   */
  blockEvents: boolean;
  lines: TextLine[];

  gutterAnnotations: TextAnnotation[];

  annotations: TextAnnotation[];

  textLength: number;

  getMinStartPosition(): number;

  getMaxStartPosition(): number;

  clearDrawAnnotation(): void;

  addDrawAnnotations(
    annotationUuid: AnnotationId,
    annotations: AnnotationDraw[],
    dimensions: AnnotationDimension,
    color: AnnotationDrawColors,
  ): void;

  getDrawAnnotations(annotationUuid: AnnotationId): AnnotationDraw[];

  getAnnotationColor(annotationUuid: AnnotationId): AnnotationDrawColors;

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

  getAnnotations(line: number): Annotation[];

  getLinesForAnnotation(annotationId: AnnotationId): TextLine[];

  maxGutterWeight: number;
  maxLineWeight: number;

  calculateAllWeights(): void;

  getLine(lineUid: string): TextLine | undefined;

  getDraws(): AnnotationDraw[];

  getAnnotationDimensions(
    annotationUuid: AnnotationId,
  ): AnnotationDimension | undefined;
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
  readonly drawAnnotationsMap = new Map<
    AnnotationId,
    {
      draws: AnnotationDraw[];
      dimensions: AnnotationDimension;
      color: AnnotationDrawColors;
    }
  >();
  private readonly lineAnnotationMap = new Map<number, TextAnnotation[]>();
  private readonly lineGutterMap = new Map<number, TextAnnotation[]>();

  constructor(public readonly lines: TextLine[]) {
    this.resetAnnotations();
  }

  resetAnnotations() {
    this.annotationLineMap.clear();
    this.annotationsMap.clear();
    this.maxGutterWeight = 0;
    this.maxLineWeight = 0;
    this.gutterAnnotationIds.clear();
    this.drawAnnotationsMap.clear();
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
      (id) => this.annotationsMap.get(id) as TextAnnotation,
    );
  }

  get annotations() {
    return Array.from(this.annotationsMap.values()) as TextAnnotation[];
  }

  getDraws(): AnnotationDraw[] {
    return this.annotations.map((a) => this.getDrawAnnotations(a.id)).flat();
  }

  getAnnotationColor(annotationUuid: AnnotationId): AnnotationDrawColors {
    const annotation = this.drawAnnotationsMap.get(annotationUuid);

    if (!annotation) {
      console.warn("No draw annotation found for id", annotationUuid);
    }
    return annotation?.color as AnnotationDrawColors;
  }

  getAnnotationDimensions(annotationUuid: AnnotationId) {
    return this.drawAnnotationsMap.get(annotationUuid)?.dimensions;
  }

  getDrawAnnotations(annotationUuid: AnnotationId): AnnotationDraw[] {
    return this.drawAnnotationsMap.get(annotationUuid)?.draws ?? [];
  }

  getAnnotation(id: string) {
    return this.annotationsMap.get(id) as TextAnnotation;
  }

  clearDrawAnnotation() {
    this.drawAnnotationsMap.clear();
  }

  addDrawAnnotations(
    annotationUuid: AnnotationId,
    annotations: AnnotationDraw[],
    dimensions: AnnotationDimension,
    color: AnnotationDrawColors,
  ) {
    this.drawAnnotationsMap.set(annotationUuid, {
      dimensions,
      draws: annotations,
      color,
    });
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

  getMinStartPosition(): number {
    // TODO cache this value
    return this.lines.length > 0 ? this.lines[0].start : 0;
  }

  getMaxStartPosition(): number {
    // TODO cache this value
    return this.lines.length > 0 ? this.lines[this.lines.length - 1].end : 0;
  }

  setAnnotation(
    annotation: TextAnnotation,
    lines: TextLine[],
    calculateWeights = true,
  ): void {
    this.annotationLineMap.set(annotation.id, lines);

    if (annotation.isGutter) {
      this.setGutterAnnotation(annotation, lines);
    } else {
      this.annotationsMap.set(annotation.id, annotation);
    }

    const lineMap = annotation.isGutter
      ? this.lineGutterMap
      : this.lineAnnotationMap;
    lines.forEach((line) => lineMap.get(line.lineNumber)!.push(annotation));

    if (calculateWeights) {
      if (annotation.isGutter) this.calculateMaxGutterWeight();
      else this.calculateLinesWeights();
    }
  }

  private setGutterAnnotation(annotation: TextAnnotation, lines: TextLine[]) {
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

    this.drawAnnotationsMap.delete(annotation.id);
  }

  private removeAnnotationFromLine(
    originalLines: TextLine[],
    annotation: TextAnnotation,
  ): void {
    originalLines.forEach((line) => {
      const lineAnnotationMap = this.lineAnnotationMap
        .get(line.lineNumber)!
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
        .get(line.lineNumber)!
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
