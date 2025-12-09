import {
  createTextSelectionAnnotation,
  findTextPositionSelector,
  updateTextSelectionAnnotation,
} from './utils';
import { type W3CAnnotation } from './model';
import {
  AnnotationAdapter,
  createAnnotationAdapter,
  type createAnnotationAdapterParams,
} from '../AnnotationAdapter';
import {
  type Annotation,
  annotationSchema,
  type TextAnnotation,
} from '../../../model';
import { selectText } from '../../text/utils/select-text';

export class W3CAnnotationAdapterImpl extends AnnotationAdapter<W3CAnnotation> {
  name = 'W3CAnnotationAdapter';

  constructor(
    private readonly sourceUri?: string,
    private readonly language?: string,
  ) {
    super();
  }

  _parse(annotation: W3CAnnotation): Annotation | null {
    const selector = findTextPositionSelector(this.sourceUri)(
      annotation,
    )?.selector;

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

    if (!isNew && !hasChanged) return this.getAnnotation(annotation.id);

    const selectedText = selectText(
      this.text,
      annotation.start,
      annotation.end,
      this.offsetStart,
    );

    const w3CAnnotation = isNew
      ? createTextSelectionAnnotation(
          this.sourceUri!,
          this.language!,
          selectedText,
          annotation,
        )
      : updateTextSelectionAnnotation(
          this.getAnnotation(annotation.id),
          this.sourceUri!,
          this.language!,
          selectedText,
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
