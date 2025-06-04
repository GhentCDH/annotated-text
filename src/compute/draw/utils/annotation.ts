import { SvgModel } from "../../model/svg.types";
import { AnnotationDrawColor } from "../../annotation.model";

/**
 * @deprecated
 * @param svg
 * @param annotationUuid
 * @param color
 */
export const colorAnnotation = (
  svg: SvgModel,
  annotationUuid: string,
  color: AnnotationDrawColor,
) => {
  svg.colorAnnotation(annotationUuid, color);
};
