import { findTextPositionSelector } from './target.utils';
import type { W3CAnnotation } from '../model';

export const getTextFromSelector = (
  annotation: W3CAnnotation,
  sourceUri: string,
  text: string,
) => {
  const selector = findTextPositionSelector(sourceUri)(annotation)?.selector;

  if (!selector) return '';

  return text?.substring(selector.start, selector.end);
};
