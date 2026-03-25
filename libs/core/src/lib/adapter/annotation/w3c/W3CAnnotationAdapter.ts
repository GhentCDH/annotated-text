import {
  type W3CAnnotation,
  w3cAnnotation,
  W3CAnnotationBuilder,
} from '@ghentcdh/w3c-utils';
import {
  AnnotationAdapter,
  type AnnotationAdapterParams,
} from '../AnnotationAdapter';
import {
  type Annotation,
  AnnotationId,
  annotationSchema,
  type TextAnnotation,
} from '../../../model';

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
  private readonly w3cBuilderMap = new Map<
    AnnotationId,
    W3CAnnotationBuilder
  >();

  constructor(params: W3CAnnotationAdapterParams = {}) {
    super(params);
  }

  override setParams(params: W3CAnnotationAdapterParams) {
    this.sourceUri = params.sourceUri ?? this.sourceUri;
    this.language = params.language ?? this.language;
    super.setParams(params);
  }

  _parse(annotation: W3CAnnotation): Annotation | null {
    const builder = w3cAnnotation(annotation);
    const selector = builder.getTextPositionSelector(this.sourceUri)[0];

    if (!selector) return null;

    this.w3cBuilderMap.set(annotation.id, builder);

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

    if (!isNew && !annotation.id) {
      throw new Error('annotation id is required');
    }

    const builder = isNew
      ? w3cAnnotation()
      : this.w3cBuilderMap.get(annotation.id);

    if (!builder)
      throw new Error(
        `No builder found for annotation ${annotation.id}. This should not happen.`,
      );

    const sourceUri = this.sourceUri ?? '';
    if (isNew) {
      builder.setId(`new:annotation:${annotation.id}`);
    }
    if (!builder.getSpecificResourceTargets(sourceUri).length) {
      builder.setTarget({
        type: 'SpecificResource',
        language: this.language!,
        source: sourceUri,
        textDirection: this.textAdapter.textDirection ?? 'ltr',
      });
    }
    builder.updateTextPositionSelector(
      { start: annotation.start, end: annotation.end },
      sourceUri!,
    );

    const _w3c = builder.build();

    this.w3cBuilderMap.set(annotation.id, builder);
    this.addAnnotation(annotation.id, _w3c, annotation);

    return _w3c;
  }
}

export const W3CAnnotationAdapter = (
  params: W3CAnnotationAdapterParams = {},
): AnnotationAdapter<W3CAnnotation> => {
  return new W3CAnnotationAdapterImpl(params);
};
