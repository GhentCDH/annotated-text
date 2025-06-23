import { Annotation } from "@ghentcdh/vue-component-annotated-text";

export type TextAnnotationParserConfig<ANNOTATION> = {
  parse: (annotation: ANNOTATION) => Annotation | null;
  format: (
    annotation: Annotation,
    selectedText: string,
    isNew: boolean,
  ) => ANNOTATION;
};
