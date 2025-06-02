import { drag, select } from "d3";
import { TextAnnotationModel } from "./annotation.model";

import { styles } from "./styles.const";
import { drawComputedAnnotations } from "./draw/annotations";

export * from "./draw/text";
// Set up SVG dimensions

export const drawAnnotations = (
  textElement: HTMLElement,
  textAnnotationModel: TextAnnotationModel,
) => {
  // Create SVG element
  const width = textElement.getBoundingClientRect().width;
  const height = textElement.getBoundingClientRect().height;

  const svg = select("body")
    .append("svg")
    .attr("class", styles.svg)
    .attr("width", width)
    .attr("height", height)
    .style("font-family", "sans-serif")
    .style("font-size", "16px");

  drawComputedAnnotations(textAnnotationModel, svg);

  return svg;
  // return svg.node();

  // draw a rectangle
  const rectData = {
    x: 100,
    y: 50,
    width: 200,
    height: 100,
  };

  const rect = svg
    .append("rect")
    .attr("x", rectData.x)
    .attr("y", rectData.y)
    .attr("width", rectData.width)
    .attr("height", rectData.height)
    .attr("fill", "none")
    .attr("stroke", "black");

  const handle = svg
    .append("circle")
    .attr("class", "handle")
    .attr("r", 6)
    .attr("fill", "gray")
    .attr("cx", rectData.x + rectData.width / 2)
    .attr("cy", rectData.y + rectData.height)
    .call(drag().on("drag", onDrag));

  function onDrag(event) {
    const newHeight = Math.max(10, event.y - rectData.y); // enforce min height
    rectData.height = newHeight;

    rect.attr("height", newHeight);
    handle.attr("cy", rectData.y + newHeight);
  }

  return svg;
};
