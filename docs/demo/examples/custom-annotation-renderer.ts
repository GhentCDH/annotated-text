import {
  Annotation,
  clearAnnotatedTextCache,
  createAnnotatedText,
} from "@ghentcdh/annotated-text";
import { annotationColors } from "../data/const";
import { UnderLineAnnotationRender } from "../../../libs/core/src/lib/compute/compute/UnderLineAnnotationRender";
import { TextAnnotationRender } from "../../../libs/core/src/lib/compute/compute/TextAnnotationRender";
import { GutterAnnotationRender } from "../../../libs/core/src/lib/compute/compute/GutterAnnotationRender";
import { AnnotationRenderFn } from "../../../libs/core/src/lib/adapter/annotation/DefaultAnnotationRender";

const annotations = [
  {
    start: 11,
    end: 20,
    color: annotationColors["2"],
    target: "text",
    label: "gts",
    id: "1",
  },
  {
    start: 42,
    end: 51,
    color: annotationColors["3"],
    target: "text",
    label: "gts",
    id: "2",
  },
  {
    start: 63,
    end: 90,
    color: annotationColors["7"],
    target: "text",
    label: "gts",
    id: "3",
  },
] as Annotation[];

const text = `This is an underline annotation
this is a highlight annotation
this is a gutter annotation`;

export const customAnnotationRender = (id_default: string) => {
  clearAnnotatedTextCache();
  const activeAnnotations = [];

  const customRenderFn: AnnotationRenderFn = (annotation: Annotation) => {
    switch (annotation.id) {
      case "1":
        return UnderLineAnnotationRender;
      case "3":
        return GutterAnnotationRender;
      default:
        return TextAnnotationRender;
    }
  };

  createAnnotatedText(id_default, {
    annotation: {
      renderFn: customRenderFn,
    },
  })
    .setText(text)
    .setAnnotations(annotations)
    .highlightAnnotations(activeAnnotations);
};
