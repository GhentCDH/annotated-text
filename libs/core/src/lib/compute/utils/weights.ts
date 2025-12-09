//this function is similar to the weights for span annotations but there is one difference
//two annotations can start on the same line and 'overlap' even if they are not overlapping based on
//character indexes.
import { sortBy } from 'lodash-es';
import { type TextAnnotation, type TextLine } from '../../model';

export const calculateGutterAnnotationWeightsAndEnrich = (
  lines: TextLine[],
  annotations: TextAnnotation[],
) => {
  // decide for each line how many annotations can be in the gutter
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
        // eslint-disable-next-line no-constant-binary-expression
        if (!lineAnnotation.annotation._render.weight === undefined) {
          console.warn('no weight for annotation', lineAnnotation.annotation);
        }
        return;
      }

      if (lineAnnotation.annotation._render.weight !== undefined) {
        console.warn(
          '!!! weight for annotation already set?',
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
