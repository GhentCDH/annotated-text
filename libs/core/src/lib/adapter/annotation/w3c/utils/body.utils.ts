import { hasSameFields } from './target.utils';
import {
  TextualBody,
  TextualBodyClassifying,
  TextualBodyClassifyingPurpose,
  W3CAnnotation,
  W3CAnnotationBody,
  W3CAnnotationBodyType,
} from '../model';

export const getBody = (
  annotation: Pick<W3CAnnotation, 'body'>,
): W3CAnnotationBody[] => {
  if (!annotation.body) return [];

  return Array.isArray(annotation.body) ? annotation.body : [annotation.body];
};
export const findBodyType = <B extends W3CAnnotationBody>(
  type: W3CAnnotationBodyType,
  validator: (body: B) => boolean,
) => {
  return (annotation: Pick<W3CAnnotation, 'body'>): B | undefined => {
    return getBody(annotation).find(
      (b: any) => b.type === type && validator(b),
    ) as unknown as B;
  };
};

export const findByPurpose =
  (purpose: TextualBodyClassifyingPurpose) => (annotation: W3CAnnotation) => {
    return findBodyType<TextualBodyClassifying>(
      'TextualBody',
      (body: TextualBodyClassifying) => body.purpose === purpose,
    )(annotation);
  };

export const findByPurposeValue =
  (purpose: string) => (annotation: W3CAnnotation) => {
    return findBodyType<TextualBodyClassifying>(
      'TextualBody',
      (body: TextualBodyClassifying) => body.value === purpose,
    )(annotation);
  };

export const findTagging = findByPurpose('tagging');

export const findTextualBodyByLanguage =
  (language: string) => (annotation: W3CAnnotation) => {
    return findBodyType<TextualBody>(
      'TextualBody',
      (body: TextualBody) => body.language === language,
    )(annotation);
  };

export const isSameBody = (
  body1: W3CAnnotationBody,
  body2: W3CAnnotationBody,
) => {
  if (!hasSameFields<any>(body1, body2, ['source', 'type'])) return false;

  return true;
};

export const updateBody = (
  annotation: W3CAnnotation,
  body: W3CAnnotationBody,
) => {
  const bodies = getBody(annotation).filter((t) => !isSameBody(t, body));

  bodies.push(body);
  annotation.body = bodies;

  return annotation;
};
