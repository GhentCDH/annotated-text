import {
  AnnotationAdapter,
  createAnnotationAdapter,
  type createAnnotationAdapterParams,
} from './AnnotationAdapter';
import {
  type Annotation,
  annotationSchema,
  type TextAnnotation,
} from '../../model';
import { selectText } from '../text/utils/select-text';
import { Debugger } from '../../utils/debugger';

export class DefaultAnnotationAdapterImpl extends AnnotationAdapter<Annotation> {
  name = 'DefaultAnnotationAdapter';

  _parse(annotation: Annotation): Annotation {
    const data = annotationSchema.safeParse(annotation);

    if (!data.success) {
      Debugger.warn(annotation, data.error);
      return annotation as Annotation;
    }
    return data.data as Annotation;
  }

  format(
    annotation: TextAnnotation,
    isNew: boolean,
    hasChanged: boolean,
  ): Annotation | null {
    if (!annotation) return null;

    if (!hasChanged) return this.getAnnotation(annotation.id);

    const originalAnnotation = isNew ? {} : this.getAnnotation(annotation.id);

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
      Debugger.warn(annotation, data.error);
      formattedAnnotation = annotation;
    } else formattedAnnotation = data.data;

    formattedAnnotation = { ...originalAnnotation, ...formattedAnnotation };
    super.addAnnotation(annotation.id, formattedAnnotation);

    return formattedAnnotation;
  }
}

export const DefaultAnnotationAdapter = (
  params: createAnnotationAdapterParams<Annotation> = {},
): AnnotationAdapter<Annotation> => {
  return createAnnotationAdapter(new DefaultAnnotationAdapterImpl(), params);
};
