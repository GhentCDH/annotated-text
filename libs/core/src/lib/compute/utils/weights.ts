//this function is similar to the weights for span annotations but there is one difference
//two annotations can start on the same line and 'overlap' even if they are not overlapping based on
//character indexes.
import { maxBy, sortBy } from "lodash-es";
import { isIntersection } from "./intersect";
import { sortAnnotations } from "../draw/utils/sort";
import { type TextAnnotation, type TextLine } from "../../model";

export const calculateGutterAnnotationWeightsAndEnrich = (
  lines: TextLine[],
  annotations: TextAnnotation[],
) => {
  // decide for eacht line how many annotations can be in the gutter
  const annotationsInGutter = new Map<
    string,
    { annotation: TextAnnotation; height: number; index: number }[]
  >();

  annotations.forEach((annotation) => {
    const lines = annotation._render.lines ?? [];
    const height = lines.length;
    lines.forEach((line, index) => {
      const value = annotationsInGutter.get(line.uuid) ?? [];
      value.push({ annotation, height, index });
      annotationsInGutter.set(line.uuid, value);
    });
  });

  let maxWeight = 0;

  // Assign the weights to the annotations, from top to bottom
  lines.forEach((line) => {
    if (!annotationsInGutter.has(line.uuid)) {
      // no annotations on this line so no weights are set
      return;
    }
    const sortAnnotations = sortBy(
      annotationsInGutter.get(line.uuid),
      (a) => -a.height,
    );
    // if (line.lineNumber > 3) return;
    const weightsInLine = sortAnnotations
      .map((a) => a.annotation._render.weight)
      .filter((w) => w !== undefined);
    // if (line.lineNumber > 5) return;
    sortAnnotations.forEach((lineAnnotation) => {
      if (lineAnnotation.index > 0) {
        if (!lineAnnotation.annotation._render.weight === undefined) {
          console.warn("no weight for annotation", lineAnnotation.annotation);
        }
        return;
      }

      if (lineAnnotation.annotation._render.weight !== undefined) {
        console.warn(
          "!!! weight for annotation already set?",
          lineAnnotation.annotation,
        );
        return;
      }
      // Decide the next weight for that annotation on this line
      let weight = 0;

      while (lineAnnotation.annotation._render.weight === undefined) {
        if (weightsInLine.includes(weight)) {
          weight++;
        } else {
          weightsInLine.push(weight);
          lineAnnotation.annotation._render.weight = weight;
        }

        if (maxWeight < weight) {
          maxWeight = weight;
        }
      }
    });
  });

  return maxWeight;
};

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
    if (annotation._render.weight) {
      return;
    }
    const totalOverlaps = countOverlaps(annotations, annotation);
    if (annotation._render.weight !== undefined) {
    } else if (totalOverlaps.length === 0) {
      annotation._render.weight = 0;
    } else {
      const w =
        maxBy(totalOverlaps, (a) => a._render.weight)?._render.weight ?? -1;

      annotation._render.weight = w + 1;
      maxWeight = maxWeight + 1;

      if (maxWeight < annotation._render.weight) {
        maxWeight = annotation._render.weight;
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
    const weight =
      maxBy(annotations, (a) => a._render.weight)?._render.weight ?? 0;
    line.maxLineWeight = weight;
    if (maxWeight < weight) maxWeight = weight;
  });
  return maxWeight;
};
