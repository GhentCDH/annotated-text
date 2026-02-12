import {
  createTextSelectionAnnotation,
  findTextPositionSelector,
  updateTextSelectionAnnotation,
} from './utils';
import { type W3CAnnotation } from './model';
import {
  AnnotationAdapter,
  type AnnotationAdapterParams,
} from '../AnnotationAdapter';
import {
  type Annotation,
  annotationSchema,
  type TextAnnotation,
} from '../../../model';
import { selectText } from '../../text/utils/select-text';

export type W3CAnnotationAdapterParams = {
  sourceUri?: string;
  language?: string;
} & AnnotationAdapterParams;

export class W3CAnnotationAdapterImpl extends AnnotationAdapter<
  W3CAnnotation,
  W3CAnnotationAdapterParams
> {
  name = 'W3CAnnotationAdapter';
  private sourceUri?: string;
  private language?: string;

  constructor(params: W3CAnnotationAdapterParams = {}) {
    super(params);
  }

  override setParams(params: W3CAnnotationAdapterParams) {
    this.sourceUri = params.sourceUri;
    this.language = params.language;
    super.setParams(params);
  }

  _parse(annotation: W3CAnnotation): Annotation | null {
    const selector = findTextPositionSelector(this.sourceUri)(annotation);

    if (!selector) return null;

    const parsedAnnotation = annotationSchema.parse({
      id: annotation.id,
      start: selector.start,
      end: selector.end,
    });

    return parsedAnnotation;
  }

  format(
    annotation: TextAnnotation,
    isNew: boolean,
    hasChanged: boolean,
  ): W3CAnnotation | null {
    if (!annotation) return null;

    const originalAnnotation = this.getOriginalAnnotation(annotation.id);

    if (!isNew && !hasChanged) return originalAnnotation;

    const selectedText = selectText(
      this.text,
      annotation.start,
      annotation.end,
      this.startOffset,
    );

    const w3CAnnotation = isNew
      ? createTextSelectionAnnotation(
          this.sourceUri!,
          this.language!,
          selectedText,
          annotation,
        )
      : updateTextSelectionAnnotation(
          originalAnnotation,
          this.sourceUri!,
          this.language!,
          selectedText,
          annotation,
        );

    this.addAnnotation(annotation.id, w3CAnnotation, annotation);

    return w3CAnnotation;
  }
}

export const W3CAnnotationAdapter = (
  params: W3CAnnotationAdapterParams = {},
): AnnotationAdapter<W3CAnnotation> => {
  return new W3CAnnotationAdapterImpl(params);
};
