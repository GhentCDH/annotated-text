import { type AnnotatedText } from './CreateAnnotations.model';
import { CreateAnnotationsImpl } from './CreateAnnotations';
import type { BaseAnnotation } from '../../model';
import { type AnnotationAdapter, type AnnotationAdapterParams } from '../../adapter';
import type { Annotation } from '../../model/';
import { Debugger } from '../../utils/debugger';

type createAnnotatedTextParams<ANNOTATION extends BaseAnnotation> = {
  annotation?: AnnotationAdapter<ANNOTATION> | AnnotationAdapterParams;
};

const annotatedTextCache = new Map<string, AnnotatedText<any>>();

export const createAnnotatedText = <
  ANNOTATION extends BaseAnnotation = Annotation,
>(
  id: string,
): AnnotatedText<ANNOTATION> => {
  if (annotatedTextCache.has(id)) {
    console.warn(
      'AnnotatedText with this ID already exists:',
      id,
      'the original will be returned, params are ignored. ',
    );

    return annotatedTextCache.get(id) as AnnotatedText<ANNOTATION>;
  }

  const annotatedImpl = new CreateAnnotationsImpl<ANNOTATION>(
    id,
  ) as AnnotatedText<ANNOTATION>;

  annotatedTextCache.set(id, annotatedImpl);
  annotatedImpl.on('destroy', () => {
    annotatedTextCache.delete(id);
    Debugger.verbose(
      'AnnotatedText with ID',
      id,
      'has been destroyed and removed from cache.',
    );
  });
  return annotatedImpl;
};

export const getAnnotatedText = <
  ANNOTATION extends BaseAnnotation = Annotation,
>(
  id: string,
) => {
  const annotatedText = annotatedTextCache.get(id);
  if (!annotatedText) {
    throw new Error('AnnotatedText with this ID does not exist');
  }

  return annotatedText as AnnotatedText<ANNOTATION>;
};

export const clearAnnotatedTextCache = () => {
  annotatedTextCache.clear();
};
