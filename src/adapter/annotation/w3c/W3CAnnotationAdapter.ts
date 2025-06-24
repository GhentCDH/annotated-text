import { createTextSelectionAnnotation } from "./utils/text-selection-annotation";
import { W3CAnnotation } from "./model";
import { findTextPositionSelector } from "./utils";
import {
  AnnotationAdapter,
  createAnnotationAdapter,
  createAnnotationAdapterParams,
} from "../AnnotationAdapter";
import { TextAnnotation } from "../../../compute/annotation.model";

export class W3CAnnotationAdapterImpl extends AnnotationAdapter<W3CAnnotation> {
  name = "W3CAnnotationAdapter";

  constructor(
    private readonly sourceUri?: string,
    private readonly language?: string,
  ) {
    super();
  }

  parse(annotation: W3CAnnotation): TextAnnotation {
    const selector = findTextPositionSelector(this.sourceUri)(
      annotation,
    )?.selector;

    if (!selector) return null;

    return {
      id: annotation.id,
      start: selector.start,
      end: selector.end,
    } as TextAnnotation;
  }

  format(
    annotation: TextAnnotation,
    textSelection: string,
    isNew: boolean,
  ): W3CAnnotation {
    if (!annotation) return null;
    return createTextSelectionAnnotation(
      this.sourceUri,
      this.language,
      textSelection,
      annotation,
    );
  }
}

type W3CAnnotationAdapterParams = {
  sourceUri?: string;
  language?: string;
} & createAnnotationAdapterParams<W3CAnnotation>;

export const W3CAnnotationAdapter = (
  params: W3CAnnotationAdapterParams = {},
): AnnotationAdapter<W3CAnnotation> => {
  return createAnnotationAdapter(
    new W3CAnnotationAdapterImpl(params.sourceUri, params.language),
    params,
  );
};
