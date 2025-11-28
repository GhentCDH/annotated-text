import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextAnnotation,
} from "@ghentcdh/annotated-text";
import { annotationColors } from "../data/const";

const annotations = [
  { start: 0, end: 200, target: "gutter", color: "", id: "p1" },
  {
    start: 65,
    end: 68,
    target: "underline",
    color: annotationColors["1"],
    id: "red",
  },
  {
    start: 109,
    end: 114,
    target: "highlight",
    color: annotationColors["5"],
    id: "green",
  },
] as any as TextAnnotation[];

const text = `This is an example text with custom styles.
The first line has a red annotation color.
The second line has a green annotation color.`;

export const customStyles = (id: string) => {
  clearAnnotatedTextCache();
  createAnnotatedText(id, {
    annotation: {
      render: {
        renderFn: (annotation: any) => annotation.target,
      },
      tagConfig: {
        enabled: true,
        tagFn: (a) => a.id,
      },
    },
  })
    .setText(text)
    .setAnnotations(annotations);
};
