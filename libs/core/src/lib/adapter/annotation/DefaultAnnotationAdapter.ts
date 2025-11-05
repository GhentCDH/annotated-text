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
import { selectText } from "../text/utils/select-text";

export class DefaultAnnotationAdapterImpl extends AnnotationAdapter<Annotation> {
  name = "DefaultAnnotationAdapter";

  parse(annotation: Annotation): TextAnnotation {
    const data = textAnnotationSchema.safeParse(annotation);

    let parsedAnnotation: TextAnnotation;
    if (!data.success) {
      console.warn(annotation, data.error);
      parsedAnnotation = annotation as TextAnnotation;
    } else parsedAnnotation = data.data;

    parsedAnnotation.isGutter = this.gutterFn(parsedAnnotation);
    super.addAnnotation(parsedAnnotation.id, annotation);

    return parsedAnnotation;
  }

  format(
    annotation: TextAnnotation,
    isNew: boolean,
    hasChanged: boolean,
  ): Annotation | null {
    if (!annotation) return null;

    if (!hasChanged) return this.getAnnotation(annotation.id);

    const textSelection = selectText(
      this.text,
      annotation.start,
      annotation.end,
      this.offsetStart,
    );

    const data = annotationSchema.safeParse({
      ...annotation,
      textSelection,
    });

    let formattedAnnotation: Annotation;
    if (!data.success) {
      console.warn(annotation, data.error);
      formattedAnnotation = annotation as Annotation;
    } else formattedAnnotation = data.data;

    super.addAnnotation(annotation.id, formattedAnnotation);

    return formattedAnnotation;
  }
}

export const DefaultAnnotationAdapter = (
  params: createAnnotationAdapterParams<Annotation> = {},
): AnnotationAdapter<Annotation> => {
  return createAnnotationAdapter(new DefaultAnnotationAdapterImpl(), params);
};
