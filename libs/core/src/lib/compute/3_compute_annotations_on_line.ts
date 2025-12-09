import {
  TextAnnotationModel,
  TextAnnotationModelImpl,
} from './annotation.model';

export const computeAnnotationsOnLine = (
  model: TextAnnotationModelImpl,
  line: number,
): TextAnnotationModel => {
  return model;
};

export const computeAnnotationsOnLines = (
  model: TextAnnotationModel,
): TextAnnotationModel => {
  model.calculateAllWeights();

  return model;
};
