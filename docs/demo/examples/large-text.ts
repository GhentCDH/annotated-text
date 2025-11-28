import { createAnnotatedText, TextLineAdapter } from "@ghentcdh/annotated-text";
import { largeGreekText } from "../data";
import { DemoAnnotationConfig } from "../data/data.types";

export const largeText = (id: string) => {
  createAnnotatedText(id, {
    text: TextLineAdapter(),
    annotation: DemoAnnotationConfig,
  })
    .setText(largeGreekText.text)
    .setAnnotations(largeGreekText.annotations);
};
