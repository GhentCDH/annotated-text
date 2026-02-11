import type { AnnotationRender } from '../adapter/annotation/renderer';
import { type BaseAnnotation, type TagDrawMetadata, tagDrawMetadataSchema } from '../model';
import { BaseAnnotationDi } from '../di/BaseAnnotationDi';

/**
 * Function type that extracts a tag label string from an annotation.
 * @template ANNOTATION - The annotation type
 * @param annotation - The annotation to extract the label from
 * @returns The tag label string
 */
export type tagLabelFn<ANNOTATION> = (annotation: ANNOTATION) => string;

export type TagConfig = {
  label: string;
  padding: number;
  fontSize: number;
  enabledOnHover: boolean;
};

/**
 * Responsible for resolving tag metadata for annotations.
 *
 * Uses a configurable {@link tagLabelFn} to extract a label from an annotation,
 * and delegates to the renderer to decide whether the tag should be drawn.
 *
 * @template ANNOTATION - The annotation type, must have at least an `id` field
 */
export class TagRenderer<
  ANNOTATION extends BaseAnnotation,
> extends BaseAnnotationDi {
  /**
   * Function to get the tag label string from an annotation.
   * When `null`, no tags will be produced by {@link getTagConfig}.
   */
  tagFn: tagLabelFn<ANNOTATION> | null;

  /**
   * Sets the function used to derive a tag label from an annotation.
   * Pass `null` to disable tag rendering.
   *
   * @param tagFn - Label extraction function, or `null` to disable tags
   */
  setTagFn(tagFn: tagLabelFn<ANNOTATION> | null) {
    this.tagFn = tagFn;
  }

  /**
   * Builds the draw metadata for an annotation's tag.
   *
   * Returns `null` when any of the following is true:
   * - No {@link tagFn} has been set
   * - The renderer does not support tags (`renderInstance.renderTag` is `false`)
   * - The {@link tagFn} returns an empty string for the given annotation
   *
   * @param annotation - The annotation to generate tag metadata for
   * @param renderInstance - The renderer that will draw the annotation; checked for tag support
   * @returns The tag draw metadata, or `null` if the tag should not be rendered
   */
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
      enabledOnHover: false,
    });
  }
}
