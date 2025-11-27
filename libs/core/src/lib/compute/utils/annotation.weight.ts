import { maxBy } from "lodash-es";
import { AnnotationOverlap } from "./annotation.overlap";
import { type TextAnnotation, TextLine } from "../../model";
import { sortAnnotations } from "../draw/utils/sort";
import { type AnnotationRender } from "../../adapter/annotation/renderer/annotation-render";

export class AnnotationWeight {
  private readonly annotationOverlap: AnnotationOverlap<TextAnnotation>;
  private readonly renderWeights: Map<number, TextAnnotation[]>;
  private readonly renderOrder: number[];
  private totalMaxWeight: number = 0;

  static calculate(
    annotations: TextAnnotation[],
    annotationRenders: AnnotationRender<any>[],
  ): AnnotationWeight {
    return new AnnotationWeight(annotations, annotationRenders);
  }

  private constructor(
    private readonly annotations: TextAnnotation[],
    private readonly annotationRenders: AnnotationRender<any>[],
  ) {
    this.annotationOverlap = AnnotationOverlap.init(annotations);
    const assigned = this.assignWeights();
    this.renderWeights = assigned.renderWeights;
    this.renderOrder = assigned.renderOrders;

    this.calculateBasedOnRenderOrder();
  }

  private assignWeights() {
    const renderWeights = new Map<number, TextAnnotation[]>();
    const renderWeightOrders: Record<string, number> = {};

    this.annotationRenders.forEach((r) => {
      renderWeightOrders[r.name] = r.weightOrder;
      renderWeights.set(r.weightOrder, []);
    });

    this.annotations.forEach((annotation) => {
      const weightOrder = renderWeightOrders[annotation._render.render] ?? 0;

      renderWeights.get(weightOrder)?.push(annotation);

      annotation._render.lines.forEach((l) => this.resetLineMaxWeight(l));
    });

    const renderOrders = [] as number[];
    for (const [key, value] of renderWeights.entries()) {
      if (value.length > 0) {
        renderOrders.push(key);
      }
    }

    return { renderOrders, renderWeights };
  }

  private calculateBasedOnRenderOrder() {
    this.renderOrder.forEach((order, index) => {
      this.calculateAnnotationArray(this.renderWeights.get(order)!, index);
    });
  }

  calculateAnnotationArray(annotations: TextAnnotation[], startWeight: number) {
    // TODO implement based on th
    const sortedAnnotations = annotations.sort(sortAnnotations);

    sortedAnnotations.forEach((annotation) => {
      let weight = 0;

      if (this.annotationOverlap.hasOverlap(annotation)) {
        const overlaps = this.annotationOverlap.getOverlaps(annotation);
        const maxWeight =
          maxBy(overlaps, (o) => o._render.weight)?._render.weight ??
          startWeight - 1;
        weight = maxWeight + 1;
      }

      annotation._render.weight = weight;

      this.setTotalMaxWeight(weight);
      annotation._render.lines.forEach((line) =>
        this.setMaxWeightForLine(line, weight),
      );
    });
  }

  private setMaxWeightForLine(line: TextLine, weight: number) {
    const currentMax = line.maxLineWeight ?? 0;
    if (weight > currentMax) {
      line.maxLineWeight = weight;
    }
  }

  private setTotalMaxWeight(weight: number) {
    if (weight > this.totalMaxWeight) {
      this.totalMaxWeight = weight;
    }
  }

  private resetLineMaxWeight(line: TextLine) {
    line.maxLineWeight = line.maxLineWeight ?? 0;
  }

  get maxWeight(): number {
    return this.totalMaxWeight;
  }
}
