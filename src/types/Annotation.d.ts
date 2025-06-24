import { Annotation } from "../model";

/**
 * Internal representation of an annotation. Enriched with the original annotation only supposed to used internally.
 */
export interface AnnotationInternal extends Annotation {
  class?: string;

  startsOnLine?: boolean;
  endsOnLine?: boolean;
}
