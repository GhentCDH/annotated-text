import { v4 as uuidv4 } from "uuid";
import {
  createAnnotatedText,
  TextAnnotation,
  TextLineAdapter,
} from "@ghentcdh/vue-component-annotated-text";
import { waitUntilElementExists } from "../waitUntilElementExists";
import { greekText } from "../data";

const createChunk = (element: HTMLElement, annotation: TextAnnotation) => {
  const id = uuidv4();
  const div = document.createElement(`div`);
  div.setAttribute("id", id);
  div.style.border = "1px solid black";
  element.appendChild(div);

  createAnnotatedText(id, {
    text: TextLineAdapter({
      limit: { start: annotation.start, end: annotation.end },
    }),
  })
    .setText(greekText.text)
    .setAnnotations([annotation]);
};

export const textWithChunks = (id: string, chunksId: string) => {
  const annotations: TextAnnotation[] = greekText.annotations
    .filter((a) => a.target === "text")
    .slice(0, 10);

  waitUntilElementExists(id).then((element) => {
    createAnnotatedText(id, {
      text: TextLineAdapter(),
      annotation: { create: true, edit: true },
    })
      .setText(greekText.text)
      .setAnnotations(annotations);
  });

  waitUntilElementExists(chunksId).then((element) => {
    annotations.forEach((annotation) => createChunk(element, annotation));
  });
};
