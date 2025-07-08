import {
  createTextSelectionAnnotation,
  updateTextSelectionAnnotation,
} from "./utils/text-selection-annotation";
import { W3CAnnotation } from "./model";
import { findTextPositionSelector } from "./utils";
import {
  AnnotationAdapter,
  createAnnotationAdapter,
  createAnnotationAdapterParams,
} from "../AnnotationAdapter";
import { type TextAnnotation, textAnnotationSchema } from "../../../model";

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

    const parsedAnnotation = textAnnotationSchema.parse({
      id: annotation.id,
      start: selector.start,
      end: selector.end,
    });

    parsedAnnotation.isGutter = this.guttterFn(annotation);
    super.addAnnotation(parsedAnnotation.id, annotation);

    return parsedAnnotation;
  }

  format(
    annotation: TextAnnotation,
    isNew: boolean,
    hasChanged: boolean,
  ): W3CAnnotation {
    if (!annotation) return null;

    if (!hasChanged) return this.getAnnotation(annotation.id);

    const w3CAnnotation = isNew
      ? createTextSelectionAnnotation(
          this.sourceUri,
          this.language,
          this.text.substring(annotation.start, annotation.end + 1),
          annotation,
        )
      : updateTextSelectionAnnotation(
          this.getAnnotation(annotation.id),
          this.sourceUri,
          this.language,
          this.text.substring(annotation.start, annotation.end + 1),
          annotation,
        );

    super.addAnnotation(annotation.id, w3CAnnotation);

    return w3CAnnotation;
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
