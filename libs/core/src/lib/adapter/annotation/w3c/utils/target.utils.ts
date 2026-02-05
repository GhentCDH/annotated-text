import { type TargetSelector, type TextPositionSelector, type W3CAnnotation, type W3CAnnotationTarget } from '../model';

export const getTarget = (annotation: W3CAnnotation): W3CAnnotationTarget[] => {
  if (!annotation.target) return [];

  return Array.isArray(annotation.target)
    ? annotation.target
    : [annotation.target];
};

const getTargetSelectors = (target: W3CAnnotationTarget) => {
  if (!target.selector) return [];

  return Array.isArray(target.selector) ? target.selector : [target.selector];
};

export const findSourceInTargets = (sourceUri: string) => {
  return (annotation: W3CAnnotation): W3CAnnotationTarget[] => {
    const targets = getTarget(annotation);

    return targets.filter((target) => target.source === sourceUri);
  };
};

export const hasSourceInTargets = (sourceUri: string) => {
  return (annotation: W3CAnnotation): boolean => {
    const targets = getTarget(annotation);
    return targets.some((target) => target.source === sourceUri);
  };
};

const findSelectorByType = <TYPE extends TargetSelector>(type: string) => {
  return (sourceUri?: string) => {
    return (annotation: W3CAnnotation): TYPE | undefined => {
      const targets = getTarget(annotation);

      for (const target of targets) {
        if (sourceUri && target.source !== sourceUri) {
          break;
        }

        for (const selector of getTargetSelectors(target)) {
          if (selector.type === type) {
            return selector as TYPE;
          }
        }
      }
      return undefined;
    };
  };
};

export const findTextPositionSelector = (sourceUri?: string) => {
  return findSelectorByType<TextPositionSelector>('TextPositionSelector')(
    sourceUri,
  );
};

export const hasSameFields = <T>(
  obj1: T,
  obj2: T,
  fields: (keyof T)[],
): boolean => {
  return fields.every((field) => obj1[field] === obj2[field]);
};

export const isSameTarget = (
  body1: W3CAnnotationTarget,
  body2: W3CAnnotationTarget,
) => {
  if (!hasSameFields(body1, body2, ['source'])) return false;

  return hasSameFields(body1.selector, body2.selector, ['type'] as any);
};

export const updateSelector = (
  annotation: W3CAnnotation,
  target: W3CAnnotationTarget,
) => {
  const targets = getTarget(annotation).filter((t) => !isSameTarget(t, target));
  targets.push(target);

  annotation.target = targets;

  return annotation;
};

export const findRelatedAnnotation =
  (
    annotations: W3CAnnotation[],
    getIdFromUri: (uri: string | undefined) => string | undefined,
  ) =>
  (annotation: W3CAnnotation): W3CAnnotation[] => {
    return getTarget(annotation)
      .map((a) => {
        const id = getIdFromUri(a.source);

        if (!id) return null;

        return annotations.find((a) => a.id === id);
      })
      .filter((a) => !!a);
  };

export const findAnnotations = (annotations: W3CAnnotation[]) => {
  return {
    findInTargetSource: (sourceUri: string): W3CAnnotation[] =>
      annotations.filter(hasSourceInTargets(sourceUri)),
  };
};
