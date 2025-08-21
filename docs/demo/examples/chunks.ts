import { v4 as uuidv4 } from "uuid";
import {
  Annotation,
  createAnnotatedText,
  TextLineAdapter,
} from "@ghentcdh/annotated_text";
import { greekText } from "../data";

const document = globalThis.document;

const createChunk = (element: HTMLElement, annotation: Annotation) => {
  const id = uuidv4();
  const div = document?.createElement(`div`);
  if (!div) return;

  div.setAttribute("id", id);
  div.style.border = "1px solid black";
  element.appendChild(div);

  return createAnnotatedText(id, {
    text: TextLineAdapter({
      limit: { start: annotation.start, end: annotation.end },
    }),
  })
    .setText(greekText.text)
    .setAnnotations([annotation]);
};

export const textWithChunks = (id: string, chunksId: string) => {
  const annotations = greekText.annotations
    .filter((a) => a.target === "text")
    .slice(0, 10);
  const annotationsMap = {};
  const element = document.getElementById(id);
  createAnnotatedText(id, {
    text: TextLineAdapter(),
    annotation: { create: true, edit: true },
  })
    .setText(greekText.text)
    .setAnnotations(annotations)
    .on("annotation-edit--move", ({ data }) => {
      const annotation = data.annotation;
      annotationsMap[annotation.id].annotatedText
        .setAnnotations([annotation])
        .lineAdapter.setConfig("limit", annotation);
    });
  annotations.forEach((annotation) => {
    annotationsMap[annotation.id] = {
      annotation,
      annotatedText: createChunk(element as HTMLElement, annotation),
    };
  });
};
