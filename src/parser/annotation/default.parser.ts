import {
  Annotation,
  createAnnotationColor,
  TextAnnotationParserConfig,
} from "@ghentcdh/vue-component-annotated-text";
import { cloneDeep } from "lodash-es";
import { v4 as uuidv4 } from "uuid";
import { TextAnnotation } from "../../compute/annotation.model";

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
