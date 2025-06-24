import { cloneDeep, omit } from "lodash-es";
import {
  AnnotationAdapter,
  createAnnotationAdapter,
  createAnnotationAdapterParams,
} from "./AnnotationAdapter";
import { Annotation } from "../../types/Annotation";
import { TextAnnotation } from "../../compute/annotation.model";

export class DefaultAnnotationAdapterImpl extends AnnotationAdapter<Annotation> {
  name = "DefaultAnnotationAdapter";

  parse(annotation: Annotation): TextAnnotation {
    return cloneDeep(annotation) as TextAnnotation;
  }

  format(
    annotation: TextAnnotation,
    textSelection: string,
    isNew: boolean,
  ): Annotation {
    return omit(annotation, "uuid") as Annotation;
  }
}

export const DefaultAnnotationAdapter = (
  params: createAnnotationAdapterParams<Annotation> = {},
): AnnotationAdapter<Annotation> => {
  return createAnnotationAdapter(new DefaultAnnotationAdapterImpl(), params);
};
