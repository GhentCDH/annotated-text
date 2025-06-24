import { cloneDeep } from "lodash-es";
import { v4 as uuidv4 } from "uuid";
import {
  AnnotationAdapter,
  createAnnotationAdapter,
  createAnnotationAdapterParams,
} from "./AnnotationAdapter";
import { Annotation } from "../../types/Annotation";
import { TextAnnotation } from "../../compute/annotation.model";
import { createAnnotationColor } from "../../utils/createAnnotationColor";

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
    return {
      id: uuidv4(),
      isGutter: false,
      color: createAnnotationColor("#f51720"),
      ...annotation,
    } as Annotation;
  }
}

export const DefaultAnnotationAdapter = (
  params?: createAnnotationAdapterParams<Annotation> = {},
): AnnotationAdapter<Annotation> => {
  return createAnnotationAdapter(new DefaultAnnotationAdapterImpl(), params);
};
