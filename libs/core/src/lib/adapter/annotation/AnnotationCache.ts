import { maxBy } from 'lodash-es';
import type { AnnotationRender, GutterAnnotationRenderStyle } from './renderer';
import type { RenderInstances } from './renderer/render-instances';
import {
  type AnnotationDimension,
  type AnnotationDraw,
  type AnnotationDrawColors,
  type AnnotationId,
  type TextAnnotation,
  type TextLine,
} from '../../model';
import { calculateGutterAnnotationWeightsAndEnrich } from '../../compute/utils/weights';
import { AnnotationWeight } from '../../compute/utils/annotation.weight';

export class AnnotationCache<ANNOTATION> {
  private readonly originalAnnotationsMap = new Map<AnnotationId, ANNOTATION>();
  private readonly parsedAnnotationsMap = new Map<
    AnnotationId,
    TextAnnotation
  >();
  public gutter = {
    maxWeight: 0,
    paddingLeft: 0,
  };

  public positions = {
    minStartPosition: 0,
    maxStartPosition: 0,
  };

  public readonly getAnnotationsSortedBy = Object.assign(
    () => this.getAnnotations(),
    {
      sortBy: (sortBy?: 'weight') => {
        switch (sortBy) {
          case 'weight':
            return this.getSortedByWeightAnnotations();
        }
        return this.getAnnotations();
      },
    },
  );

  private getAnnotations(): TextAnnotation[] {
    return Array.from(this.parsedAnnotationsMap.values());
  }

  private getSortedByWeightAnnotations(): TextAnnotation[] {
    return this.getAnnotations().sort(
      (a, b) => b._render.weight! - a._render.weight!,
    );
  }

  addAnnotation(
    annotationId: AnnotationId,
    originalAnnotation: ANNOTATION,
    parsedAnnotation: TextAnnotation,
  ) {
    this.originalAnnotationsMap.set(annotationId, originalAnnotation);
    this.parsedAnnotationsMap.set(annotationId, parsedAnnotation);
  }

  getOriginalAnnotation(annotationId: AnnotationId): ANNOTATION {
    return this.originalAnnotationsMap.get(annotationId) as ANNOTATION;
  }

  clear() {
    this.originalAnnotationsMap.clear();
    this.parsedAnnotationsMap.clear();
  }

  getParsedAnnotation(annotationId: AnnotationId): TextAnnotation {
    return this.parsedAnnotationsMap.get(annotationId) as TextAnnotation;
  }

  calculateWeights(lines: TextLine[], renderInstances: RenderInstances<any>) {
    this.calculateGutterWeights(lines, renderInstances);
    this.calculateTextAnnotationsWeight(lines, renderInstances);
  }

  private calculateGutterWeights(
    lines: TextLine[],
    renderInstances: RenderInstances<any>,
  ) {
    const gutterAnnotations = this.getAnnotations().filter(
      (a) => a._render.isGutter,
    );

    // Calculate gutter weight
    calculateGutterAnnotationWeightsAndEnrich(lines, gutterAnnotations);

    const maxGutterWeight =
      maxBy(gutterAnnotations, (a) => a._render.weight)?._render.weight ?? 0;
    const gutterInstances = renderInstances.getGutterRenders();

    // For now this is only base on one gutter renderer,
    // It should be tested against multiple if different instances are available

    const maxGutterWidth =
      maxBy(
        gutterInstances,
        (r: AnnotationRender<GutterAnnotationRenderStyle>) =>
          r.style?.width ?? 0,
      )?.style?.width ?? 0;
    const maxGutterGap =
      maxBy(
        gutterInstances,
        (r: AnnotationRender<GutterAnnotationRenderStyle>) => r.style?.gap ?? 0,
      )?.style?.gap ?? 0;

    const gutterWidth = maxGutterWidth + maxGutterGap;

    this.gutter = {
      maxWeight: maxGutterWeight,
      paddingLeft: gutterWidth * maxGutterWeight,
    };
  }

  calculateTextAnnotationsWeight(
    lines: TextLine[],
    renderInstances: RenderInstances<any>,
  ) {
    const textAnnotations = this.getAnnotations().filter(
      (a) => !a._render.isGutter,
    );
    AnnotationWeight.calculate(
      textAnnotations,
      renderInstances.getTextRenders(),
    );
  }

  addDrawAnnotations(
    annotationUuid: AnnotationId,
    annotations: AnnotationDraw[],
    dimensions: AnnotationDimension,
    color: AnnotationDrawColors,
  ) {
    const annotation = this.getParsedAnnotation(annotationUuid);
    annotation._drawMetadata.draws = annotations;
    annotation._drawMetadata.dimensions = dimensions;
    annotation._drawMetadata.color = color;
  }

  clearDrawAnnotation() {
    this.parsedAnnotationsMap.forEach((annotation) => {
      annotation._drawMetadata.draws = [];
      annotation._drawMetadata.color = undefined;
      annotation._drawMetadata.dimensions = undefined;
    });
  }
}
