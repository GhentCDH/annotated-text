import { Annotation } from "../../../types/Annotation";

export type TextAnnotationParserConfig<ANNOTATION> = {
  parse: (annotation: ANNOTATION) => Annotation | null;
  format: (
    annotation: Annotation,
    selectedText: string,
    isNew: boolean,
  ) => ANNOTATION;
};
