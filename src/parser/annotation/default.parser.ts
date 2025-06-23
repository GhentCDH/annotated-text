import { cloneDeep } from "lodash-es";
import { v4 as uuidv4 } from "uuid";
import { TextAnnotationParserConfig } from "./model/parser";
import { TextAnnotation } from "../../compute/annotation.model";
import { Annotation } from "../../types/Annotation";
import { createAnnotationColor } from "../../utils/createAnnotationColor";

const parseAnnotation = (annotation: TextAnnotation): Annotation => {
  return cloneDeep(annotation);
};

const formatAnnotation = (annotation: Annotation): TextAnnotation => {
  return {
    id: uuidv4(),
    isGutter: false,
    color: createAnnotationColor("#f51720"),
    ...annotation,
  } as TextAnnotation;
};

export const DefaultAnnotationParser =
  (): TextAnnotationParserConfig<TextAnnotation> => {
    return {
      parse: parseAnnotation,
      format: formatAnnotation,
    };
  };
