import { SVG_ID, SVG_ROLE, SvgModel } from "../../model/svg.types";
import { Annotation } from "@ghentcdh/annotated-text";
import memoize from "memoizee";
import { TagConfig } from "../../../adapter/annotation/DefaultTag";

const defaultParams = memoize((tagConfig: TagConfig<any>) => {
  const fontSize = `${tagConfig.fontSize || 12}px`;
  const padding = tagConfig.padding;

  return { fontSize, padding };
});

const calculateTextDimensions = memoize(
  (x, y, textWidth, textHeight, padding) => {
    const left = x + 4;
    const top = y - textHeight / 2;
    return {
      rectDimensions: {
        x: left,
        y: top,
        width: textWidth + padding * 2,
        height: textHeight + padding * 2,
      },
      textDimensions: { x: left + padding, y: y + padding },
    };
  },
);

const calculateTextWidth = (text: string, tagGroup: any, fontSize: number) => {
  // Add temporary text to measure width
  const tempText = tagGroup
    .append("text")
    .attr("font-size", fontSize)
    .text(text);

  // Get text width
  const bbox = tempText.node()?.getBBox();
  const textWidth = bbox?.width || 0;
  const textHeight = bbox?.height || 0;

  // Remove temporary text
  tempText.remove();

  return { textWidth, textHeight };
};

export const drawTag = (svgModel: SvgModel, annotation: Annotation) => {
  const tagConfig = svgModel.annotationAdapter.tagConfig;
  if (!tagConfig.enabled) return;

  const annotationDimensions = svgModel.model.getAnnotationDimensions(
    annotation.id,
  );
  if (!annotationDimensions) return;

  const startAnnotation = {
    x: annotationDimensions.x,
    y: annotationDimensions.y2,
  };

  // Create a group for the tag
  const tagGroup = svgModel.tagSvg
    .append("g")
    .attr(SVG_ID.ANNOTATION_UID, annotation.id)
    .attr(SVG_ID.ANNOTATION_ROLE, SVG_ROLE.TAG);

  const { fontSize, padding } = defaultParams(tagConfig);
  const text = tagConfig.tagFn(annotation);

  const { textWidth, textHeight } = calculateTextWidth(
    text,
    tagGroup,
    tagConfig.fontSize,
  );
  const { rectDimensions, textDimensions } = calculateTextDimensions(
    startAnnotation.x,
    startAnnotation.y,
    textWidth,
    textHeight,
    padding,
  );

  // Add background rectangle with border
  tagGroup
    .append("rect")
    .attr(SVG_ID.ANNOTATION_UID, annotation.id)
    .attr(SVG_ID.ANNOTATION_ROLE, SVG_ROLE.TAG)
    .attr("x", rectDimensions.x)
    .attr("y", rectDimensions.y)
    .attr("width", rectDimensions.width)
    .attr("height", rectDimensions.height)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("rx", 3); // rounded corners

  // Add text
  tagGroup
    .append("text")
    .attr("x", textDimensions.x)
    .attr("y", textDimensions.y)
    .attr("dominant-baseline", "central")
    .attr("font-size", fontSize)
    .attr("fill", "black")
    .text(text);
};
