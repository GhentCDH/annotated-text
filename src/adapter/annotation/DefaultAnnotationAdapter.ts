import {
  AnnotationAdapter,
  createAnnotationAdapter,
  createAnnotationAdapterParams,
} from "./AnnotationAdapter";
import {
  type Annotation,
  annotationSchema,
  type TextAnnotation,
  textAnnotationSchema,
} from "../../model";

export class DefaultAnnotationAdapterImpl extends AnnotationAdapter<Annotation> {
  name = "DefaultAnnotationAdapter";

  parse(annotation: Annotation): TextAnnotation {
    const data = textAnnotationSchema.safeParse(annotation);
    if (!data.success) {
      console.warn(annotation, data.error);
      return annotation as TextAnnotation;
    }
    return data.data;
  }

  format(
    annotation: TextAnnotation,
    textSelection: string,
    isNew: boolean,
  ): Annotation {
    return annotationSchema.parse(annotation);
  }
}

export const DefaultAnnotationAdapter = (
  params: createAnnotationAdapterParams<Annotation> = {},
): AnnotationAdapter<Annotation> => {
  return createAnnotationAdapter(new DefaultAnnotationAdapterImpl(), params);
};
