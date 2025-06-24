import { TextAnnotation } from "../../compute/annotation.model";
import { BaseAdapter } from "../BaseAdapter";

export abstract class AnnotationAdapter<ANNOTATION> extends BaseAdapter {
  public create: boolean = false;
  public edit: boolean = false;

  /**
   * Parse an annotation object into a TextAnnotation.
   * @param annotation
   */
  abstract parse(annotation: ANNOTATION): TextAnnotation;

  /**
   * Format a TextAnnotation into an annotation object.
   * @param annotation
   * @param textSelection
   * @param isNew
   */
  abstract format(
    annotation: TextAnnotation,
    textSelection: string,
    isNew: boolean,
  ): ANNOTATION;

  /**
   * Enable or disable edit mode
   * @param edit
   */
  enableEdit(edit: boolean = true): this {
    this.edit = edit;

    return this;
  }

  /**
   * Enable or disable create mode
   * @param create
   */
  enableCreate(create: boolean = true): this {
    this.create = create;

    return this;
  }
}

export type createAnnotationAdapterParams<ANNOTATION> = {
  create?: boolean;
  edit?: boolean;
};

export const createAnnotationAdapter = <ANNOTATION>(
  adapter: AnnotationAdapter<ANNOTATION>,
  params: createAnnotationAdapterParams<ANNOTATION>,
): AnnotationAdapter<ANNOTATION> => {
  if (params.edit) {
    adapter.enableEdit(params.edit);
  }
  if (params.create) {
    adapter.enableCreate(params.create);
  }
  return adapter;
};
