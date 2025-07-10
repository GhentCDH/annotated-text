import {
  createAnnotatedText,
  Snapper,
  SnapperAction,
  SnapperResult,
  TextAnnotation,
  TextLineAdapter,
} from "@ghentcdh/vue-component-annotated-text";
import { greekText } from "../data";

class CustomSnapper extends Snapper {
  fixOffset(action: SnapperAction, annotation: TextAnnotation): SnapperResult {
    const { start, end } = annotation;
    switch (action) {
      case "move-end":
        return { start, end: end - 2, modified: true };
      case "move-start":
        return { start: start + 2, end, modified: true };
    }
    return { start, end, modified: false };
  }
}

export const snapper = (id: string) => {
  createAnnotatedText(id, {
    text: TextLineAdapter(),
    annotation: {
      edit: true,
      create: true,
      snapper: new CustomSnapper(),
    },
  })
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
};
