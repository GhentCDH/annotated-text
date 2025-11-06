/* eslint-disable no-console */
import { Annotation, createAnnotatedText, MarkdownTextAdapter, TextLineAdapter } from "@ghentcdh/annotated-text";
import { greekText, markdownText, plainText } from "../data";

const printPosition = (event: any) => {
  const annotation = event.data.annotation as Annotation;
  console.log("Annotation start:", annotation.start, " end:", annotation.end);
};

export const limitLinesPlainText = (id: string, ignoreLines?: boolean) => {
  createAnnotatedText(id, {
    text: { limit: { start: 200, end: 400, ignoreLines } },
    annotation: { edit: true, create: true },
  })
    .setText(plainText.text)
    .setAnnotations(plainText.annotations)
    .on("annotation-edit--end", printPosition);
};

export const limitLinesMarkdown = (id: string, ignoreLines?: boolean) => {
  createAnnotatedText(id, {
    text: MarkdownTextAdapter({
      limit: { start: 57, end: 400, ignoreLines },
    }),
    annotation: { edit: true },
  })
    .setText(markdownText.text)
    .setAnnotations(markdownText.annotations)
    .on("annotation-edit--end", printPosition);
};
export const limitLinesLineText = (id: string, ignoreLines?: boolean) => {
  createAnnotatedText(id, {
    text: TextLineAdapter({ limit: { start: 200, end: 400, ignoreLines } }),
    annotation: { edit: true, render: greekText.render },
  })
    .setText(greekText.text)
    .setAnnotations(greekText.annotations)
    .on("annotation-edit--end", printPosition);
};
