//this function is similar to the weights for span annotations but there is one difference
//two annotations can start on the same line and 'overlap' even if they are not overlapping based on
//character indexes.
import { maxBy } from "lodash-es";
import { AnnotatedGutter, TextAnnotation } from "../annotation.model";

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

  annotations = annotations.sort(compareAnnotations);

  let weight = 0;

  annotations.forEach((annotation) => {
    annotation.weight = weight;
    weight++;
  });

  //reverse weights, makes sure longest is at the right, not left (close to the text)
  return Math.max(...annotations.map((e) => e.weight));
};

const compareAnnotations = (a: TextAnnotation, b: TextAnnotation): number => {
  return a.start - b.start === 0 ? -1 : 1;
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

  annotations.sort(compareAnnotations).forEach((annotation) => {
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
  annotationMap: Map<number, TextAnnotation[]>,
) => {
  let maxWeight = 0;

  annotationMap.values().forEach((annotations) => {
    const weight = calculateLineWeights(annotations);
    if (maxWeight < weight) maxWeight = weight;
  });
  return maxWeight;
};
