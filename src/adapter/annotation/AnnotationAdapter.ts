import { TextAnnotation } from "../../compute/annotation.model";

export abstract class AnnotationAdapter<ANNOTATION> {
  abstract name: string;

  abstract parse(annotation: ANNOTATION): TextAnnotation;

  abstract format(
    annotation: TextAnnotation,
    textSelection: string,
    isNew: boolean,
  ): ANNOTATION;
}

export type createAnnotationAdapterParams<ANNOTATION> = {
  create?: boolean;
  edit?: boolean;
};

export const createAnnotationAdapter = <ANNOTATION>(
  adapter: AnnotationAdapter<ANNOTATION>,
  params: createAnnotationAdapterParams<ANNOTATION>,
): AnnotationAdapter<ANNOTATION> => {
  return adapter;
};
