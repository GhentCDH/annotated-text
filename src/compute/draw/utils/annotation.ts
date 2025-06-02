import { AnnotationSvg } from "../../model/svg.types";
import { AnnotationDrawColor } from "../../annotation.model";

export const findRelatedAnnotations = (
  svg: AnnotationSvg,
  annotationUuid: string,
) => {
  const annotations = svg.selectAll(
    `[data-annotation-uid="${annotationUuid}"]`,
  );

  if (annotations.empty()) {
    console.warn(
      `Could not find annotation with uuid ${annotationUuid} to color`,
    );
    return null;
  }

  return annotations;
};

export const colorAnnotation = (
  svg: any,
  annotationUuid: string,
  color: AnnotationDrawColor,
) => {
  const annotations = findRelatedAnnotations(svg, annotationUuid);

  annotations?.attr("fill", color.fill).attr("stroke", color.border);
};
