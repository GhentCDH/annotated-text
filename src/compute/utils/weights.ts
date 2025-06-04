//this function is similar to the weights for span annotations but there is one difference
//two annotations can start on the same line and 'overlap' even if they are not overlapping based on
//character indexes.
import { maxBy } from "lodash-es";
import { AnnotatedGutter, TextAnnotation, TextLine } from "../annotation.model";
import { sortAnnotations } from "../draw/utils/sort";

export const calculateGutterAnnotationWeightsAndEnrich = (
  annotations: AnnotatedGutter[],
) => {
  const compareAnnotations = function (
    a: AnnotatedGutter,
    b: AnnotatedGutter,
  ): number {
    const aLength = a.end - a.start;
    const bLength = b.end - b.start;
    return aLength - bLength;
  };

  annotations = annotations.sort(sortAnnotations).reverse();

  let weight = 0;

  annotations.forEach((annotation) => {
    annotation.weight = weight;
    weight++;
  });

  //reverse weights, makes sure longest is at the right, not left (close to the text)
  return Math.max(...annotations.map((e) => e.weight));
};

function isIntersection(a: TextAnnotation, b: TextAnnotation): boolean {
  const start = Math.max(a.start, b.start);
  const end = Math.min(a.end, b.end);

  return start < end;
}

const countOverlaps = (
  annotations: TextAnnotation[],
  annotation: TextAnnotation,
) => {
  return annotations.filter((a) => {
    if (a.id === annotation.id) return false;

    return isIntersection(a, annotation);
  });
};

const calculateLineWeights = (annotations: TextAnnotation[]) => {
  let maxWeight = 0;

  annotations.sort(sortAnnotations).forEach((annotation) => {
    // If there is already a weight just ignore it for now
    if (annotation.weight) {
      return;
    }
    const totalOverlaps = countOverlaps(annotations, annotation);
    if (annotation.weight !== undefined) {
    } else if (totalOverlaps.length === 0) {
      annotation.weight = 0;
    } else {
      const w = maxBy(totalOverlaps, (a) => a.weight)?.weight ?? -1;

      annotation.weight = w + 1;
      maxWeight = maxWeight + 1;

      if (maxWeight < annotation.weight) {
        maxWeight = annotation.weight;
      }
    }
  });

  return maxWeight;
};

export const calculateAnnotationWeights = (
  lines: TextLine[],
  annotationMap: Map<number, TextAnnotation[]>,
) => {
  let maxWeight = 0;

  // 1. first calculate all the weights for each line
  lines.forEach((line) => {
    const annotations = annotationMap.get(line.lineNumber) ?? [];
    calculateLineWeights(annotations);
  });

  // 2. get the max line wights
  lines.forEach((line) => {
    const annotations = annotationMap.get(line.lineNumber) ?? [];
    const weight = maxBy(annotations, (a) => a.weight)?.weight ?? 0;
    line.maxLineWeight = weight;
    if (maxWeight < weight) maxWeight = weight;
  });
  return maxWeight;
};
