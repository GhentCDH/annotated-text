import { GutterCacheModel } from "./model/gutter.cache.model";
import { TextAnnotationCacheModel } from "./model/text.cache.model";
import {
  AnnotationDimension,
  AnnotationDraw,
  AnnotationDrawColors,
  type AnnotationId,
  type TextAnnotation,
  type TextLine,
} from "../model";
import { TextDirection } from "../adapter/text";
import { AnnotationRenderParams } from "../adapter/annotation/renderer/annotation-render";
import { RenderInstances } from "../adapter/annotation/renderer/render-instances";

export interface TextAnnotationModel {
  renderParams: AnnotationRenderParams;

  // Configuration for the annotation model
  textDirection: TextDirection;

  /**
   * If blockevents is true some events are blocked like editing or creating
   */
  blockEvents: boolean;
  lines: TextLine[];

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

  resetAnnotations(): void;

  setAnnotation(annotation: TextAnnotation, calculateWeights?: boolean): void;

  removeAnnotation(
    annotation: TextAnnotation,
    calculateWeights?: boolean,
  ): void;

  getAnnotation(id: AnnotationId): TextAnnotation;

  calculateAllWeights(): void;

  getLine(lineUid: string): TextLine | undefined;

  gutterModel: GutterCacheModel;
  annotationTextModel: TextAnnotationCacheModel;
}

export class TextAnnotationModelImpl implements TextAnnotationModel {
  textDirection: TextDirection;
  blockEvents: boolean = false;

  public readonly gutterModel: GutterCacheModel = new GutterCacheModel();
  public readonly annotationTextModel: TextAnnotationCacheModel =
    new TextAnnotationCacheModel();

  // readonly annotationLineMap = new Map<AnnotationId, TextLine[]>();
  readonly annotationsMap = new Map<AnnotationId, TextAnnotation>();

  public textLength = 0;

  constructor(
    public readonly lines: TextLine[],
    public readonly renderInstances: RenderInstances<any>,
  ) {
    this.resetAnnotations();
  }

  resetAnnotations() {
    this.annotationsMap.clear();
    this.textLength = 0;
    this.lines.forEach((line) => {
      if (this.textLength < line.end) {
        this.textLength = line.end;
      }
    });

    this.gutterModel.clear();
  }

  get renderParams(): AnnotationRenderParams {
    return {
      textDirection: this.textDirection,
      maxGutterWeight: this.gutterModel.maxGutterWeight,
    };
  }

  get annotations() {
    return Array.from(this.annotationsMap.values()) as TextAnnotation[];
  }

  getAnnotation(id: string) {
    return this.annotationsMap.get(id) as TextAnnotation;
  }

  clearDrawAnnotation() {
    this.annotationsMap.forEach((annotation) => {
      annotation._drawMetadata.draws = [];
      annotation._drawMetadata.color = undefined;
      annotation._drawMetadata.dimensions = undefined;
    });
  }

  addDrawAnnotations(
    annotationUuid: AnnotationId,
    annotations: AnnotationDraw[],
    dimensions: AnnotationDimension,
    color: AnnotationDrawColors,
  ) {
    this.annotationsMap.get(annotationUuid)!._drawMetadata.draws = annotations;
    this.annotationsMap.get(annotationUuid)!._drawMetadata.dimensions =
      dimensions;
    this.annotationsMap.get(annotationUuid)!._drawMetadata.color = color;
  }

  getLine(lineUid: string) {
    return this.lines.find((line) => line.uuid === lineUid);
  }

  // getAnnotations(line: number): Annotation[] {
  //   return this.lineAnnotationMap.get(line) || [];
  // }

  getMinStartPosition(): number {
    // TODO: Consider caching this value if profiling shows getMinStartPosition() is a performance bottleneck.
    //       Ensure the cache is invalidated whenever the 'lines' array is modified (added, removed, or reordered).
    return this.lines.length > 0 ? this.lines[0].start : 0;
  }

  getMaxStartPosition(): number {
    // TODO: Consider caching this value if profiling shows getMaxStartPosition() is a performance bottleneck.
    //       Ensure the cache is invalidated whenever the 'lines' array is modified (added, removed, or reordered).
    return this.lines.length > 0 ? this.lines[this.lines.length - 1].end : 0;
  }

  setAnnotation(annotation: TextAnnotation, calculateWeights = true): void {
    const lines = annotation._render.lines ?? [];
    // this.annotationLineMap.set(annotation.id, lines);

    if (annotation._render.isGutter) {
      this.setGutterAnnotation(annotation, lines);
    } else {
      this.annotationsMap.set(annotation.id, annotation);
    }

    if (calculateWeights) {
      if (annotation._render.isGutter) this.calculateMaxGutterWeight();
      else this.calculateLinesWeights();
    }
  }

  private setGutterAnnotation(annotation: TextAnnotation, lines: TextLine[]) {
    this.annotationsMap.set(annotation.id, annotation);
  }

  removeAnnotation(annotation: TextAnnotation, calculateWeights = true): void {
    const originalLines = annotation._render.lines ?? [];
    this.annotationsMap.delete(annotation.id);

    this.annotationTextModel.removeAnnotationFromLine(
      originalLines,
      annotation,
    );

    annotation._render.lines = [];
    annotation._drawMetadata.draws = [];

    if (calculateWeights) {
      if (annotation._render.isGutter) this.calculateMaxGutterWeight();
      else this.calculateLinesWeights();
    }
  }

  calculateMaxGutterWeight() {
    this.gutterModel.updateGutters(this.lines, this.annotations);
  }

  calculateLinesWeights() {
    this.annotationTextModel.updateTextAnnotations(
      this.lines,
      this.annotations,
      this.renderInstances,
    );
  }

  calculateAllWeights() {
    this.calculateMaxGutterWeight();
    this.calculateLinesWeights();
  }
}
