import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from "@ghentcdh/annotated-text";
import { greekText } from "../data";
import { DemoAnnotationConfig } from "../data/data.types";

export const ActiveAnnotations = (id_default: string, id_underline: string) => {
  clearAnnotatedTextCache();
  const text = greekText.text.substring(0, 250);
  const annotations = greekText.annotations.slice(0, 12);
  const activeAnnotations = [annotations[0].id, annotations[1].id];
  const selectedAnnotations = [annotations[4].id, annotations[9].id];

  const renderFn = (annotation: any) =>
    annotation.target === "gutter" ? "gutter" : null;

  createAnnotatedText(id_default, {
    text: TextLineAdapter(),
    annotation: {
      style: DemoAnnotationConfig.style,
      render: {
        defaultRenderer: "highlight",
        renderFn,
      },
    },
  })
    .setText(text)
    .setAnnotations(annotations)
    .highlightAnnotations(activeAnnotations)
    .selectAnnotations(selectedAnnotations);

  createAnnotatedText(id_underline, {
    text: TextLineAdapter(),
    annotation: {
      style: DemoAnnotationConfig.style,
      render: {
        defaultRenderer: "underline",
        renderFn,
      },
    },
  })
    .setText(text)
    .setAnnotations(annotations)
    .highlightAnnotations(activeAnnotations)
    .selectAnnotations(selectedAnnotations);
};
