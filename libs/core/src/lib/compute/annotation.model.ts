import { GutterCacheModel } from './model/gutter.cache.model';
import { TextAnnotationCacheModel } from './model/text.cache.model';
import {
  type AnnotationDimension,
  type AnnotationDraw,
  type AnnotationDrawColors,
  type AnnotationId,
  type TextAnnotation,
  type TextLine,
} from '../model';
import { type TextAdapter, type TextDirection } from '../adapter/text';
import { type AnnotationRenderParams } from '../adapter/annotation/renderer/annotation-render';
import { type RenderInstances } from '../adapter/annotation/renderer/render-instances';

// TODO should this exist?
// Maybe it should go to the abstract AnnotationAdapter and TextAdapter instead
export interface TextAnnotationModel {
  renderParams: AnnotationRenderParams;

  // Configuration for the annotation model
  textDirection: TextDirection;

  annotations: TextAnnotation[];

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

  gutterModel: GutterCacheModel;
  annotationTextModel: TextAnnotationCacheModel;
}

export class TextAnnotationModelImpl implements TextAnnotationModel {
  textDirection: TextDirection;

  // public readonly textCache: TextCache;
  public readonly gutterModel: GutterCacheModel = new GutterCacheModel();
  public readonly annotationTextModel: TextAnnotationCacheModel =
    new TextAnnotationCacheModel();

  // readonly annotationLineMap = new Map<AnnotationId, TextLine[]>();
  readonly annotationsMap = new Map<AnnotationId, TextAnnotation>();

  constructor(
    private readonly textAdapter: TextAdapter,
    public readonly renderInstances: RenderInstances<any>,
  ) {
    // this.textCache = new TextCache(lines);
  }

  resetAnnotations() {
    this.annotationsMap.clear();

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

  // getAnnotations(line: number): Annotation[] {
  //   return this.lineAnnotationMap.get(line) || [];
  // }

  getMinStartPosition(): number {
    return this.annotationTextModel.minStartPosition;
  }

  getMaxStartPosition(): number {
    return this.annotationTextModel.maxStartPosition;
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
    this.gutterModel.updateGutters(this.textAdapter.lines, this.annotations);
  }

  calculateLinesWeights() {
    this.annotationTextModel.updateTextAnnotations(
      this.textAdapter.lines,
      this.annotations,
      this.renderInstances,
    );
  }

  calculateAllWeights() {
    this.calculateMaxGutterWeight();
    this.calculateLinesWeights();
  }
}
