import type { AnnotationRender } from '../adapter/annotation';
import { type BaseAnnotation, type TagDrawMetadata, tagDrawMetadataSchema } from '../model';
import { BaseAnnotationDiFn } from '../di/BaseAnnotationDi';
import type { AnnotationModule } from '../di/annotation.module';

export type tagLabelFn<ANNOTATION> = (annotation: ANNOTATION) => string;

export type TagConfig = {
  label: string;
  padding: number;
  fontSize: number;
  enabledOnHover: boolean;
};

export class TagRenderer<
  ANNOTATION extends BaseAnnotation,
> extends BaseAnnotationDiFn {
  constructor(annotationModule: AnnotationModule) {
    super();
    this.setModule(annotationModule);
  }

  /**
   * Function to get the tag string from an annotation.
   * @param annotation
   */
  tagFn: tagLabelFn<ANNOTATION> | null;

  setTagFn(tagFn: tagLabelFn<ANNOTATION> | null) {
    this.tagFn = tagFn;
  }

  getTagConfig(
    annotation: ANNOTATION,
    renderInstance: AnnotationRender<any>,
  ): TagDrawMetadata | null {
    if (!this.tagFn) return null;
    if (!renderInstance.renderTag) return null;

    const label = this.tagFn(annotation);
    if (!label) return null;

    // TODO will be replaced if styles are refactored, then the right params will be passed
    return tagDrawMetadataSchema.parse({
      label,
      padding: 1,
      fontSize: 8,
      enabledOnHover: true,
    });
  }
}
