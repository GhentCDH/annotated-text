import { AnnotationSvg } from "../../model/svg.types";
import { AnnotationDrawColor } from "../../annotation.model";

export const findRelatedAnnotations = (
  svg: AnnotationSvg,
  annotationUuid: string,
  selector = "",
) => {
  const annotations = svg.selectAll(
    `[data-annotation-uid="${annotationUuid}"]${selector}`,
  );

  if (annotations.empty()) {
    // console.warn(
    //   `Could not find annotation with uuid ${annotationUuid} to color`,
    // );
    return null;
  }

  return annotations;
};

export const colorAnnotation = (
  svg: any,
  annotationUuid: string,
  color: AnnotationDrawColor,
) => {
  const borders = findRelatedAnnotations(
    svg,
    annotationUuid,
    `[data-annotation-role="border"]`,
  );
  const fills = findRelatedAnnotations(
    svg,
    annotationUuid,
    '[data-annotation-role="fill"]',
  );

  fills?.attr("fill", color.fill).attr("stroke", "none");
  borders?.attr("fill", "none").attr("stroke", color.border);
};
