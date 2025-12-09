import { hasSourceInTargets } from './target.utils';
import type { W3CAnnotation } from '../model';

export const filterAnnotations = (sourceUri: string) => {
  return (annotations: W3CAnnotation[]) =>
    annotations.filter(hasSourceInTargets(sourceUri));
};
