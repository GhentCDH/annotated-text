import {
  Annotation,
  createAnnotatedText,
  TextLineAdapter,
} from "@ghentcdh/annotated_text";
import { greekText } from "../data";

const createAnnotatedTextWithLines = (
  annotation: Annotation,
  textContainer: HTMLElement,
  ignoreLines: boolean,
) => {
  const ann = document.createElement("div");
  ann.id = `annotation-selection-${annotation.id}-${ignoreLines}`;
  ann.style.borderBottom = "1px solid #ccc";
  ann.style.paddingBottom = "10px";
  textContainer.appendChild(ann);

  createAnnotatedText(ann.id, {
    text: TextLineAdapter({
      limit: {
        start: annotation.start,
        end: annotation.end,
        ignoreLines,
      },
    }),
  })
    .setText(greekText.text)
    .setAnnotations([annotation]);
};

export const linesAllAnnotationInSelection = (id: string) => {
  if (!document) return;
  const element = document.getElementById(id);
  const annotations = greekText.annotations;

  const textContainer = document.createElement("div");
  textContainer.style.display = "grid";
  textContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
  textContainer.style.gap = "10px";
  element.appendChild(textContainer);
  annotations
    .filter((a) => a.target === "text")
    .slice(0, 4)
    .forEach((annotation) => {
      const annInfo = document.createElement("div");
      annInfo.style.gridColumn = "span 2";
      annInfo.innerText = `${annotation.start}-${annotation.end} -(${annotation.id})`;
      textContainer.appendChild(annInfo);
      createAnnotatedTextWithLines(annotation, textContainer, false);
      createAnnotatedTextWithLines(annotation, textContainer, true);
    });
};
